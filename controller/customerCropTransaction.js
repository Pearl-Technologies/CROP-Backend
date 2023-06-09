const customerCropTransaction = require("../models/CropTransaction");
const customerCropTransactionExpiry = require("../models/CropTransactionExpiry");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { User } = require("../models/User");
const { Token } = require("../models/User");
const PDFDocument = require("pdfkit");
const table = require("table");

const fs = require("fs");
const pdfPath = process.cwd() + "/uploads/";
const nodemailer = require("nodemailer");

const getMyCropTrasaction = async (req, res) => {
  const { startDate, endDate, search } = req.query;
  let token = req.headers.authorization;
  const token_data = await Token.findOne({ token });
  let user = token_data.user;
  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    if (!findone.length) {
      return res.status(200).send({ msg: "no order", data: findone, status: 200 });
    }
    if (search && startDate && endDate) {
      const trasactionDetails = await customerCropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $lookup: {
            from: "admin_vouchers",
            localField: "orderNumber",
            foreignField: "orderNumber",
            as: "voucher",
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            crop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
            voucher: 1,
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
    if (search) {
      const trasactionDetails = await customerCropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $lookup: {
            from: "admin_vouchers",
            localField: "orderNumber",
            foreignField: "orderNumber",
            as: "voucher",
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            crop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
            voucher: 1,
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
    if (startDate && endDate) {
      const trasactionDetails = await customerCropTransaction.aggregate([
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
          $lookup: {
            from: "admin_vouchers",
            localField: "orderNumber",
            foreignField: "orderNumber",
            as: "voucher",
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            crop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
            voucher: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    }

    const trasactionDetails = await customerCropTransaction.aggregate([
      {
        $match: {
          user: { $eq: findone[0].user },
        },
      },
      {
        $lookup: {
          from: "admin_vouchers",
          localField: "orderNumber",
          foreignField: "orderNumber",
          as: "voucher",
        },
      },
      {
        $project: {
          orderNumber: 1,
          transactionType: 1,
          crop: 1,
          amount: 1,
          description: 1,
          createdAt: 1,
          voucher: 1,
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
const getMyCropTrasactionForDownloadStatement = async (req, res) => {
  const { startDate, endDate, search } = req.query;
  let token = req.headers.authorization;
  const token_data = await Token.findOne({ token });
  let user = token_data.user;
  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    if (!findone.length) {
      return res.status(200).send({ msg: "no order", data: findone, status: 200 });
    }
    if (startDate && endDate) {
      const trasactionDetails = await customerCropTransaction.aggregate([
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
            crop: 1,
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
      const trasactionDetails = await customerCropTransaction.aggregate([
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
            crop: 1,
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

    const trasactionDetails = await customerCropTransaction.aggregate([
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
          crop: 1,
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
const getEmailStatementMyCropTrasaction = async (req, res) => {
  const { startDate, endDate, email } = req.query;
  let token = req.headers.authorization;
  const token_data = await Token.findOne({ token });
  let user = token_data.user;
  let adddata = await User.find({ _id: user });

  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });

    if (!findone.length) {
      return res.status(200).send({ msg: "no order", data: findone, status: 200 });
    }

    if (startDate && endDate) {
      const trasactionDetails = await customerCropTransaction.aggregate([
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
            crop: 1,
            amount: 1,
            description: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      // Create a new PDF document
      const doc = new PDFDocument();

      // Pipe the PDF document to a file
      const pdfPath = "transaction_statement.pdf";
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Add content to the PDF document
      doc.fontSize(14).text("Transaction Statement", { align: "center" });
      doc.fontSize(12).text(`User: ${user}`);
      doc.fontSize(10).text(`Start Date: ${startDate}`);
      doc.fontSize(10).text(`End Date: ${endDate}`);
      doc.moveDown();

      // Convert transaction details to a table
      const data = [["Order Number", "Transaction Type", "Crop", "Amount", "Description", "Created At"]];
      trasactionDetails.forEach((transaction) => {
        data.push([transaction.orderNumber, transaction.transactionType, transaction.crop, transaction.amount, transaction.description, transaction.createdAt.toString()]);
      });

      // Configure table options
      const tableConfig = {
        columns: {
          0: { width: 100 },
          1: { width: 100 },
          2: { width: 100 },
          3: { width: 100 },
          4: { width: 150 },
          5: { width: 150 },
        },
      };

      // Generate the table
      const tableOutput = table.table(data, tableConfig);

      // Add the table to the PDF document
      doc.fontSize(10).text(tableOutput);
      doc.moveDown();

      // Finalize the PDF document
      doc.end();

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
      let nameCus = adddata[0].name;
      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "p.santhosh8888@gmail.com",
        subject: "My Crop Transactions",
        text: `Hi ${nameCus},\nPlease find attached the PDF of your crop transactions.\n\nCheers,\nTeam CROP`,
        attachments: [
          {
            filename: "transaction_statement.pdf",
            path: pdfPath,
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
      // fs.unlinkSync(pdfPath);
    } else {
      return res.status(500).send({ message: "Please send start date and end date" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
};

const getAllCropTrasactionByAdmin = async (req, res) => {
  const { user, startDate, endDate, search } = req.query;

  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });

    if (!findone.length) {
      return res.status(200).send({ msg: "no order", data: findone, status: 200 });
    }
    if (startDate && endDate) {
      const trasactionDetails = await customerCropTransaction.aggregate([
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
            crop: 1,
            amount: 1,
            description: 1,
            invoiceNumber: 1,
            invoiceUrl: 1,
            invoicePdf: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    }
    if (search) {
      const trasactionDetails = await customerCropTransaction.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $project: {
            orderNumber: 1,
            transactionType: 1,
            crop: 1,
            amount: 1,
            description: 1,
            _id: 1,
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

    const trasactionDetails = await customerCropTransaction.aggregate([
      {
        $match: {
          user: { $eq: findone[0].user },
        },
      },
      {
        $project: {
          orderNumber: 1,
          transactionType: 1,
          crop: 1,
          amount: 1,
          description: 1,
          _id: 1,
          invoiceNumber: 1,
          invoiceUrl: 1,
          invoicePdf: 1,
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

const SaveMyCropTrasaction = async (amount, crop, transactionType, description, orderNumber, user, invoiceNumber, invoiceUrl, invoicePdf) => {
  if (!crop || !transactionType || !orderNumber || !user) {
    return console.log("all field is required");
  }
  try {
    await customerCropTransaction.create({
      orderNumber,
      transactionType,
      crop,
      description,
      amount,
      user,
      invoiceNumber,
      invoiceUrl,
      invoicePdf,
    });
    console.log("trasaction created");
  } catch (error) {
    console.log(error);
  }
};

const SaveMyCropExpiry = async (amount, crop, transactionType, description, orderNumber, user, invoiceNumber, invoiceUrl, invoicePdf) => {
  if (!crop || !transactionType || !orderNumber || !user) {
    return console.log("all field is required");
  }
  try {
    await customerCropTransactionExpiry.create({
      orderNumber,
      transactionType,
      crop,
      description,
      amount,
      user,
      invoiceNumber,
      invoiceUrl,
      invoicePdf,
    });
    console.log("trasaction created");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getMyCropTrasaction, SaveMyCropTrasaction, SaveMyCropExpiry, getEmailStatementMyCropTrasaction, getAllCropTrasactionByAdmin, getMyCropTrasactionForDownloadStatement };
