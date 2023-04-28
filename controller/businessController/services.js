const businessServices = require("../../models/businessModel/busienssService");
const businessStoreServices = require("../../models/businessModel/businessStoreServices")

const createServices = async (req, res) => {
  req.body.businessId = req.user.user.id
  const businessId = req.body.businessId
  try {
    console.log(req.body.businessId, "func")
    const serviceFind = await businessServices.find({ businessId })
    if (serviceFind.length <= 0) {
      const service = new businessServices(req.body)
      await service.save()
      console.log("create service", service)
      return res.status(200).json({ service })
    } else {
      const service = await businessServices.findByIdAndUpdate(
        { _id: serviceFind[0]._id },
        req.body
      )
      console.log("create service", service)
      return res.status(201).json({ service })
    }
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getService = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const serviceFind = await businessServices.find({ businessId })
    return res.json({ services: serviceFind })
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

const createStoreServices = async (req, res) => {
  req.body.businessId = req.user.user.id
  const businessId = req.body.businessId
  try {
    console.log(req.body.businessId, "func")
    const serviceFind = await businessStoreServices.find({ businessId })
    if (serviceFind.length <= 0) {
      const service = new businessStoreServices(req.body)
      await service.save()
      console.log("create service", service)
      return res.status(200).json({ service })
    } else {
      const service = await businessStoreServices.findByIdAndUpdate(
        { _id: serviceFind[0]._id },
        req.body
      )
      console.log("create service", service)
      return res.status(201).json({ service })
    }
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getStoreService = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const serviceFind = await businessStoreServices.find({ businessId })
    return res.json({ services: serviceFind })
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

module.exports = {
  createServices,
  getService,
  createStoreServices,
  getStoreService,
}
