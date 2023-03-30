const {adminCustomerSurvey, adminBusinessSurvey} = require("../../models/admin/admin_survey");

const getCustomerSurvey = async (req, res) => {
  try {
    const surveyDetails = await adminCustomerSurvey.find({});
    res.json({ surveyDetails });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};

const createCustomerSurvey = async (req, res) => {
  try {
    const {name, gender, ageGroup, currentLocation, mobileNumber, email, lpUser, srpCount, rating, expectations, plainArea} = req.body;
    let account = await adminCustomerSurvey.find({email});
    if (account.length) {
      return res.send({ message: " thank you are already attempted" });
    } else {
      await adminCustomerSurvey.create({
        name,
        gender,
        ageGroup,
        currentLocation,
        mobileNumber,
        email,
        lpUser,
        srpCount,
        rating,
        expectations,
        plainArea
      });
      return res.send({ message: "thank you for your attempt" });
    }
  } catch (error) {
    console.log(error);
    return res.send("internal error");
  }
};
const getBusinessSurvey = async (req, res) => {
  try {
    const surveyDetails = await adminBusinessSurvey.find({});
    res.json({ surveyDetails });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};

const createBusinessSurvey = async (req, res) => {
  try {
    const {businessName, natureOfBusiness, currentLocation, mobileNumber, email, olpUser, lpApp, rating, expectations, plainArea} = req.body;
    let account = await adminBusinessSurvey.find({email});
    if (account.length) {
      return res.send({ message: " thank you are already attempted" });
    } else {
      await adminBusinessSurvey.create({
        businessName,
        natureOfBusiness,
        currentLocation,
        mobileNumber,
        email,
        olpUser,
        lpApp,
        rating,
        expectations,
        plainArea
      });
      return res.send({ message: "thank you for your attempt" });
    }
  } catch (error) {
    console.log(error);
    return res.send("internal error");
  }
};
module.exports = { getBusinessSurvey, createBusinessSurvey, getCustomerSurvey, createCustomerSurvey};
