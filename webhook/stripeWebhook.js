require("dotenv").config();
const business = require("../models/businessModel/business");
const { User } = require("../models/User");
const pdfkit = require('pdfkit');
const fs = require('fs');
const pdfPath = process.cwd() + "/uploads/";
const nodemailer = require('nodemailer');
const invoiceAndPaymentNotification = require("../models/businessModel/businessNotification/invoiceAndPaymentNotification");
const adminCustomerPurchaseAndRedeemtionNotification = require("../models/admin/notification/customerPurchaseAndRedeemtionNotification");
const express = require("express");
const bodyParser = require("body-parser");
const ConnectDb = require("../config/db");
const {
  InvoicePaymentNotificationCustomer,
} = require("../models/notification");
ConnectDb();
const app = express();
const {
  adminPaymentTracker,
  customerPaymentTracker,
  customerPurchsedTracker,
  adminPropPaymentOnMilestoneTracker,
  customerRedeemTracker
} = require("../models/admin/PaymentTracker/paymentIdTracker");
const { Cart } = require("../models/Cart");
const { Product } = require("../models/businessModel/product");
const stripe = require("stripe")(process.env.STRIPE_KEY);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_c7b83955ccd4f1692c9b257ff94d8ea58502d4fd02259e4a796d1f70b537bb67";
const createOrder = (session) => {
  // TODO: fill me in
  //   console.log("Creating order", session);
};

const {
  SaveMyCropTrasaction, SaveMyCropExpiry
} = require("../controller/customerCropTransaction");
const {
  SaveMyPropTrasaction,
} = require("../controller/customerPropTransaction");

const sendMail=(email, subject, text)=>{
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE, //comment this line if you use custom server/domain
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html:text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      // return res.status(500).send({ error });
    } else {
      console.log(`Email sent: ${info.response}`);
      // return res.status(200).send({ status: 200, message: "invoice sent." });
    }
  });
}
const fulfillOrder = async (session) => {
  //market order payment method is link
  let findOne = await adminPaymentTracker.findOne({
    paymentLink: session?.payment_link,
  });
  if (findOne) {
    await Product.findByIdAndUpdate(
      { _id: findOne.productId },
      { $set: { status: "scheduled", market: true } }
    );
    await adminPaymentTracker.findByIdAndUpdate(
      { _id: findOne._id },
      {
        $set: {
          status: "paid",
          paymentMethod: session.payment_method_types,
          payment_intent: session.payment_intent,
        },
      }
    );
    await stripe.paymentLinks.update(findOne.paymentLink, { active: false });
    console.log("Fulfilling order updated successfully");
  }

  //customer order payment tracker with checout page

  let findOneRecord = await customerPaymentTracker.findOne({
    paymentId: session.id,
  });

  if (await findOneRecord) {
    await customerPaymentTracker.findByIdAndUpdate(
      { _id: findOneRecord._id },
      { $set: { status: "paid", payment_intent: session.payment_intent } }
    );
  } else {
    console.log("record is not found for verify");
  }

  let findOneCustomerPointPurchasePaymentRequest =
    await customerPurchsedTracker.findOne({ paymentId: session.id });
  if (findOneCustomerPointPurchasePaymentRequest) {
    await customerPurchsedTracker.findByIdAndUpdate(
      { _id: findOneCustomerPointPurchasePaymentRequest._id },
      { $set: { status: "paid", payment_intent: session.payment_intent } }
    );
    console.log("payment intent updated purchase point");
  } else {
    console.log("record is not found for update payment intent purchase point");
  }

  let findRecordForMilestonePaymentProp =
    await adminPropPaymentOnMilestoneTracker.findOne({
      paymentLink:session.payment_link,
    });
  if(findRecordForMilestonePaymentProp){
    await adminPropPaymentOnMilestoneTracker.findByIdAndUpdate({_id:findRecordForMilestonePaymentProp._id},
      {$set: { status: "paid", payment_intent: session.payment_intent }} 
      )
      await stripe.paymentLinks.update(findRecordForMilestonePaymentProp.paymentLink, { active: false })  
    console.log("payment intent updated on milestone prop payment")
  }
  let findOneForRedeem = await customerRedeemTracker.findOne({
    paymentId: session.id
  })
  if(await findOneForRedeem){
    await customerRedeemTracker.findByIdAndUpdate(
      { _id: findOneForRedeem._id },
      { $set: { status: "paid", payment_intent: session.payment_intent } }
    );
  }  
};

