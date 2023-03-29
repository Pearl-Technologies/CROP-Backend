const prop = require("../../model/admin/prop");

const PropTransaction = async (req, res) => {
  try {
    const { paymentValue, type, description } = req.body;
    
    if (type === "credit") {
      await prop.create({
        credit: paymentValue,
        description: description,
      });
      res.json("prop records updated");
    } else if (type === "debit") {
      await prop.create({
        debit: paymentValue,
        description: description,
      });
      res.json("prop records updated");
    }
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
const GetAllProp = async (req, res) => {
  try {  
    let propDetails = await prop.find({ });
      res.json({propDetails});
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {PropTransaction, GetAllProp};
