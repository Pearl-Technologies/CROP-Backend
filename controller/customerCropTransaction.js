const customerCropTransaction = require("../models/CropTransaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getMyCropTrasaction = async (req, res) => {
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
            orderNumber: 1,
            transactionType: 1,
            crop: 1,
            amount: 1,
            description: 1,
            pt: {
              invoice_url: 1,
              invoice_pdf: 1,
            },
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
            orderNumber: 1,
            transactionType: 1,
            crop: 1,
            amount: 1,
            description: 1,
            pt: {
              invoice_url: 1,
              invoice_pdf: 1,
            },
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
          orderNumber: 1,
          transactionType: 1,
          crop: 1,
          amount: 1,
          description: 1,
          pt: {
            invoice_url: 1,
            invoice_pdf: 1,
          },
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
const SaveMyCropTrasaction = async (
  amount,
  crop,
  transactionType,
  description,
  orderNumber,
  user
) => {
  if (!amount || !crop || !transactionType || !orderNumber || !user) {
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

module.exports = { getMyCropTrasaction, SaveMyCropTrasaction };