const emailCustomerAboutFailedPayment = async (session) => {
  console.log("Emailing customer", session);
};
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];
    let paymentLink = "";
    let payment_intent = "";
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Save an order in your database, marked as 'awaiting payment'
        createOrder(session);
        // Check if the order is paid (for example, from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === "paid") {
          fulfillOrder(session);
        }

        break;
      }
      case "invoice.payment_succeeded": {
        const session = event.data.object;
        let findOne = await adminPaymentTracker.findOne({
          payment_intent: session.payment_intent,
        });
        if (await findOne) {
          await adminPaymentTracker.findByIdAndUpdate(
            { _id: findOne._id },
            {
              $set: {
                status: session.status,
                invoice_paid_time: session.created,
                customer_email: session.customer_email,
                invoice_id: session.id,
                invoice_url: session.hosted_invoice_url,
                invoice_pdf: session.invoice_pdf,
                number:session.number,
              },
            }
          );
          sendMail(session.customer_email, "top ranking payment invoice", `<p>Thank you for payment you can download invoice <a href=${session.invoice_pdf}>Here</a></p>`)
          // , hosted_invoice_url,: "",
          console.log("business invoices successfully updated");
        }
        
        let findOneRecord = await customerPaymentTracker.findOne({
          payment_intent: session.payment_intent,
        });
        if (await findOneRecord) {
          await customerPaymentTracker.findByIdAndUpdate(
            { _id: findOneRecord._id },
            {
              $set: {
                status: session.status,
                invoice_paid_time: session.created,
                customer_email: session.customer_email,
                invoice_id: session.id,
                invoice_url: session.hosted_invoice_url,
                invoice_pdf: session.invoice_pdf,
                customer_shipping: session.customer_shipping,
                customer_address: session.customer_address,
                number: session.number,
                name: session.customer_name,
              },
            }
          );
          sendMail(session.customer_email, "purchased product invoice", `<p>Thank you for payment you can download invoice <a href=${session.invoice_pdf}>Here</a></p>`)
          // , hosted_invoice_url,: "",
          console.log("customer invoices successfully updated");
          let { cartDetails } = findOneRecord;
          var customerCropPoint = 0;
          for (let i = 0; i < cartDetails.cartItems.length; i++) {
            customerCropPoint =
              customerCropPoint +
              parseFloat(
                cartDetails.cartItems[i].cropRulesWithBonus *
                  cartDetails.cartItems[i].cartQuantity
              );
            let quantity = await Product.findOne({_id:cartDetails.cartItems[i]._id})
            quantity = parseInt(quantity.quantity) - parseInt(cartDetails.cartItems[i].cartQuantity)
            await Product.findByIdAndUpdate({_id:cartDetails.cartItems[i]._id},{$set:{quantity: quantity}})
            console.log("product id", cartDetails.cartItems[i]._id);
            console.log("business id", cartDetails.cartItems[i]?.user);
            const user = cartDetails.cartItems[i]?.user;
            console.log("finding customer");
            const findBusiness = await business.findOne({ _id: user });
            if (findBusiness) {
              let cropPoint =
                (await findBusiness.croppoint) +
                cartDetails.cartItems[i].cartQuantity *
                  cartDetails.cartItems[i].cropRulesWithBonus;

              await business.findByIdAndUpdate(
                { _id: findBusiness._id },
                { $set: { croppoint: cropPoint } },
                { new: true }
              );
            }
            const savePaymentAndNotification = async () => {
              console.log(cartDetails.cartItems[i].user, "user id");
              await invoiceAndPaymentNotification.create({
                type: "Earn Crop",
                desc: "your product has been purchase",
                businessId: cartDetails.cartItems[i].user,
                payment: {
                  transactionId: findOneRecord.payment_intent,
                },
                purchaseOrder: {
                  orderId: findOneRecord._id,
                },
              });
              console.log("payment notification created");
            };
            await Cart.updateMany({ user_id: findOneRecord.cartDetails.user_id},{$pull: {cart:{_id: cartDetails.cartItems[i]._id }}})
            // await Cart.find({ 'user_id': findOneRecord.cartDetails.user_id }).deleteOne({'cart.$._id':cartDetails.cartItems[i]._id})
            savePaymentAndNotification();
          }
          let customer = cartDetails.user_id;
          let customerCart = cartDetails.id;
          console.log("finding customer");
          console.log(customer);
          let findOneCustomer = await User.findOne({ _id: customer });
          // let findOneCustomer = await User.findOne({ _id: customer });
          if (findOneCustomer) {
            let customerNewCropPoint =
              findOneCustomer.croppoints + customerCropPoint;
            await User.findByIdAndUpdate(
              { _id: findOneCustomer._id },
              { $set: { croppoints: customerNewCropPoint } },
              { new: true }
            );
          }
          console.log("Check Invoice",session)
          SaveMyCropTrasaction(
            session.subtotal/100,
            customerCropPoint,
            "credit",
            "purchase product",
            findOneRecord.payment_intent,
            findOneRecord.cartDetails.user_id,
            session.number,
            session.hosted_invoice_url,
            session.invoice_pdf,
          );
        } else {
          console.log("record is not found for updating invoice details");
        }

        let findOneCustomerPointPurchasePaymentRequest =
          await customerPurchsedTracker.findOne({
            payment_intent: session.payment_intent,
          });
        let findUser;
        if (await findOneCustomerPointPurchasePaymentRequest) {
          await customerPurchsedTracker.findByIdAndUpdate(
            { _id: findOneCustomerPointPurchasePaymentRequest._id },
            {
              $set: {
                status: session.status,
                invoice_paid_time: session.created,
                customer_email: session.customer_email,
                invoice_id: session.id,
                invoice_url: session.hosted_invoice_url,
                invoice_pdf: session.invoice_pdf,
                number: session.number,
                name: session.customer_name,
              },
            }
          );
          
          findUser = await User.findOne({
            _id: findOneCustomerPointPurchasePaymentRequest.user,
          });
          if (findOneCustomerPointPurchasePaymentRequest.type == "CROP") {
            SaveMyCropTrasaction(
              findOneCustomerPointPurchasePaymentRequest.amount,
              findOneCustomerPointPurchasePaymentRequest.quantity,
              "credit",
              "purchased CROP",
              findOneCustomerPointPurchasePaymentRequest.payment_intent,
              findOneCustomerPointPurchasePaymentRequest.user
            );
            if (findUser) {
              let customerNewCropPoint =
                findUser.croppoints +
                findOneCustomerPointPurchasePaymentRequest.quantity;
              await User.findByIdAndUpdate(
                { _id: findUser._id },
                { $set: { croppoints: customerNewCropPoint } },
                { new: true }
              );
            }
            sendMail(session.customer_email, "purchased CROP invoice", `<p>Thank you for payment you can download invoice <a href=${session.invoice_pdf}>Here</a></p>`)
          } else if (
            findOneCustomerPointPurchasePaymentRequest.type == "PROP"
          ) {
            SaveMyPropTrasaction(
              findOneCustomerPointPurchasePaymentRequest.amount,
              findOneCustomerPointPurchasePaymentRequest.quantity,
              "credit",
              "purchased PROP",
              findOneCustomerPointPurchasePaymentRequest.payment_intent,
              findOneCustomerPointPurchasePaymentRequest.user,
              session.number,
              session.hosted_invoice_url,
              session.invoice_pdf,
            );
            sendMail(session.customer_email, "purchased PROP invoice", `<p>Thank you for payment you can download invoice <a href=${session.invoice_pdf}>Here</a></p>`)
            if (findUser) {
              let customerNewPropPoint =
                findUser.proppoints +
                findOneCustomerPointPurchasePaymentRequest.quantity;
              await User.findByIdAndUpdate(
                { _id: findUser._id },
                { $set: { proppoints: customerNewPropPoint } },
                { new: true }
              );
            }
          }
          console.log("customer purchase point invoices successfully updated");
        } else {
          console.log(
            "record is not found for updating purchase point invoice details"
          );
        }

        let findCustomerForMilestonePropPaymentInvoice = 
        await adminPropPaymentOnMilestoneTracker.findOne({
          payment_intent: session.payment_intent,
        })
        if(findCustomerForMilestonePropPaymentInvoice){
          await adminPropPaymentOnMilestoneTracker.findByIdAndUpdate(
            {_id: findCustomerForMilestonePropPaymentInvoice._id},
           {$set:{
            invoice_paid_time: session.created,
            customer_email: session.customer_email,
            invoice_id: session.id,
            invoice_url: session.hosted_invoice_url,
            invoice_pdf: session.invoice_pdf,
            number: session.number,
            name: session.customer_name,
           }}
           )  
           sendMail(session.customer_email, "you have sent milestone PROPS", `<p>Thank you for payment you can download invoice <a href=${session.invoice_pdf}>Here</a></p>`)
           SaveMyPropTrasaction(
            findCustomerForMilestonePropPaymentInvoice.amount,
            findCustomerForMilestonePropPaymentInvoice.quantity,
            "credit",
            findCustomerForMilestonePropPaymentInvoice.type,
            findCustomerForMilestonePropPaymentInvoice.payment_intent,
            findCustomerForMilestonePropPaymentInvoice.user
          );
          if(findCustomerForMilestonePropPaymentInvoice.milestone === 5000){
            await User.findByIdAndUpdate(
              {_id:findCustomerForMilestonePropPaymentInvoice.user},
              {$set:{fiveKCropMileStone:true}}
            )
          }else if(findCustomerForMilestonePropPaymentInvoice.milestone === 10000){        
          await User.findByIdAndUpdate(
            {_id:findCustomerForMilestonePropPaymentInvoice.user},
            {$set:{tenKCropMileStone:true}}
          )
          }else if(findCustomerForMilestonePropPaymentInvoice.milestone === 25000){        
            await User.findByIdAndUpdate(
              {_id:findCustomerForMilestonePropPaymentInvoice.user},
              {$set:{twentyFiveKCropMileStone:true}}
            )
          }else if(findCustomerForMilestonePropPaymentInvoice.milestone >= 30000){        
            await User.findByIdAndUpdate(
              {_id:findCustomerForMilestonePropPaymentInvoice.user},
              {$set:{newMileStone:findCustomerForMilestonePropPaymentInvoice.milestone+5000}}
            )
          }else{
            console.log("milestone flag updation failed")
          }
        }

        let findOneForRedeemInvoiceUpdate = await customerRedeemTracker.findOne({
          payment_intent: session.payment_intent,
        })

        if(await findOneForRedeemInvoiceUpdate){
          await customerRedeemTracker.findByIdAndUpdate(
            { _id: findOneForRedeemInvoiceUpdate._id },
            {
              $set: {
                status: session.status,
                invoice_paid_time: session.created,
                customer_email: session.customer_email,
                invoice_id: session.id,
                invoice_url: session.hosted_invoice_url,
                invoice_pdf: session.invoice_pdf,
                number: session.number,
                name: session.customer_name,
              },
            }
          );
            let notification =
            await adminCustomerPurchaseAndRedeemtionNotification.find();
          notification = notification[0]._doc;
          await new InvoicePaymentNotificationCustomer({
            user_id: findOneForRedeemInvoiceUpdate.cartDetails.user_id,
            message: notification.payment_notifications,
          }).save();
        
          let findUserForRedeem = await User.findOne({_id:findOneForRedeemInvoiceUpdate.cartDetails.user_id})
        let newCropPoint = findUserForRedeem.croppoints - findOneForRedeemInvoiceUpdate.redeemCropPoints;
        await User.findByIdAndUpdate(
          { _id:findOneForRedeemInvoiceUpdate.cartDetails.user_id },
          { $set: { croppoints: newCropPoint } }
        );
        SaveMyCropTrasaction(
          session.total,
          findOneForRedeemInvoiceUpdate.redeemCropPoints,
          "debit",
          "purchase product by redeem CROP",
          session.payment_intent,
          user_id
        );
        findOneForRedeemInvoiceUpdate.cartDetails.cartItems.map(async(data)=>{
          let findProduct = await Product.findOne({_id:data._id});
          let newQuatity = findProduct.quantity - data.cartQuantity;
          await Product.findByIdAndUpdate({_id:findProduct._id}, {$set:{quantity:newQuatity}})
          await Cart.updateMany({ user_id: findOneForRedeemInvoiceUpdate.cartDetails.user_id},{$pull: {cart:{_id: data._id }}})
        })
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        // Fulfill the purchase...
        fulfillOrder(session);

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;

        // Send an email to the customer asking them to retry their order
        emailCustomerAboutFailedPayment(session);

        break;
      }
    }

    response.status(200).end();
  }
);

app.listen(4242, () => console.log(`server running on port ${4242}`));
