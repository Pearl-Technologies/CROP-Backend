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
  putProductCommentDetails,
  putProductCommentPaticularLike,
  getCalculatedProducts,
  getRedeemCropProducts,
  getEarnCropProducts,
  removeProduct,
  getProductImage,
  uploadProductImages,
  productComment,
  getProductComment,
  deleteProductComment,
  putProductCommentLike,
  getRedeemProducts,
  getEarnProducts,
  getProductsBySector,
  getEarnCropProductsBySector,
  getRedeemCropProductsBySector,
  getPromoProducts,
  getAllProducts,
  getBiddingSelectedProductsDetailsByBusiness,
  getBiddedProductsByBusiness,
  getEarnCropSingleProductById,
  getRedeemCropSingleProductById,
  getPromoProductsByBusiness,
  getProductCommentAndRatingsByBusiness,
  getPromoEarnAndRedeemProducts,
  getEarnAndRedeemProducts,
} = require("../../controller/businessController/product")
const authorization = require("../../middleware/verifyToken")
const { upload } = require("../../utils/imageUpload")

// router
const router = express.Router()

router.post("/add", authorization, addProduct)
router.post("/add-all", addAllProducts)
router.get("/show", getShowingProducts)
router.get(
  "/get-promo-earn-redeem-products/:page/:limit",
  getPromoEarnAndRedeemProducts
)
router.put("/putProductCommentLike", putProductCommentLike)
router.put("/putProductCommentDetails", putProductCommentDetails)
router.put("/putProductCommentPaticularLike", putProductCommentPaticularLike)
router.get("/get-earn-products", authorization, getEarnProducts)
router.get("/get-redeem-products", authorization, getRedeemProducts)
router.get("/get-promo-products", authorization, getPromoProductsByBusiness)
router.get("/get-promo-products/:page/:limit", getPromoProducts)
router.get("/get-all-products/:page/:limit", getAllProducts)

// router.get("/get-earncrop-products", getEarnCropProducts)
// router.get("/get-redeemcrop-products", getRedeemCropProducts)
router.get("/discount", getDiscountProduct)
router.get("/categoryproducts", getProductsByCatagory)
router.get(
  "/get-products-by-sub-category/:subCategoryId",
  getProductsBySubCatagory
)
router.get(
  "/get-bidding-selected-products-details",
  authorization,
  getBiddingSelectedProductsDetailsByBusiness
)
router.get("/get-bidded-products", authorization, getBiddedProductsByBusiness)
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

router.post("/product-comment", productComment)
router.get("/get-Product-Comment", getProductComment)
router.delete("/deleteProductComment", deleteProductComment)
router.get(
  "/get-earn-crop-products-by-category/:productTab/:sector/:pageNo/:limit",
  getEarnCropProductsBySector
)
router.get(
  "/get-redeem-crop-products-by-category/:productTab/:sector/:pageNo/:limit",
  getRedeemCropProductsBySector
)
router.get(
  "/get-earn-crop-products-by-category/:productTab/:sector/:lat/:long/:pageNo/:limit",
  getEarnCropProductsBySector
)
router.get(
  "/get-redeem-crop-products-by-category/:productTab/:sector/:lat/:long/:pageNo/:limit",
  getRedeemCropProductsBySector
)
router.get("/get-earn-crop-product/:id", getEarnCropSingleProductById)
router.get("/get-redeem-crop-product/:id", getRedeemCropSingleProductById)
router.get("/get-both-product/:id", getEarnAndRedeemProducts)
router.get(
  "/get-product-comments-ratings/:productId",
  getProductCommentAndRatingsByBusiness
)


module.exports = router;
