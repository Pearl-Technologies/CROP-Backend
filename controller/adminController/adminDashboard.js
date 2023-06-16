const admin = require("../../models/superAdminModel/user");
const { customerPaymentTracker } = require("../../models/admin/PaymentTracker/paymentIdTracker");
const  business  = require("../../models/businessModel/business");
const bcrypt = require("bcryptjs");
const customerCropTransaction = require("../../models/CropTransaction");
const customerPropTransaction = require("../../models/PropTransaction");
const { User } = require("../../models/User");
const schedule = require("node-schedule");

const dashboard = async (req, res) => {
  try {
    // const businessUsers = await business.aggregate([{$match: {$eq:{status:"active"}}},{$project: {_id: 1}}]);
    // const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([{$match: {$eq:{status:"active"}}},{$project: {cartDetails: {cartItems: 1}}}]);
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)

    // const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([
    //   { $match: { $and: [{ status: "paid" }, { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }] } },
    //   { $unwind: "$cartDetails.cartItems" },
    //   { $project: { "cartDetails.cartItems": 1 } },
    //   { $group: { _id: "$cartDetails.cartItems._id", quantity: { $sum: "$cartDetails.cartItems.cartQuantity" }, businessUser: { $first: "$cartDetails.cartItems.user" } } },
    //   { $group: { _id: "$businessUser", quantity: { $sum: "$quantity" }, user:{ $push:"$_id" } } },
    //   { $sort: { quantity:-1 } },
    //   { $limit : 1 }
    // ])

    const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([
      {
        $match: {
          status: "paid",
          $expr: {
            $eq: [{ $month: "$createdAt" }, currentMonth]
          }
        }
      },
      { $unwind: "$cartDetails.cartItems" },
      { $project: { "cartDetails.cartItems": 1 } },
      { $group: { _id: "$cartDetails.cartItems._id", quantity: { $sum: "$cartDetails.cartItems.cartQuantity" }, businessUser: { $first: "$cartDetails.cartItems.user" } } },
      { $group: { _id: "$businessUser", quantity: { $sum: "$quantity" }, products: { $push: "$_id" } } },
      { $sort: { quantity: -1 } },
      { $limit: 1 }
    ])

    let empData 

    if(paymentTrackerForCustomerPurchase.length>0){

      empData =  await business.find({_id:paymentTrackerForCustomerPurchase[0]._id});
      console.log(empData)
      res.status(200).json({ data: empData,status:200 });
    }
    else{
      res.status(200).send({data:[],msg:"No business user found", status: 200});
    }
  

    // console.log(paymentTrackerForCustomerPurchase)
  } catch (error) {
    console.error(error.message);
    res.status(500).send({msg:"Internal Server Error", status: 500});
  }
};

const getDetailsCount = async (req, res)=>{
  try{
    const businessData = await business.aggregate([{$group:{_id:"$status",count:{$sum:1}}},
    { $group:{
      _id:"BusinessCount",
      business:{
        $push:{
          status:"$_id",
          count:"$count"
        }
      },
      TotalBusiness:{$sum:"$count"}
    } }
    ])

    const userData = await User.aggregate([{$group:{_id:"$status",count:{$sum:1}}},
    { $group:{
      _id:"CustomerCount",
      customer:{
        $push:{
          status:"$_id",
          count:"$count"
        }
      },
      TotalCustomer:{$sum:"$count"}
    } }
    ])

    res.status(200).json({ data: {...userData[0],...businessData[0]},status:200 });
  }
  catch(err){
    console.log(err)
    res.status(500).send({msg:"Internal server error", status: 500});
  }
}

