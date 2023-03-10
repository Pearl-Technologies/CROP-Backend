const mongoose = require('mongoose');
const Order = require('../models/Order');
const {User} = require("../models/User");
// get all orders user
module.exports.getOrderByUser = async (req, res) => {

 const userdata=await User.findOne({email:req.user.email});

 let userid=userdata._id;
 console.log(userid,"rgrr");
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments({ user: userid });

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: 'Pending',
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total padding order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: 'Processing',
          user: mongoose.Types.ObjectId(userid),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: 'Delivered',
          user: mongoose.Types.ObjectId(userid),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // today order amount

    // query for orders
    const orders = await Order.find({ user: userid })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// getOrderById
module.exports.getOrderById = async (req, res) => {
  try {
    console.log(req.params.id)
    const order = await Order.findById(req.params.id);
    console.log(order)
    res.status(200).json({
      success:true,
      order,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
