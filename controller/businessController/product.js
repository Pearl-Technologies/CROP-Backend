const {Product} = require("../../models/businessModel/product")

// addAllProducts

module.exports.addProduct = async (req,res) => {
  try {
    req.body.user = req.user.user.id;
    console.log(req.body)
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send({
      message:'Product added successfully',
    })
  } catch (err) {
    res.status(500).send({
      message:err.message
    })
  }
}
// addAllProducts

module.exports.addAllProducts = async (req,res) => {
  try {
    await Product.deleteMany();
    const result = await Product.insertMany(req.body);
    res.send({
      message:'Products added successfully',
      result,
    })
  } catch (err) {
    res.status(500).send({
      message:err.message
    })
  }
}

// get all category
module.exports.getShowingProducts = async (req,res) => {

//  const result= await Product.updateMany(
//     { type: "Top Rated"},
//     {
//       $set: { croppoints: 300 }
//     }
//   )
// }
  try {   
    const result = await Product.find({status:'active'});
    res.status(200).json({
      success:true,
      products:result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}
// getDiscountProduct
module.exports.getDiscountProduct = async (req,res) => {
  try {
    const discountProducts = await Product.find({ discount: { $gt: 0 } })
    res.json({
      success:true,
      products:discountProducts,
    })
  } catch (err) {
    res.status(500).send({
      message:err.message
    })
  }
}

// getDiscountProduct
module.exports.getSingleProduct = async (req,res) => {
  try {
    const product = await Product.findOne({_id:req.params.id})
    res.json(product)
  } catch (err) {
    res.status(500).send({
      message:err.message
    })
  }
}

// get related products
module.exports.getRelatedProducts = async (req,res) => {

  const {tags} = req.query;
  const queryTags = tags?.split(",")
  try {
    const product = await Product.find({tags:{$in:queryTags}}).limit(4);
    res.status(200).json({
      status:true,
      product,
    })
  } catch (err) {
    res.status(500).send({
      message:err.message
    })
  }
}

// module.exports.getProductsByCatagory = async (req, res) => {
//   console.log("etwt")
//   const {category} = req.body;
//   try {
//     let product = []
//     await category.map(async (cate) => {
//       let children = cate;
//       let products = await Product.find({children});
//       products.forEach(element => {
//         product.push(element)
//       })
//       return res.status(200).json({product})
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({
//       message: error.message
//     })
//   }
// }

// Start Sridhar

// Get Products By Category
// module.exports.getProductsByCatagory = async (req, res) => {
//   const { categoryId } = req.params;
//   console.log(req.body)
//   try {
//     const products = await Product.find({categoryId});
//     res.status(200).json({ products });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };
module.exports.getProductsByCatagory = async (req, res) => {

  const category = req.body.category;
  console.log(category,"categories")
  try {
    // let product = []
    // await category.map(async (cate) => {
    //   let children = cate;
    //   let products = await Product.find({children});
    //   products.forEach(element => {
    //     product.push(element)
    //   })
  //})  
    const result = await Product.find(  {$and: [
      { status:"active" },
      { parent: category }
    ] });
      return res.status(200).json({result})
    
  } catch (error) {s
    console.log(error)
    res.status(500).send({
      message: error.message
    })
  }
}

// Get Products By Sub Category
module.exports.getProductsBySubCatagory = async (req, res) => {
  const { subCategoryId } = req.params;
  try {
    const products = await Product.find({subCategoryId});
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  const {id} = req.params;
  try {
    delete req.body._id;
    const products = await Product.findByIdAndUpdate({_id: id}, req.body);
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports.getAllProductsByBusiness = async(req, res) => {
  console.log("running")
  const user = req.user.user.id;
  console.log("userID", user)
  try {
    const products = await Product.find({user});
    res.status(200).json({count: products.length, products});
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
}
// End Sridhar