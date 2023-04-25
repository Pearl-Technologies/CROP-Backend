const CitySchema = require("../models/City")
const StateSchema = require("../models/State")

const getStates = async (req, res) => {
  try {
    const states = await StateSchema.find({})
    return res.status(200).send({ states })
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}

const getCitiesByState = async (req, res) => {
  const { stateId } = req.params
  try {
    const cities = await CitySchema.find({ stateId })
    return res.status(200).send({ cities })
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}

module.exports = { getStates, getCitiesByState }
