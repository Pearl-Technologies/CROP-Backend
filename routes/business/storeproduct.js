const express = require("express")
const authorization = require("../../middleware/verifyToken")

const {
  addStoreProduct,
  getAllStoreProductsByBusiness,
  removeStoreProduct,
  getSingleStoreProduct,
  updateStoreProduct,
  getStoreBiddedProductsByBusiness,
  getBiddingSelectedStoreProductsDetailsByBusiness,
  getAllStoreProducts,
  getStorePromoProductsByBusiness,
} = require("../../controller/businessController/storeproducts")

// router
const router = express.Router()

router.post("/add", authorization, addStoreProduct)
router.get(
  "/get-all-products-by-business",
  authorization,
  getAllStoreProductsByBusiness
)
router.get(
  "/get-bidded-products",
  authorization,
  getStoreBiddedProductsByBusiness
)
router.get(
  "/get-bidding-selected-products-details",
  authorization,
  getBiddingSelectedStoreProductsDetailsByBusiness
)
router.get("/:id", getSingleStoreProduct)
router.put("/:id", updateStoreProduct)
router.delete("/:id", removeStoreProduct)

router.get("/get-all-store-products/:pageNo/:limit", getAllStoreProducts)
router.get(
  "/get-promo-products",
  authorization,
  getStorePromoProductsByBusiness
)


module.exports = router
