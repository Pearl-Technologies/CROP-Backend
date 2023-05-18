const customerPropTransaction = require('../models/PropTransaction');
const mongoose = require('mongoose');
const { User } = require("../models/User");
const {Token} = require("../models/User");
const pdfkit = require('pdfkit');
const fs = require('fs');
const pdfPath = process.cwd() + "/uploads/";
const nodemailer = require('nodemailer');

const getMyPropTrasaction = async(req, res)=>{
    const { startDate, endDate, search } = req.query;
    let token= req.headers.authorization
    const token_data = await Token.findOne({ token });
    let user= token_data.user;
    try {
      let findone = await customerPropTransaction.find({
        user: mongoose.Types.ObjectId(`${user}`),
      });
      if (!findone.length) {
        return res
          .status(200)
          .send({ msg: "no order", data: findone, status: 200 });
      }
      if (startDate && endDate) {
        const trasactionDetails = await customerPropTransaction.aggregate([
          {
            $match: {
              user: { $eq: findone[0].user },
            },
          },
          {
            $match: {
              createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            },
          },
        
          {
            $project: {
              orderNumber: 1,
              transactionType: 1,
              prop: 1,
              amount: 1,
              description: 1,
              createdAt: 1,
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
        return res.status(200).send({ data: trasactionDetails, status: 200 });
      }
      if (search) {
        const trasactionDetails = await customerPropTransaction.aggregate([
          {
            $match: {
              user: { $eq: findone[0].user },
            },
          },
          {
            $project: {
              orderNumber: 1,
              transactionType: 1,
              prop: 1,
              amount: 1,
              description: 1,
              createdAt: 1,
            },
          },
          {
            $match: {
              orderNumber: search,
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
        return res.status(200).send({ data: trasactionDetails, status: 200 });
      }
  
      const trasactionDetails = await customerPropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            prop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "internal server error", status: 500 });
    }

}
const getMyPropTrasactionForDownloadStatement = async (req, res) => {
  const { startDate, endDate, search } = req.query;
  let token= req.headers.authorization
  const token_data = await Token.findOne({ token });
  let user= token_data.user;
  try {
    let findone = await customerPropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    if (!findone.length) {
      return res
        .status(200)
        .send({ msg: "no order", data: findone, status: 200 });
    }
    if (startDate && endDate) {
      const trasactionDetails = await customerPropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $project: {
            transactionType: 1,
            prop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    }
    if (search) {
      const trasactionDetails = await customerPropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $lookup: {
            from: "customer_payment_trackers",
            localField: "orderNumber",
            foreignField: "payment_intent",
            as: "pt",
          },
        },
        {
          $unwind: "$pt",
        },
        {
          $project: {
            transactionType: 1,
            prop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
          },
        },
        {
          $match: {
            orderNumber: search,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    }

    const trasactionDetails = await customerPropTransaction.aggregate([
      {
        $match: {
          user: { $eq: findone[0].user },
        },
      },
      {
        $lookup: {
          from: "customer_payment_trackers",
          localField: "orderNumber",
          foreignField: "payment_intent",
          as: "pt",
        },
      },
      {
        $unwind: "$pt",
      },
      {
        $project: {
          transactionType: 1,
          prop: 1,
          amount: 1,
          description: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return res.status(200).send({ data: trasactionDetails, status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error", status: 500 });
  }
};
const getEmailStatementMyPropTrasaction = async (req, res) => {
  const { startDate, endDate, email } = req.query;
  let token = req.headers.authorization;
  const token_data = await Token.findOne({ token });
  let user = token_data.user;
  let adddata = await User.find({_id:user})
  try {
    let findone = await customerPropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    if (!findone.length) {
      return res
        .status(200)
        .send({ msg: "no order", data: findone, status: 200 });
    }
    if (startDate && endDate) {
      const trasactionDetails = await customerPropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            prop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      // Create a new PDF document
      // const pdfDoc = new pdfkit();
      
      // Set the filename for the PDF
      // const filename = `MyCropTransaction-${new Date().toISOString()}.pdf`;
      const filename = `MyPropTransaction.pdf`;
      const writeStream = fs.createWriteStream('MyPropTransaction.pdf');
      // pdfDoc.pipe(writeStream);

      // // Add content to the PDF document
      // pdfDoc.text('My PDF Document');
      // trasactionDetails.forEach(transaction => {
      //   pdfDoc.fontSize(14).text(`Order Number: ${transaction.orderNumber}`);
      //   pdfDoc.fontSize(12).text(`Transaction Type: ${transaction.transactionType}`);
      //   pdfDoc.fontSize(12).text(`Crop: ${transaction.crop}`);
      //   pdfDoc.fontSize(12).text(`Amount: ${transaction.amount}`);
      //   pdfDoc.fontSize(12).text(`Description: ${transaction.description}`);
      //   pdfDoc.fontSize(12).text(`Created At: ${transaction.createdAt}`);
      //   });
      // pdfDoc.end();

      const headers = ['Order Number', 'Transaction Type', 'Prop', 'Amount', 'Description', 'Created At'];
const rows = trasactionDetails.map(transaction => [
  transaction.orderNumber,
  transaction.transactionType,
  transaction.prop,
  transaction.amount,
  transaction.description,
  transaction.createdAt,
]);

const docDefinition = {
  content: [
    { text: 'My Prop Transaction', style: 'header' },
    {
      table: {
        headers: headers,
        body: rows
      }
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    }
  }
};

const pdfDoc = new pdfkit();
pdfDoc.pipe(writeStream).on('finish', () => {
  console.log('PDF saved');
});
pdfDoc.text(JSON.stringify(docDefinition));
pdfDoc.end();

      // writeStream.on('finish', () => {
      //   console.log('PDF file created successfully');
      // });
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

      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adddata[0].email,
        subject: 'My Prop Transactions',
        text: 'Please find attached the PDF of your Prop transactions',
        attachments: [
          {
            filename,
            content: fs.createReadStream(filename),
          },
        ],
      };

      // Send the email with the PDF attachment
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ error });
        } else {
          console.log(`Email sent: ${info.response}`);
          return res.status(200).send({ status: 200, message: "Successfully Sent." });
        }
      });

      // Delete the PDF file after sending the email
      // fs.unlinkSync(filename);
    }
    else{
      return res.status(500).send({message: "Please sent start date and end date" });  
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
}

const getAllPropTrasactionByAdmin = async (req, res) => {

  const { user, startDate, endDate, search } = req.query;
  
  try {
    let findone = await customerPropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    
    if (!findone.length) {
      return res
        .status(200)
        .send({ msg: "no order", data: findone, status: 200 });
    }
    if (startDate && endDate) {
      const trasactionDetails = await customerPropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(startDate),
            },
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            prop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    }
    if (search) {
      const trasactionDetails = await customerPropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            prop: 1,
            amount: 1,
            description: 1,          
            _id:1,
            createdAt: 1,
          },
        },
        {
          $match: {
            orderNumber: search,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    }

    const trasactionDetails = await customerPropTransaction.aggregate([
      {
        $match: {
          user: { $eq: findone[0].user },
        },
      },
      {
        $project: {
          orderNumber: 1,
          transactionType: 1,
          prop: 1,
          amount: 1,
          description: 1,          
          _id:1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    
    return res.status(200).send({ trasactionDetails, status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error", status: 500 });
  }
};

const SaveMyPropTrasaction=async(amount, prop, transactionType, description, orderNumber, user)=>{  
    if(!prop || !transactionType|| !orderNumber || !user ){
        return console.log("all field is required"); 
    }  
    try {
        await customerPropTransaction.create({
            orderNumber,
            transactionType,
            prop,
            description,
            amount,
            user,
        });
        console.log("trasaction created")
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getMyPropTrasaction, SaveMyPropTrasaction, getMyPropTrasactionForDownloadStatement, getEmailStatementMyPropTrasaction, getAllPropTrasactionByAdmin };