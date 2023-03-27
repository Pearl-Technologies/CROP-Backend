const express = require("express");
const {
  addProduct,
  addAllProducts,
  getShowingProducts,
  getDiscountProduct,
  getSingleProduct,
  getRelatedProducts,
  getProductsByCatagory,
} = require("../controller/productController");
const {Product} = require("../models/Product")
// router
const router = express.Router();

// add a products
// router.post("/add", addProduct);
// // add all products
// router.post("/add-all", addAllProducts);
// get showing products
router.get("/show", getShowingProducts);
// get discount products
router.get("/discount", getDiscountProduct);
router.get("/categoryproducts", getProductsByCatagory);
router.get("/relatedProduct", getRelatedProducts);
router.get("/:id", getSingleProduct);

// router.get("/get-products-by-category", getProductsByCatagory);

// router.put("/abc", async (req, res) =>{
//   console.log("eqfef")
// try{ 
//   const result= await Product.updateMany({status : 'active' }, {$set: {croppoints : 450}});     
//   console.log(result); 

// } catch(err){
//   res.status(500).send({message:"Enter the registered mail-id"});
// }
// });

module.exports = router;
