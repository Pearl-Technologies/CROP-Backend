const ProductCategory = require("../../models/admin/admin_product_category")

const createCategory = async (req, res) => {
    const {sectorName}= req.body;
    let image=undefined;
    if(req.file){
      image = req.file.filename;
    }
    let categoryName = sectorName
    try {
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
        const categories = await ProductCategory.find({});
        return res.status(200).send({success: true, categories})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}

module.exports = {createCategory, getCategories}