const slot = require("../../../models/admin/bidding/admin_bidding");
// const slot = require("../../../models/admin/bidding/slot");
const schedule = require("node-schedule");
const moment = require("moment");
const createEveryDayPromotionSlot = async (req, res) => {
  res.send(req.body);
  return console.log("need to to change front end");
  let { publishedAs, publishingSlot } = req.body;
  try {
    if (publishingSlot === "weekday") {
      let date = Date.now();
      //bid_start_date
      let bid_start_date = new Date(date).toLocaleDateString();
      //bid_end_date
      let bid_end_date = new Date(
        date + 1000 * 60 * 60 * 24 * 1
      ).toLocaleDateString();
      //published_start_date
      let published_start_date = new Date(
        date + 1000 * 60 * 60 * 24 * 10
      ).toLocaleDateString();
      //published_end_date
      let published_end_date = new Date(
        date + 1000 * 60 * 60 * 24 * 10
      ).toLocaleDateString();
      console.log(publishingSlot, "publishing slot");
      console.log(publishedAs, "publishedAs slot");
      console.log(bid_start_date, "bid_start_date slot");
      console.log(bid_end_date, "bid_end_date slot");
      console.log(published_start_date, "published_start_date slot");
      console.log(published_end_date, "published_end_date slot");
      let findExistingSlot = await bidding.findOne({
        $and: [{ bid_start_date, bid_end_date, publishedAs }],
      });
      let yesterday = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 1
      ).toLocaleDateString();

      const deleteDoc = await bidding.find({
        publishingSlot: "weekday",
        bid_end_date: { $lte: yesterday },
      });
      if (deleteDoc.length > 0) {
        deleteDoc.map(
          async (data) => await bidding.findByIdAndDelete({ _id: data._id })
        );
      }
      if (findExistingSlot) {
        return res.status(403).json({ msg: "already exist" });
      }

      await bidding.create({
        publishingSlot,
        publishedAs: publishedAs,
        bid_start_date,
        bid_end_date,
        published_start_date,
        published_end_date,
      });
      res.status(201).json({ msg: "created" });
    } else if (publishingSlot === "weekly") {
      let date = Date.now();
      let startDate = new Date(date + 1000 * 60 * 60 * 24 * 8);
      let i = 8;
      while (startDate.getDay() !== 0) {
        startDate = new Date(date + 1000 * 60 * 60 * 24 * i);
        i++;
      }
      i = i + 5;
      let endDate = new Date(date + 1000 * 60 * 60 * 24 * i);
      let bid_start_date = new Date(
        startDate - 1000 * 60 * 60 * 24 * 10
      ).toLocaleDateString();
      let bid_end_date = new Date(
        startDate - 1000 * 60 * 60 * 24 * 9
      ).toLocaleDateString();
      let published_start_date = startDate.toLocaleDateString();
      let published_end_date = endDate.toLocaleDateString();

      let yesterday = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 1
      ).toLocaleDateString();
      const deleteDoc = await bidding.find({
        publishingSlot: "weekly",
        bid_end_date: { $lte: yesterday },
      });
      if (deleteDoc.length > 0) {
        deleteDoc.map(
          async (data) => await bidding.findByIdAndDelete({ _id: data._id })
        );
      }
      let findExistingSlot = await bidding.findOne({
        $and: [{ bid_start_date, bid_end_date, publishedAs, publishingSlot }],
      });
      if (findExistingSlot) {
        return res.status(403).json({ msg: "already exist" });
      }
      await bidding.create({
        publishingSlot,
        publishedAs: publishedAs,
        bid_start_date,
        bid_end_date,
        published_start_date,
        published_end_date,
      });
      res.status(201).json({ msg: "created" });
    } else if (publishingSlot === "monthly") {
      let currentMonth = new Date().getMonth();
      let publishedDate = Date.now() + 1000 * 60 * 60 * 24 * 1;
      let i = 1;
      while (new Date(publishedDate).getMonth() === currentMonth) {
        publishedDate = Date.now() + 1000 * 60 * 60 * 24 * i;
        i = i + 1;
      }
      let lastDate = publishedDate;
      let j = 1;

      while (new Date(lastDate).getMonth() === currentMonth + 1) {
        lastDate = publishedDate + 1000 * 60 * 60 * 24 * j;
        j = j + 1;
      }
      lastDate = lastDate - 1000 * 60 * 60 * 24 * 1;

      let bid_start_date = new Date(
        publishedDate - 1000 * 60 * 60 * 24 * 13
      ).toLocaleDateString();
      let bid_end_date = new Date(
        publishedDate - 1000 * 60 * 60 * 24 * 9
      ).toLocaleDateString();
      let published_start_date = new Date(publishedDate).toLocaleDateString();
      let published_end_date = new Date(lastDate).toLocaleDateString();

      let yesterday = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 1
      ).toLocaleDateString();
      const deleteDoc = await bidding.find({
        publishingSlot: "monthly",
        bid_end_date: { $lte: yesterday },
      });
      if (deleteDoc.length > 0) {
        deleteDoc.map(
          async (data) => await bidding.findByIdAndDelete({ _id: data._id })
        );
      }
      let findExistingSlot = await bidding.findOne({
        $and: [
          {
            bid_start_date,
            bid_end_date,
            publishedAs,
            published_start_date,
            published_end_date,
            publishingSlot,
          },
        ],
      });
      if (findExistingSlot) {
        return res.status(403).json({ msg: "already exist" });
      }
      await bidding.create({
        publishingSlot,
        publishedAs: publishedAs,
        bid_start_date,
        bid_end_date,
        published_start_date,
        published_end_date,
      });
      res.status(201).json({ msg: "created" });
    } else {
      console.log("not updated");
      return res.json({ msg: "not updated" });
    }
    // console.log(findExistingSlot);
  } catch (error) {
    return res.status();
  }
};
const getSlot = async (req, res) => {
  try {
    const allSlot = await slot.find({});
    res.status(200).json({ allSlot });
  } catch (error) {
    console.log(error);
  }
};
const makeSlot = async (data) => {
  let { publishedAs, publishingSlot } = data;
  // try {
  //   if (publishingSlot === "weekday") {

  //     let date = Date.now();
  //     //bid_start_date
  //     let bid_start_date = new Date(date).toLocaleDateString();
  //     //bid_end_date
  //     let bid_end_date = new Date(
  //       date + 1000 * 60 * 60 * 24 * 1
  //     ).toLocaleDateString();
  //     //published_start_date
  //     let published_start_date = new Date(
  //       date + 1000 * 60 * 60 * 24 * 10
  //     ).toLocaleDateString();
  //     //published_end_date
  //     let published_end_date = new Date(
  //       date + 1000 * 60 * 60 * 24 * 10
  //     ).toLocaleDateString();
  //     console.log(publishingSlot, "publishing slot")
  //     console.log(publishedAs, "publishedAs slot")
  //     console.log(bid_start_date, "bid_start_date slot")
  //     console.log(bid_end_date, "bid_end_date slot")
  //     console.log(published_start_date, "published_start_date slot")
  //     console.log(published_end_date, "published_end_date slot")
  //     let findExistingSlot = await bidding.findOne({
  //       $and: [{ bid_start_date, bid_end_date, publishedAs }],
  //     });
  //     let yesterday = new Date(Date.now()-1000*60*60*24*1).toLocaleDateString();

  //     const deleteDoc = await bidding.find({publishingSlot: "weekday", bid_end_date:{$lte:yesterday}});
  //     if(deleteDoc.length>0){
  //       deleteDoc.map(async (data)=>
  //       await bidding.findByIdAndDelete({_id:data._id})
  //       )
  //     }
  //     if (findExistingSlot) {
  //       console.log("already exist");
  //       return
  //     }

  //     await bidding.create({
  //       publishingSlot,
  //       publishedAs: publishedAs,
  //       bid_start_date,
  //       bid_end_date,
  //       published_start_date,
  //       published_end_date,
  //     });
  //     console.log("created" );
  //   } else if (publishingSlot === "weekly") {
  //     let date = Date.now();
  //     let startDate = new Date(date + 1000 * 60 * 60 * 24 * 8);
  //     let i = 8;
  //     while (startDate.getDay() !== 0) {
  //       startDate = new Date(date + 1000 * 60 * 60 * 24 * i);
  //       i++;
  //     }
  //     i = i + 5;
  //     let endDate = new Date(date + 1000 * 60 * 60 * 24 * i);
  //     let bid_start_date = new Date(
  //       startDate - 1000 * 60 * 60 * 24 * 10
  //     ).toLocaleDateString();
  //     let bid_end_date = new Date(
  //       startDate - 1000 * 60 * 60 * 24 * 9
  //     ).toLocaleDateString();
  //     let published_start_date = startDate.toLocaleDateString();
  //     let published_end_date = endDate.toLocaleDateString();

  //     let yesterday = new Date(Date.now()-1000*60*60*24*1).toLocaleDateString();
  //     const deleteDoc = await bidding.find({publishingSlot: "weekly", bid_end_date:{$lte:yesterday} });
  //     if(deleteDoc.length>0){
  //       deleteDoc.map(async (data)=>
  //       await bidding.findByIdAndDelete({_id:data._id})
  //       )
  //     }
  //     let findExistingSlot = await bidding.findOne({
  //       $and: [{ bid_start_date, bid_end_date, publishedAs, publishingSlot }],
  //     });
  //     if (findExistingSlot) {
  //       console.log("already exist")
  //       return ;
  //     }
  //     await bidding.create({
  //       publishingSlot,
  //       publishedAs: publishedAs,
  //       bid_start_date,
  //       bid_end_date,
  //       published_start_date,
  //       published_end_date,
  //     });
  //     console.log("created" );
  //   } else if (publishingSlot === "monthly") {
  //     let currentMonth = new Date().getMonth();
  //     let publishedDate = Date.now() + 1000 * 60 * 60 * 24 * 1;
  //     let i = 1;
  //     while (new Date(publishedDate).getMonth() === currentMonth) {
  //       publishedDate = Date.now() + 1000 * 60 * 60 * 24 * i;
  //       i = i + 1;
  //     }
  //     let lastDate = publishedDate;
  //     let j = 1;

  //     while (new Date(lastDate).getMonth() === currentMonth + 1) {
  //       lastDate = publishedDate + 1000 * 60 * 60 * 24 * j;
  //       j = j + 1;
  //     }
  //     lastDate = lastDate - 1000 * 60 * 60 * 24 * 1;

  //     let bid_start_date = new Date(
  //       publishedDate - 1000 * 60 * 60 * 24 * 13
  //     ).toLocaleDateString();
  //     let bid_end_date = new Date(
  //       publishedDate - 1000 * 60 * 60 * 24 * 9
  //     ).toLocaleDateString();
  //     let published_start_date = new Date(publishedDate).toLocaleDateString();
  //     let published_end_date = new Date(lastDate).toLocaleDateString();

  //     let yesterday = new Date(Date.now()-1000*60*60*24*1).toLocaleDateString();
  //     const deleteDoc = await bidding.find({publishingSlot: "monthly", bid_end_date:{$lte:yesterday} });
  //     if(deleteDoc.length>0){
  //       deleteDoc.map(async (data)=>
  //       await bidding.findByIdAndDelete({_id:data._id})
  //       )
  //     }
  //     let findExistingSlot = await bidding.findOne({
  //       $and: [
  //         {
  //           bid_start_date,
  //           bid_end_date,
  //           publishedAs,
  //           published_start_date,
  //           published_end_date,
  //           publishingSlot
  //         },
  //       ],
  //     });
  //     if (findExistingSlot) {
  //       console.log("already exist");
  //       return
  //     }
  //     await bidding.create({
  //       publishingSlot,
  //       publishedAs: publishedAs,
  //       bid_start_date,
  //       bid_end_date,
  //       published_start_date,
  //       published_end_date,
  //     });
  //     console.log("created");
  //   } else {
  //     console.log("not updated");

  //   }
  //   // console.log(findExistingSlot);
  // } catch (error) {
  //   console.log(error);
  // }

  try {
    if (publishingSlot == "weekday") {
      const currentDate = moment();
      let startDate = currentDate.startOf('day')
      let endDate = moment(currentDate).add(1, 'year').startOf('day')
    
      for (let date = moment(startDate); date <= endDate; date.add(1, "day")) {
        if (moment(date).day() == 0 || moment(date).day() == 6) {
          publishingSlot = "weekend";
        } else {
          publishingSlot = "weekday";
        }
        const published_start_date = moment(date).format("YYYY-MM-DD");
        const published_end_date = moment(date).format("YYYY-MM-DD");
        const bid_end_date = moment(date)
          .subtract(9, "day")
          .format("YYYY-MM-DD");          
        let find_a_slot = await slot.findOne({
          publishedAs,
          publishingSlot,
          bid_end_date,
          published_start_date,
          published_end_date,
        });
        if (find_a_slot) {
          console.log("slot is already exist");
          return;
        }
        await slot.create({
          publishingSlot,
          publishedAs,
          bid_end_date,
          published_start_date,
          published_end_date,
        });
      }
      console.log("Slots for the weekly current year have been created.");
    } else if (publishingSlot == "weekly") {
      const startDate = moment()
      const endDate = moment(startDate).add(1, "year");
      const weekDates = [];
      for (let date = moment(startDate); date <= endDate; date.add(1, "day")) {
        const startOfWeek = moment(date).isoWeekday(1).startOf("day");
        const formattedStartDate = startOfWeek.format("YYYY-MM-DD");

        if (weekDates.includes(formattedStartDate)) {
          continue;
        } else {
          weekDates.push(formattedStartDate);
          let bid_end_date = moment(formattedStartDate)
            .subtract(9, "day")
            .format("YYYY-MM-DD");
          let published_start_date = formattedStartDate;
          let published_end_date = moment(formattedStartDate)
            .add(6, "day")
            .format("YYYY-MM-DD");
          let findWeeklyRecord = await slot.findOne({
            publishedAs,
            publishingSlot,
            bid_end_date,
            published_start_date,
            published_end_date,
          });
          if (findWeeklyRecord) {
            console.log("weekly slot already is exist");
            return;
          }
          await slot.create({
            publishingSlot,
            publishedAs,
            bid_end_date,
            published_start_date,
            published_end_date,
          });
          console.log("Slots for the weekday current year have been created");
        }
      }
    } else if (publishingSlot == "monthly") {
      let startDate= moment();
      let endDate = moment(startDate).add(1, 'year');
      for (let date = moment(startDate); date <= endDate; date.add(1, "month")) {
        let month = date.month();
        let year = date.year();   

        let published_start_date = moment({ year, month })
          .startOf("month")
          .format("YYYY-MM-DD");
        let published_end_date = moment({ year, month })
          .endOf("month")
          .format("YYYY-MM-DD");
        let currentDate = moment({ year, month }).startOf("month");
        let bid_end_date = currentDate.subtract(9, "day").format("YYYY-MM-DD");
        let findMontylyRecord = await slot.findOne({
          publishedAs,
          publishingSlot,
          bid_end_date,
          published_start_date,
          published_end_date,
        });
        if (findMontylyRecord) {
          console.log("monthly slot already is exist");
          return;
        }
        await slot.create({
          publishingSlot,
          publishedAs,
          bid_end_date,
          published_start_date,
          published_end_date,
        });
        console.log("Slots for the monthly current year have been created");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
let datas = [
  {
    publishedAs: "promo",
    publishingSlot: "monthly",
  },
  {
    publishedAs: "promo",
    publishingSlot: "weekday",
  },
  {
    publishedAs: "promo",
    publishingSlot: "weekly",
  },
  {
    publishedAs: "topRank",
    publishingSlot: "monthly",
  },
  {
    publishedAs: "topRank",
    publishingSlot: "weekday",
  },
  {
    publishedAs: "topRank",
    publishingSlot: "weekly",
  },
  {
    publishedAs: "both",
    publishingSlot: "monthly",
  },
  {
    publishedAs: "both",
    publishingSlot: "weekday",
  },
  {
    publishedAs: "both",
    publishingSlot: "weekly",
  },
];
const everyDayRender = () => {
  datas.map((data) => {
    makeSlot(data);
  });
};
const job = schedule.scheduleJob("0 0 * * *", function () {
  // return
  console.log("This job runs at midnight every day!");
  everyDayRender();
});

const yearlySlot = () => {
  const moment = require("moment");
  async function createSlotsForYear() {
    const count = [];
    if (count.length > 0) {
      console.log("Slots for the current year already exist.");
    } else {
      // Iterate over each day of the year
      const startDate = moment().startOf("year");
      const endDate = moment().endOf("year");
      console.log(moment().subtract(10, "day"));
      const publishingSlot = "weekday";
      for (let date = moment(startDate); date <= endDate; date.add(1, "day")) {
        if (moment(date).day() == 0 || moment(date).day() == 6) {
          publishingSlot = "weekend";
        }
        const published_start_date = moment(date).format("YYYY-MM-DD");
        const published_end_date = moment(date).format("YYYY-MM-DD");
        const bid_end_date = moment(date)
          .subtract(9, "day")
          .format("YYYY-MM-DD");

        await slot.create({
          publishingSlot,
          publishedAs,
          bid_end_date,
          published_start_date,
          published_end_date,
        });
        // const startOfWeek = moment(date).isoWeekday(1).startOf('day');
        // const formattedStartDate = startOfWeek.format('YYYY-MM-DD');
        //       console.log(formattedStartDate,  'week');
        //       console.log(moment(date).format('YYYY-MM-DD'), "start date", 'end date');
        //       console.log(moment(date).subtract(9, 'day').format('YYYY-MM-DD'), "bid end date");
        // await slot.create({ date: date.format('YYYY-MM-DD') });
        // console.log(`Slot created for ${date.format('YYYY-MM-DD')}`);
      }

      // console.log(moment().week(), "");

      console.log("Slots for the current year have been created.");
    }
  }
  createSlotsForYear();
};
// start the job
job.schedule();
// everyDayRender();
module.exports = { createEveryDayPromotionSlot, getSlot };
