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
  getProductImage,
  uploadProductImages,
  productComment,
  getProductComment,
  deleteProductComment,
  putProductComment,
  getRedeemProducts,
  getEarnProducts,
  getProductsBySector,
  getEarnCropProductsBySector,
  getRedeemCropProductsBySector,
} = require("../../controller/businessController/product")
const authorization = require("../../middleware/verifyToken")
const { upload } = require("../../utils/imageUpload")

// router
const router = express.Router()

// add a products
router.post("/add", authorization, addProduct)
// add all products
router.post("/add-all", addAllProducts)
// get showing products
router.get("/show", getShowingProducts)
// get discount products
router.get("/get-earn-products", authorization, getEarnProducts)
router.get("/get-redeem-products", authorization, getRedeemProducts)

router.get("/get-earncrop-products", getEarnCropProducts)
router.get("/get-redeemcrop-products", getRedeemCropProducts)
router.get("/discount", getDiscountProduct)
router.get("/categoryproducts", getProductsByCatagory)
router.get(
  "/get-products-by-sub-category/:subCategoryId",
  getProductsBySubCatagory
)
router.get(
  "/get-all-products-by-business",
  authorization,
  getAllProductsByBusiness
)
router.get("/relatedProduct", getRelatedProducts)
router.get("/:id", getSingleProduct)
router.put("/:id", updateProduct)
router.delete("/:id", removeProduct)
router.post("/image/:productId", upload.array("file", 20), uploadProductImages)
router.get("/image/:id", getProductImage)

router.get("/get-earncrop-products", getEarnCropProducts)
router.get("/get-redeemcrop-products", getRedeemCropProducts)
router.get("/discount", getDiscountProduct)
router.get("/categoryproducts", getProductsByCatagory)
router.get(
  "/get-products-by-sub-category/:subCategoryId",
  getProductsBySubCatagory
)
router.get(
  "/get-all-products-by-business",
  authorization,
  getAllProductsByBusiness
)
router.get("/relatedProduct", getRelatedProducts)
router.get("/:id", getSingleProduct)
router.put("/:id", updateProduct)
router.delete("/:id", removeProduct)
router.post("/product-comment", productComment)
router.get("/get-Product-Comment", getProductComment)
router.delete("/deleteProductComment", deleteProductComment)
router.put("/putProductComment", putProductComment)
router.get(
  "/get-earn-crop-products-by-category/:sector",
  getEarnCropProductsBySector
)
router.get(
  "/get-redeem-crop-products-by-category/:sector",
  getRedeemCropProductsBySector
)


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
