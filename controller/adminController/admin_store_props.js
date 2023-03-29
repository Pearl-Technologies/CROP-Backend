const adminStoreProp = require("../../model/admin/admin_store_props");

const getPropValues = async (req, res) => {
  try {
    const {propId} = req.body;
    const propValue = await adminStoreProp.find({propId});
    res.json({ propValue });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
const updateStoreProp = async (req, res) => {
    let { value, propId, user } = req.body;
    let account = await adminStoreProp.find({propId});
  try {
    if (!account.length) {
      return res.send({ message: "not account found" });
    }
    if(account.user !== user){
        return res.send({ message: "you are not authorise" });
    }
    await adminStoreProp.findById({_id:account._id}, {$set:{value}}, {new:true});
    res.status(200).send({message:"updated"});
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};

const savePropValues = async (req, res) => {
  try {
    const {propId, value, user} = req.body;
    let account = await adminStoreProp.find({propId});

    if (account.length) {
      return res.send({ message: "account already exist" });
    } else {
      await adminStoreProp.create({
        propId,
        value,
        user
          });
      return res.send({ message: "created" });
    }
  } catch (error) {
    console.log(error);
    return res.send("internal error");
  }
};
module.exports = { getPropValues, updateStoreProp, savePropValues };
