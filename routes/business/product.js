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

module.exports = router;
