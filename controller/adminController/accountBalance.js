const AccountBalance = require("../../model/admin/adminAccountBalance");

const getAccountBalance = async (req, res) => {
  try {
    const availBalance = await AccountBalance.find();
    res.json({ availBalance });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
const updateAccountBalance = async (req, res) => {
  let account = await AccountBalance.find({});
  let { value, updateAccount, transactionType, description } = req.body;

  try {
    if (!account.length) {
      return res.send({ message: "not account found" });
    }
    let id = account._id;
    if (transactionType === "credit") {
      if (updateAccount === "crop") {
        let newBalance = account[0].crop + value;
        await AccountBalance.updateOne({ id }, { $set: { crop: newBalance, description: description } });
        return res.send({ message: "crop balance updated" });
      } else if (updateAccount === "prop") {
        let newBalance = account[0].prop + value;
        await AccountBalance.updateOne({ id }, { $set: { prop: newBalance, description: description } });
        return res.send({ message: "prop balance updated" });
      } else if (account === "account") {
        let newBalance = account[0].account + value;
        await AccountBalance.updateOne({ id }, { $set: { account: newBalance, description: description } });
        return res.send({ message: "prop balance updated" });
      } else {
        return res.send({ message: "not a valid query, please retry" });
      }
    } else if ((transactionType = "debit")) {
      if (updateAccount === "crop") {
        let newBalance = account[0].crop - value;
        await AccountBalance.updateOne({ id }, { $set: { crop: newBalance, description: description } });
        return res.send({ message: "crop balance updated" });
      } else if (updateAccount === "prop") {
        let newBalance = account[0].prop - value;
        await AccountBalance.updateOne({ id }, { $set: { prop: newBalance, description: description } });
        return res.send({ message: "prop balance updated" });
      } else if (account === "account") {
        let newBalance = account[0].account - value;
        await AccountBalance.updateOne({ id }, { $set: { account: newBalance, description: description } });
        return res.send({ message: "prop balance updated" });
      } else {
        return res.send({ message: "not a valid query, please retry" });
      }
    } else {
      return res.send({ message: "not a valid query, please retry" });
    }
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};

const saveAccountBalance = async (req, res) => {
  try {
    const {user, crop=0, prop=0, description="just created"} = req.body;
    let account = await AccountBalance.find({});

    if (account.length) {
      return res.send({ message: "account already exist" });
    } else {
      await AccountBalance.create({
        crop,
        prop,
        description,
        user
      });
      return res.send({ message: "account created" });
    }
  } catch (error) {
    console.log(error);
    return res.send("internal error");
  }
};
module.exports = { getAccountBalance, updateAccountBalance, saveAccountBalance };
