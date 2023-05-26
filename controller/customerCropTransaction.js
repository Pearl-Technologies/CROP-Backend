const customerCropTransaction = require("../models/CropTransaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { User } = require("../models/User");
const {Token} = require("../models/User");
const PDFDocument = require('pdfkit');

const fs = require('fs');
const pdfPath = process.cwd() + "/uploads/";
const nodemailer = require('nodemailer');

const getMyCropTrasaction = async (req, res) => {
  const { startDate, endDate, search } = req.query;
  let token= req.headers.authorization
  const token_data = await Token.findOne({ token });
  let user= token_data.user;
  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    if (!findone.length) {
      return res
        .status(200)
        .send({ msg: "no order", data: findone, status: 200 });
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
          $project: {
            orderNumber: 1,
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
const getMyCropTrasactionForDownloadStatement = async (req, res) => {
  const { startDate, endDate, search } = req.query;
  let token= req.headers.authorization
  const token_data = await Token.findOne({ token });
  let user= token_data.user;
  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    if (!findone.length) {
      return res
        .status(200)
        .send({ msg: "no order", data: findone, status: 200 });
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
      const pdfPath = 'transaction_statement.pdf';
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Add content to the PDF document
      doc.fontSize(14).text('Transaction Statement', { align: 'center' });
      doc.fontSize(12).text(`User: ${user}`);
      doc.fontSize(10).text(`Start Date: ${startDate}`);
      doc.fontSize(10).text(`End Date: ${endDate}`);
      doc.moveDown();

      trasactionDetails.forEach((transaction) => {
        doc.fontSize(10).text(`Order Number: ${transaction.orderNumber}`);
        doc.fontSize(10).text(`Transaction Type: ${transaction.transactionType}`);
        doc.fontSize(10).text(`Crop: ${transaction.crop}`);
        doc.fontSize(10).text(`Amount: ${transaction.amount}`);
        doc.fontSize(10).text(`Description: ${transaction.description}`);
        doc.fontSize(10).text(`Created At: ${transaction.createdAt}`);
        doc.moveDown();
      });

      // Finalize the PDF document
      doc.end();

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
        subject: 'My Crop Transactions',
        text: 'Please find attached the PDF of your crop transactions',
        attachments: [
          {
            pdfPath,
            content: fs.createReadStream(pdfPath),
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

const getAllCropTrasactionByAdmin = async (req, res) => {

  const { user, startDate, endDate, search } = req.query;
  
  try {
    let findone = await customerCropTransaction.find({
      user: mongoose.Types.ObjectId(`${user}`),
    });
    
    if (!findone.length) {
      return res
        .status(200)
        .send({ msg: "no order", data: findone, status: 200 });
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

const SaveMyCropTrasaction = async (
  amount,
  crop,
  transactionType,
  description,
  orderNumber,
  user
) => {
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
    });
    console.log("trasaction created");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getMyCropTrasaction, SaveMyCropTrasaction, getEmailStatementMyCropTrasaction, getAllCropTrasactionByAdmin, getMyCropTrasactionForDownloadStatement };
