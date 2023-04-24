const adminPropValuation = require("../../models/admin/admin_prop_valuation");
const getPropValuation=async (req, res)=>{
    try {
        let propValuationData = await adminPropValuation.find({});
        res.status(200).json({propValuationData});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal error");
    }
}
const createPropValuation= async(req, res)=>{
    try{
        const {defaultProp, purchaseProp, user} = req.body;
        let findRecord = await adminPropValuation.find({});
        if(findRecord.length){
            return res.status(400).send("record already exist");
        }
        await adminPropValuation.create({
            defaultProp,
            purchaseProp,
            user
        })
        res.status(200).send("created");
    }catch (error) {
        console.log(error.message);
        res.status(500).send("internal error");
    }
}
const updatePropValuation = async(req, res)=>{
    // return res.send(req.body);
    const {defaultProp, purchaseProp, user, _id} = req.body
    if(!defaultProp || !purchaseProp || defaultProp==="NaN" || purchaseProp === "NaN" ){
        return res.status(401).json({msg:"default PROP/purchase PROP should not be below 1"});
    }
    try{
        let findRecord = await adminPropValuation.findOne({_id});
        
        if(!findRecord){
            return res.status(204).json({msg:"sorry, no record found"});
        }
        let newData = {};
        if(defaultProp){
            newData.defaultProp=defaultProp;
        }
        if(purchaseProp){
            newData.purchaseProp = purchaseProp;
        }
        if(!defaultProp || defaultProp < 1){
            return res.status(401).json({msg:"default prop should not be below 1"}); 
        }
        if(!purchaseProp || purchaseProp < 1){
            return res.status(401).json({msg:"default prop should not be below 1"}); 
        }
        if(findRecord.user.toString() !== user){
            return res.status(401).json({msg:"sorry, you are not authorise"});    
        }
        await adminPropValuation.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
        res.status(202).json({msg:"updated"});
    }catch (error) {
        console.log(error.message);
        res.status(500).json({msg:"internal error"});
    }   
}
module.exports = {getPropValuation, createPropValuation, updatePropValuation};