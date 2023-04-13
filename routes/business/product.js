const express = require("express");
const {
  addProduct,
  addAllProducts,
  getShowingProducts,
  getDiscountProduct,
  getSingleProduct,
  getRelatedProducts,
  getProductsByCatagory,
  getProductsBySubCatagory,
  updateProduct,
  getAllProductsByBusiness,
  getCalculatedProducts,
  getRedeemCropProducts,
  getEarnCropProducts,
  removeProduct,
  productComment,
  getProductComment,
  deleteProductComment,
  putProductComment
} = require("../../controller/businessController/product");
const authorization = require("../../middleware/verifyToken")
// router
const router = express.Router();

// add a products
router.post("/add", authorization, addProduct);
// add all products
router.post("/add-all", addAllProducts);
// get showing products
router.get("/show", getShowingProducts);
// get discount products
router.get('/get-earncrop-products', getEarnCropProducts);
router.get('/get-redeemcrop-products', getRedeemCropProducts);
router.get("/discount", getDiscountProduct);
router.get("/categoryproducts", getProductsByCatagory);
router.get("/get-products-by-sub-category/:subCategoryId", getProductsBySubCatagory);
router.get("/get-all-products-by-business", authorization, getAllProductsByBusiness);
router.get("/relatedProduct", getRelatedProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);
router.post("/product-comment", productComment);
router.get("/get-Product-Comment", getProductComment);
router.delete("/deleteProductComment", deleteProductComment);
router.put("/putProductComment", putProductComment);


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
