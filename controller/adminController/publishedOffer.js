const product = require("../../model/businessModel/product");
const { validationResult } = require("express-validator");

const publishOffer = async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const {_id, status, } = req.body;
      let findProduct = await product.find({_id});

      if(!findProduct.length){
        return res.status(400).json({ success: false, message:"product not found" });
      }
      let newData = {}
      if(status){
        newData.status = status
      }
      await product.findByIdAndUpdate({_id},{ $set: newData }, { new: true } );

        res.json({ success:true, message:"published offer updated" });

    } catch (error) {
      //for log in console
      console.error(error.message);
      //for log in response
      res.status(500).send("Some Error Occured");
    }
  };


module.exports = {publishOffer};