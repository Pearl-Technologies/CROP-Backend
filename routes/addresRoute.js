const express = require("express")
const {
  getStates,
  getCitiesByState,
} = require("../controller/addressController")

const router = express.Router()

router.get("/get-states", getStates)
router.get("/get-cities-by-state/:stateId", getCitiesByState)

module.exports = router
