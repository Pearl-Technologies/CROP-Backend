const Category = require('../models/Category');

// add category
module.exports.addCategory = async (req,res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.send({
      message:'Category added successfully',
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}

// add all category
module.exports.addAllCategory = async (req,res) => {
  try {
    await Category.deleteMany();
    const result = await Category.insertMany(req.body);
    res.json({
      message:'Category added successfully',
      result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}

//get all earn category
module.exports.getEarnCategory = async (req,res) => {
  try {
    const result = await Category.find({status:'Show'});
    res.json({
      success:true,
      categories:result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}

//get all redeem category
module.exports.getRedeemCategory = async (req,res) => {
  try {
    const result = await Category.find({status:'Show'});
    res.json({
      success:true,
      categories:result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}
// get all category
module.exports.getShowingCategory = async (req,res) => {
  try {
    const result = await Category.find({status:'Show'});
    res.json({
      success:true,
      categories:result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}