const getSalesDeatils = async(req, res)=>{
  try{
    // const salesDetails = await customerPaymentTracker.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         { status: "paid" },
    //         { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }
    //       ]
    //     }
    //   },
    //   { $unwind: "$cartDetails.cartItems" },
    //   { $project: { "cartDetails.cartItems": 1 } },
    //   {
    //     $group: {
    //       _id: "$cartDetails.cartItems._id",
    //       productName: { $first: "$cartDetails.cartItems.title" },
    //       price: { $sum: "$cartDetails.cartItems.price" },
    //       quantity: { $sum: "$cartDetails.cartItems.cartQuantity" },
    //       businessUser: { $first: "$cartDetails.cartItems.user" }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$businessUser",
    //       totalPrice: { $sum: "$price" },
    //       quantity: { $sum: "$quantity" },
    //       products: { $push: "$_id" },
    //       productNames: { $push: "$productName" }
    //     }
    //   },
    //   { $sort: { quantity: -1 } },
    //   { $limit: 3 }
    // ])
    const salesDetails = await customerPaymentTracker.aggregate([
      {
        $match: {
          $and: [
            { status: "paid" }
          ]
        }
      },
      {$facet:
        {
          salesDetails:[
          {
              $match: {
                $and: [
                  { status: "paid" },
                  { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }
                ]
              }
          },
          { $unwind: "$cartDetails.cartItems" },
          { $project: { "cartDetails.cartItems": 1 } },
          {
            $group: {
              _id: "$cartDetails.cartItems._id",
              productName: { $first: "$cartDetails.cartItems.title" },
              price: { $sum: "$cartDetails.cartItems.price" },
              quantity: { $sum: "$cartDetails.cartItems.cartQuantity" },
              businessUser: { $first: "$cartDetails.cartItems.user" }
            }
          },
          {
            $group: {
              _id: "$businessUser",
              totalPrice: { $sum: "$price" },
              quantity: { $sum: "$quantity" },
              products: { $push: "$_id" },
              productNames: { $push: "$productName" }
            }
          },
          { $sort: { quantity: -1 } },
          { $limit: 3 }],
          salesPercentage:[
            {
              $match: {
                $and: [
                  { status: "paid" },
                  {
                    $or: [
                      { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), $lt: new Date() } },
                      { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) } } // Current month
                    ]
                  }
                ]
              }
            },
            { $unwind: "$cartDetails.cartItems" },
            { $addFields: { createdAt: "$createdAt" } },
            {
              $group: {
                _id: {
                  $cond: {
                    if: { $eq: [{ $dateToString: { format: "%Y-%m", date: "$createdAt" } }, { $dateToString: { format: "%Y-%m", date: new Date() } }] },
                    then: "Current Month",
                    else: "Previous Month"
                  }
                },
                totalPrice: { $sum: "$cartDetails.cartItems.price" }
              }
            }
          ]
        }
      }
    ])
    
    

    let empData=[];


    let finalData = await Promise.all(salesDetails[0].salesDetails.map(async (data) => {
      let tempData = await business.find({ _id: data._id });
      // let userName = tempData[0].fName + " " + tempData[0].mName + " " + tempData[0].lName;
      let userName = tempData[0].businessName;
      let tempObj = { ...{ name: userName }, ...data };
      return tempObj;
    }));

    let finalStatsData=[]

    let finalStats = await Promise.all(salesDetails[0].salesPercentage.map(async (data) => {
      finalStatsData.push(data)
    }));
    

    res.status(200).json({ data:{finalData:finalData,stats:finalStatsData},status:200 });
  }
  catch(err){
    console.log(err)
    res.status(500).send({msg:"Internal server error", status: 500});
  }
}

// const getWeeklyDetails=async (req,res)=>{
//   try{
//     const weeklySales = await customerPaymentTracker.aggregate([
//     //   {
//     //     $match: {
//     //       $and: [
//     //         { status: "paid" },
//     //         {
//     //           createdAt: {
//     //             $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//     //             $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
//     //           }
//     //         }
//     //       ]
//     //     }
//     //   },
//     //   { $unwind: "$cartDetails.cartItems" },
//     //   {
//     //     $group: {
//     //       _id: "$cartDetails.cartItems._id",
//     //       list: {
//     //         $push: {
//     //           user: "$cartDetails.cartItems.user",
//     //           price: "$cartDetails.cartItems.price",
//     //           createdAt: "$createdAt"
//     //         }
//     //       }
//     //     }
//     //   },
//     //   { $unwind: "$list" },
//     //   {
//     //     $match: {
//     //       $expr: {
//     //         $eq: [{ $week: "$list.createdAt" }, { $week: new Date() }]
//     //       }
//     //     }
//     //   },
//     //   {
//     //     $group: {
//     //       _id: {
//     //         dayOfWeek: { $dayOfWeek: "$list.createdAt" }
//     //       },
//     //       price: {
//     //         $sum: "$list.price"
//     //       }
//     //     }
//     //   },
//     //   {
//     //     $group: {
//     //       _id: null,
//     //       weeklySales: {
//     //         $push: {
//     //           dayOfWeek: "$_id.dayOfWeek",
//     //           price: "$price"
//     //         }
//     //       }
//     //     }
//     //   },
//     //   {
//     //     $project: {
//     //       _id: 0,
//     //       weeklySales: {
//     //         $map: {
//     //           input: { $range: [1, 8] },
//     //           as: "day",
//     //           in: {
//     //             dayOfWeek: "$$day",
//     //             price: {
//     //               $let: {
//     //                 vars: {
//     //                   matchedSale: {
//     //                     $arrayElemAt: [
//     //                       {
//     //                         $filter: {
//     //                           input: "$weeklySales",
//     //                           cond: { $eq: ["$$this.dayOfWeek", "$$day"] }
//     //                         }
//     //                       },
//     //                       0
//     //                     ]
//     //                   }
//     //                 },
//     //                 in: { $ifNull: ["$$matchedSale.price", 0] }
//     //               }
//     //             }
//     //           }
//     //         }
//     //       }
//     //     }
//     //   }
//     // ]);
    
