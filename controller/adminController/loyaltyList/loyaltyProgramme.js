const loyalityProgrammeList = require('../../../models/admin/loyaltyProgramme/listOfProgram');
const addLoyaltyProgramme = async(req, res)=>{
    console.log(req.body);
    return
    try {
        loyalityProgrammeList.create({
            
        })
    } catch (error) {
        
    }
}
module.exports = {addLoyaltyProgramme};