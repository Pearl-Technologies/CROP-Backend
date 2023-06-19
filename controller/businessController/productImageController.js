const express = require("express")
const formidable = require("formidable")
const path = require("path")
const { Rembg } = require("rembg-node")
const sharp = require("sharp")
const fs = require("fs")
const { Product } = require("../../models/businessModel/product")

const app = express()

app.use(express.static("public"))

const innerFolderPath = path.join(__dirname, "")

const productImage = (req, res) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err)
      return res.status(500).send("Internal Server Error")
    }
    const inputFile = files.file
    const text = fields.text
    const count = fields.count
    const productId = fields.productId
    const filename = inputFile.newFilename
    console.log({ inputFile })
    const input = sharp(`${inputFile.filepath}`)
    const rembg = new Rembg({
      logging: true,
    })
    const output = await rembg.remove(input)
    await output.png().toFile("test-output.png")
    await output.trim().png().toFile("test-output-trimmed.png")
    let arr = []
    for (let i = 1; i <= count; i++) {
      arr.push(i)
    }
    if (arr.length > 0) {
      await arr.map((x, i) => {
        mergeImage2(
          `${innerFolderPath}/colorsImages/${x}.png`,
          "test-output.png",
          i
        )
      })
      await setTimeout(() => {
        arr.map((x, i) => {
          mergetext(
            `${innerFolderPath}/newImage/${x}.jpg`,
            text,
            productId,
            filename,
            i
          )
        })
      }, 3000)
      return res.status(200).send("Product Images Created Successfully")
    }
  })
}

let secondBaseWidth
let secondBaseHeight
const mergeImage2 = (first, second, index) => {
  const sharp = require("sharp")
  console.log({ first })
  sharp(second)
    .metadata()
    .then(metadata => {
      secondBaseWidth = metadata.width
      secondBaseHeight = metadata.height
      console.log(secondBaseWidth, secondBaseHeight, "second")
    })

  // Read the base image
  sharp(first)
    .metadata()
    .then(metadata => {
      const baseWidth = metadata.width
      const baseHeight = metadata.height
      // Resize the overlay image to match the dimensions of the base image
      sharp(second)
        .resize(800, 800)
        .toBuffer()
        .then(overlayBuffer => {
          // Overlay the resized overlay image on the base image
          const direction = [
            "north",
            "northeast",
            "east",
            "southeast",
            "south",
            "southwest",
            "west",
            "northwest",
            "center",
          ]
          sharp(first)
            .composite([{ input: overlayBuffer, gravity: direction[index] }])
            .toFile(`${innerFolderPath}/newImage/${index + 1}.jpg`, err => {
              if (err) {
                console.error(err)
              } else {
                console.log("Images merged successfully!")
              }
            })
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })
}
const mergetext = async (image1, text, productId, filename, index) => {
  let image = sharp(image1)

  const textOptions = {
    text,
    top: 0,
    left: 300,
    width: 2048,
    height: 1024,
    rotate: 0,
    font: {
      family: "Magneto",
      size: 180,
      color: "#FFFFFF",
      weight: "bold",
      style: "normal",
    },
  }
  let fontName = [
    "Spicy Pumpkin",
    "National Hero",
    "Holyfat",
    "Mintaka",
    "Ramyoon",
  ]
  image
    .extend({
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // Set the background to transparent
      width: textOptions.width,
      height: textOptions.height,
      top: textOptions.top,
      left: textOptions.left,
    })
    .png() // Convert to PNG format for supporting transparency
    .composite([
      {
        input: Buffer.from(
          `<svg width="${textOptions.width}" height="${textOptions.height}">
              <text x="400" y="400" font-family="${fontName[index]}" font-size="180" fill="#FFFFFF"
              >${textOptions.text}</text></svg>`
        ),
        top: 600,
        left: 100,
      },
    ])

  const folderPath = `${innerFolderPath}/productimages/${productId}`

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`Folder '${folderPath}' created successfully.`)
  } else {
    console.log(`Folder '${folderPath}' already exists.`)
  }
  // const imageUrl = ""
  await Product.findByIdAndUpdate(
    { _id: productId },
    {
      $push: {
        image: filename + index,
      },
    }
  )
  image.toFile(`${folderPath}/${filename + index}.jpg`, err => {
    if (err) {
      console.error(err)
    } else {
      console.log("Merged2 image with text saved successfully!")
      //   return res.status(200).send("success")
    }
  })
}

const getProductDesignedImage = async (req, res) => {
  const { productId, imageName } = req.params
  try {
    if (
      fs.existsSync(
        `./controller/businessController/productimages/${productId}/${imageName}`
      )
    ) {
      fs.readFile(
        `./controller/businessController/productimages/${productId}/${imageName}`,
        function (err, data) {
          if (err) console.log(err)
          else {
            console.log(data)
            res.end(data)
          }
        }
      )
    } else {
      return res.status(404).send("Image Not Exist")
    }
    // return res.status(200).send("success")
  } catch (error) {
    console.log(error)
  }
}

const updateSelectedImages = async (req, res) => {
  const { productId, imageName } = req.params
  const filePath = `./controller/businessController/productimages/${productId}/${imageName}`
  try {
    fs.unlink(filePath, err => {
      if (err) {
        console.error(`Error deleting file: ${err}`)
        return res.status(404).send("given image not found")
      } else {
        console.log(`File ${filePath} successfully deleted`)
        return res.status(200).send("selected images updated in product")
      }
    })
  } catch (error) {}
}

module.exports = { productImage, getProductDesignedImage, updateSelectedImages }