//     res.status(200).json({ data:weeklySales[0].weeklySales,status:200 });
//   }
//   catch(err){
//     console.log(err)
//     res.status(500).send({msg:"Internal server error", status: 500});
//   }
// }

const getWeeklyDetails = async (req, res) => {
  try {
    // console.log(new Date(new Date(req.query.date).getFullYear(),new Date(req.query.date).getMonth(),new Date(req.query.date).getDate()))
    let date = req.query.date == "null" || req.query.date == null ? new Date() : req.query.date;
    let currentDate=new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate())
    let nextMonth=new Date(new Date(date).getFullYear(), new Date(date).getMonth()+1, new Date(date).getDate())
    let previousMonth=new Date(new Date(date).getFullYear(), new Date(date).getMonth()-1, new Date(date).getDate())
    let pickCurrentDate=new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1)
    let pickNextDate=new Date(new Date(date).getFullYear(), new Date(date).getMonth()+1, 1)
    let pickWeek=new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate())
    pickWeek.setDate(pickWeek.getDate()-7)
    console.log(currentDate,nextMonth,previousMonth)
    const weeklySales = await customerPaymentTracker.aggregate([
      {
        $facet: {
          weeklyDetails: [
            {
              $match: {
                status: "paid",
                createdAt: {
                  $gte: pickCurrentDate,
                  $lt: pickNextDate
                }
              }
            },
            { $unwind: "$cartDetails.cartItems" },
            {
              $group: {
                _id: "$cartDetails.cartItems._id",
                list: {
                  $push: {
                    user: "$cartDetails.cartItems.user",
                    price: "$cartDetails.cartItems.price",
                    createdAt: "$createdAt"
                  }
                }
              }
            },
            { $unwind: "$list" },
            {
              $match: {
                $expr: {
                  $eq: [{ $week: "$list.createdAt" }, { $week: currentDate }]
                }
              }
            },
            {
              $group: {
                _id: { dayOfWeek: { $dayOfWeek: "$list.createdAt" } },
                price: { $sum: "$list.price" }
              }
            },
            {
              $group: {
                _id: null,
                weeklySales: {
                  $push: {
                    dayOfWeek: "$_id.dayOfWeek",
                    price: "$price"
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                weeklySales: {
                  $map: {
                    input: { $range: [1, 8] },
                    as: "day",
                    in: {
                      dayOfWeek: "$$day",
                      price: {
                        $let: {
                          vars: {
                            matchedSale: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$weeklySales",
                                    cond: { $eq: ["$$this.dayOfWeek", "$$day"] }
                                  }
                                },
                                0
                              ]
                            }
                          },
                          in: { $ifNull: ["$$matchedSale.price", 0] }
                        }
                      }
                    }
                  }
                }
              }
            }
          ],
          weeklyPercentage: [
            {
              $match: {
                status: "paid",
                createdAt: {
                  $gte: pickCurrentDate,
                  $lte: pickNextDate
                }
              }
            },
            { $unwind: "$cartDetails.cartItems" },
            {
              $group: {
                _id: "$cartDetails.cartItems._id",
                list: {
                  $push: {
                    user: "$cartDetails.cartItems.user",
                    price: "$cartDetails.cartItems.price",
                    createdAt: "$createdAt"
                  }
                }
              }
            },
            { $unwind: "$list" },
            {
              $group: {
                _id: {
                  $cond: {
                    if: { $eq: [{ $week: "$list.createdAt" }, { $week: currentDate }] },
                    then: "Current Week",
                    else: {
                      $cond: {
                        if: { $eq: [{ $week: "$list.createdAt" }, { $week: pickWeek }] },
                        then: "Previous Week",
                        else: "Other Week"
                      }
                    }
                  }
                },
                totalPrice: { $sum: "$list.price" }
              }
            },
            {
              $group: {
                _id: null,
                weeklyPercentage: {
                  $push: {
                    week: "$_id",
                    totalPrice: "$totalPrice"
                  }
                }
              }
            },
            {
              $project: {
                weeklyPercentage: {
                  $map: {
                    input: ["Current Week", "Previous Week", "Other Week"],
                    as: "week",
                    in: {
                      $cond: {
                        if: { $in: ["$$week", "$weeklyPercentage.week"] },
                        then: {
                          week: "$$week",
                          totalPrice: {
                            $arrayElemAt: [
                              "$weeklyPercentage.totalPrice",
                              {
                                $indexOfArray: ["$weeklyPercentage.week", "$$week"]
                              }
                            ]
                          }
                        },
                        else: { week: "$$week", totalPrice: 0 }
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      }
    ]);
    
    // const weeklySales = await customerPaymentTracker.aggregate([
    //   {
    //     $facet: {
    //       weeklyDetails: [
    //         {
    //           $match: {
    //             status: "paid",
    //             createdAt: {
    //               $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    //               $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    //             }
    //           }
    //         },
    //         { $unwind: "$cartDetails.cartItems" },
    //         {
    //           $group: {
    //             _id: "$cartDetails.cartItems._id",
    //             list: {
    //               $push: {
    //                 user: "$cartDetails.cartItems.user",
    //                 price: "$cartDetails.cartItems.price",
    //                 createdAt: "$createdAt"
    //               }
    //             }
    //           }
    //         },
    //         { $unwind: "$list" },
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: [{ $week: "$list.createdAt" }, { $week: new Date() }]
    //             }
    //           }
    //         },
    //         {
    //           $group: {
    //             _id: { dayOfWeek: { $dayOfWeek: "$list.createdAt" } },
    //             price: { $sum: "$list.price" }
    //           }
    //         },
    //         {
    //           $group: {
    //             _id: null,
    //             weeklySales: {
    //               $push: {
    //                 dayOfWeek: "$_id.dayOfWeek",
    //                 price: "$price"
    //               }
    //             }
    //           }
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             weeklySales: {
    //               $map: {
    //                 input: { $range: [1, 8] },
    //                 as: "day",
    //                 in: {
    //                   dayOfWeek: "$$day",
    //                   price: {
    //                     $let: {
    //                       vars: {
    //                         matchedSale: {
    //                           $arrayElemAt: [
    //                             {
    //                               $filter: {
    //                                 input: "$weeklySales",
    //                                 cond: { $eq: ["$$this.dayOfWeek", "$$day"] }
    //                               }
    //                             },
    //                             0
    //                           ]
    //                         }
    //                       },
    //                       in: { $ifNull: ["$$matchedSale.price", 0] }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       ],
    //       weeklyPercentage: [
    //         {
    //           $match: {
    //             status: "paid",
    //             createdAt: {
    //               $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    //               $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    //             }
    //           }
    //         },
    //         { $unwind: "$cartDetails.cartItems" },
    //         {
    //           $group: {
    //             _id: "$cartDetails.cartItems._id",
    //             list: {
    //               $push: {
    //                 user: "$cartDetails.cartItems.user",
    //                 price: "$cartDetails.cartItems.price",
    //                 createdAt: "$createdAt"
    //               }
    //             }
    //           }
    //         },
    //         { $unwind: "$list" },
    //         {
    //           $group: {
    //             _id: {
    //               $cond: {
    //                 if: { $eq: [{ $week: "$list.createdAt" }, { $week: new Date() }] },
    //                 then: "Current Week",
    //                 else: {
    //                   $cond: {
    //                     if: {
    //                       $eq: [
    //                         { $week: "$list.createdAt" },
    //                         { $week: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) }
    //                       ]
    //                     },
    //                     then: "Previous Week",
    //                     else: "Other Week"
    //                   }
    //                 }
    //               }
    //             },
    //             totalPrice: { $sum: "$list.price" }
    //           }
    //         }
    //       ]
    //     }
    //   }
    // ]);

    res.status(200).json({ data: weeklySales[0], status: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error", status: 500 });
  }
};

const getPerformingProducts = async (req,res)=>{
  let filter=req.query.filter;
  let sort=0;
  if(filter=="low"){
    sort=1
  }
  else{
    sort=-1
  }
  let products = await customerPaymentTracker.aggregate([
    {
      $match: {
        $and: [
          { status: "paid" },
          { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }
        ]
      }
    },
    { $unwind: "$cartDetails.cartItems" },
    { $project: { "cartDetails.cartItems": 1 } },
    {
      $group: {
        _id: "$cartDetails.cartItems._id",
        productName: { $first: "$cartDetails.cartItems.title" },
        price: { $sum: "$cartDetails.cartItems.price" },
        quantity: { $sum: "$cartDetails.cartItems.cartQuantity" },
        businessUser: { $first: "$cartDetails.cartItems.user" }
      }
    },
    {
      $addFields: {
        businessUserId: { $toObjectId: "$businessUser" }
      }
    },
    {
      $lookup: {
        from: "businesses",
        localField: "businessUserId",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $project: {
        _id: 1,
        productName: 1,
        price: 1,
        quantity: 1,
        businessUser: 1,
        productDetails: {
          fName:1,
          mName:1,
          lName:1,
          businessName:1
        }
      }
    },
    {
      $sort: {
        price: sort
      }
    },
  ])
  

    res.status(200).json({ data: products, status: 200 });
}

const getSlotCalender = async (req, res) => {
  try {
    const allSlot = await bidding.aggregate([
      {
        $group: {
          _id: "$bid_end_date",
          count: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json({ allSlot });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, status: 500 })
  }
};

const getCropPropDebitCredit = async (req, res) => {
  try {
    const cropDebitCredit = await customerCropTransaction.aggregate([
      {
        $group: {
          _id: "$transactionType",
          totalDebit: {
            $sum: { $cond: [{ $eq: ["$transactionType", "debit"] }, "$crop", 0] }
          },
          totalCredit: {
            $sum: { $cond: [{ $eq: ["$transactionType", "credit"] }, "$crop", 0] }
          }
        }
      }
    ]);
    const propDebitCredit = await customerPropTransaction.aggregate([
      {
        $group: {
          _id: "$transactionType",
          totalDebit: {
            $sum: { $cond: [{ $eq: ["$transactionType", "debit"] }, "$prop", 0] }
          },
          totalCredit: {
            $sum: { $cond: [{ $eq: ["$transactionType", "credit"] }, "$prop", 0] }
          }
        }
      }
    ]);
    res.status(200).json({ crop: cropDebitCredit, prop: propDebitCredit, status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, status: 500 })
  }
};

function isOneYearAgo(dateString) {
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - givenDate.getTime();

  const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;

  return timeDiff >= millisecondsInYear;
}
const jobCropPropExpire = schedule.scheduleJob("0 0 * * *", function () {
  console.log("This job runs at midnight every day for CropPropExpire!");
  cropPointExpire();
});
const cropPointExpire = async () => {
  try {
    const cropDebitCredit = await customerCropTransaction.find({expired: false, transactionType: "credit"});
    for(let i=0; i<cropDebitCredit.length; i++){
      const crop = isOneYearAgo(cropDebitCredit[i].createdAt); 
      console.log(`Is ${cropDebitCredit[i].createdAt} one year ago or more? ${crop}`);
      if(crop == true){
        await customerCropTransaction.updateOne({_id:cropDebitCredit[i]._id}, { $set: { expired: true }});
        const croppoints = await customerCropTransaction.aggregate([
          {
            $match: {
              user: cropDebitCredit[i].user,
              expired: false
            }
          },
          {
            $group: {
              _id: "$transactionType",
              totalCredit: {
                $sum: {
                  $cond: [
                    { $eq: ["$transactionType", "credit"] },
                    "$crop",
                    0
                  ]
                }
              }
            }
          }
        ]);        
        await User.updateOne({_id: cropDebitCredit[i].user},{$set:{croppoints:croppoints[0].totalCredit != 0 ?croppoints[0].totalCredit : croppoints[1].totalCredit}})
      }
    }
    const propDebitCredit = await customerPropTransaction.find({expired: false, transactionType: "credit"});
    for(let i=0; i<propDebitCredit.length; i++){
      const prop = isOneYearAgo(propDebitCredit[i].createdAt); 
      console.log(`Is ${propDebitCredit[i].createdAt} one year ago or more? ${prop}`);
      if(prop == true){
        await customerPropTransaction.updateOne({_id:propDebitCredit[i]._id}, { $set: { expired: true }});
        const proppoints = await customerPropTransaction.aggregate([
          {
            $match: {
              user: propDebitCredit[i].user,
              expired: false
            }
          },
          {
            $group: {
              _id: "$transactionType",
              totalCredit: {
                $sum: {
                  $cond: [
                    { $eq: ["$transactionType", "credit"] },
                    "$prop",
                    0
                  ]
                }
              }
            }
          }
        ]);        
        await User.updateOne({_id: propDebitCredit[i].user},{$set:{proppoints:proppoints[0].totalCredit != 0 ?proppoints[0].totalCredit : proppoints[1].totalCredit}})
      }
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

jobCropPropExpire.schedule();
module.exports = {dashboard, getDetailsCount, getSalesDeatils, getWeeklyDetails, getPerformingProducts, getSlotCalender, getCropPropDebitCredit};
