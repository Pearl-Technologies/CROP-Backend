const Crop = require("../../models/admin/crop");

const CropTransaction = async (req, res) => {
  try {
    const { paymentValue, type, description } = req.body;
    if (type === "credit") {
        await Crop.create({
          credit: paymentValue,
          description: description,
        });
        res.json("account records updated");
      
    } else if (type === "debit") {
      await Crop.create({
        available_balance: Crop.available_balance - paymentValue,
        debit: paymentValue,
        description: description,
      });
      res.json("account records updated");
    }else{
      res.json("no transaction taken place");
    }
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
const GetCropDetails= async (req, res) => {
  try {
      const cropDetails = await Crop.find();
      res.json({cropDetails});
    
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {CropTransaction, GetCropDetails};
