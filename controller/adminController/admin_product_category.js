const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ProductCategory = require("../../models/admin/admin_product_category")
const Admin = require("../../models/superAdminModel/user")
const {Product} = require("../../models/businessModel/product")
const createCategory = async (req, res) => {
    const {sectorName}= req.body;
    let image=undefined;
    if(req.file){
      image = req.file.filename;
    }
    let categoryName = sectorName
    let userId = req.user.user.id
    try {
        let findAdminUser = await Admin.findOne({_id:userId});
        if(!findAdminUser){
            return res.status(404).send({msg:"you are not a valid user"})    
        }
        if(!image || !categoryName){
            return res.status(406).send({msg:"image and category name is required"})
        }
        const category = new ProductCategory({
            image,
            categoryName
        })
        await category.save();
        return res.status(201).send({msg:"Category Created"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"Internal Server Error"})
    }
}


const getCategories = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pages = Number(page) || 1;
        const limits = Number(limit) || 4;
        const skip = (pages - 1) * limits;
        const categories = await ProductCategory.find().sort({ _id: -1 }).skip(skip).limit(limits);
        return res.status(200).send({success: true, categories})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}
const getCategoryById = async (req, res) => {
    const userId=req.user.user.id
    const {id}= req.body;
    try {
        let findAdminUser = await Admin.findOne({_id:userId});
        if(!findAdminUser){
            return res.status(404).send({msg:"you are not a valid user"})    
        }
        const categories = await ProductCategory.findOne({_id:id});
        return res.status(200).send({success: true, categories})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}
const updateCategory = async (req, res) => {
    const {sectorName, id}= req.body;
    const userId = req.user.user.id
    let image=undefined;
    if(req.file){
      image = req.file.filename;
    }
    let categoryName = sectorName
    try {
        let findAdminUser = await Admin.findOne({_id:userId});
        if(!findAdminUser){
            return res.status(404).send({msg:"you are not a valid user"})    
        }
        if(!image || !categoryName){
            return res.status(406).send({msg:"image and category name is required"})
        }
        let findAProduct = await Product.findOne({sector:sectorName});
        if(findAProduct){
            await ProductCategory.findByIdAndUpdate({_id:id},{$set:{image}})
            return res.status(201).send({msg:"only image updated since product found in this sector"})
        }else{
            await ProductCategory.findByIdAndUpdate({_id:id}, {$set:{image:image, categoryName:categoryName}})
            return res.status(201).send({msg:"Category and image updated"})
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"Internal Server Error"})
    }
}
const deleteCategory = async (req, res) => {
    const {id, sectorName}= req.body;
    const userId = req.user.user.id
    try {
        let findAdminUser = await Admin.findOne({_id:userId});
        if(!findAdminUser){
            return res.status(404).send({msg:"you are not a valid user"})    
        }
        let findAProduct = await Product.findOne({sector:sectorName});
        if(findAProduct){
            return res.status(201).send({msg:"sorry you can't delete since product found in this sector"})
        }else{
            await ProductCategory.findByIdAndDelete({_id:id})
            return res.status(201).send({msg:"category deleted"})
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"Internal Server Error"})
    }
}
module.exports = {createCategory, getCategories, updateCategory, getCategoryById, deleteCategory }