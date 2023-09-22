const slot = require("../../../models/admin/bidding/admin_bidding");
// const slot = require("../../../models/admin/bidding/slot");
const { PropPaymentNotification } = require("../CustomerData/customer");
const schedule = require("node-schedule");
const moment = require("moment");
const getSlot = async (req, res) => {
  let {date} = req.params
  console.log(date);
  try {
    if(date){
      const allSlot = await slot.find({published_start_date:date});
      res.status(200).json({ allSlot });
    }else{
      res.status(200).json({ allSlot:[] });
    }
  } catch (error) {
    console.log(error);
  }
};
const makeSlot = async (data) => {
  let { publishedAs, publishingSlot } = data;
  try {
    if (publishingSlot == "weekday") {
      const currentDate = moment();
      let startDate = currentDate.startOf("day");
      let endDate = moment(currentDate).add(1, "year").startOf("day");

      for (let date = moment(startDate); date <= endDate; date.add(1, "day")) {
        if (moment(date).day() == 0 || moment(date).day() == 6) {
          publishingSlot = "weekend";
        } else {
          publishingSlot = "weekday";
        }
        const published_start_date = moment(date).format("YYYY-MM-DD");
        const published_end_date = moment(date).format("YYYY-MM-DD");
        const bid_end_date = moment(date).subtract(7, "day").format("YYYY-MM-DD");
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
      const startDate = moment();
      const endDate = moment(startDate).add(1, "year");
      const weekDates = [];
      for (let date = moment(startDate); date <= endDate; date.add(1, "day")) {
        const startOfWeek = moment(date).isoWeekday(1).startOf("day");
        const formattedStartDate = startOfWeek.format("YYYY-MM-DD");

        if (weekDates.includes(formattedStartDate)) {
          continue;
        } else {
          weekDates.push(formattedStartDate);
          let bid_end_date = moment(formattedStartDate).subtract(7, "day").format("YYYY-MM-DD");
          let published_start_date = formattedStartDate;
          let published_end_date = moment(formattedStartDate).add(6, "day").format("YYYY-MM-DD");
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
      let startDate = moment();
      let endDate = moment(startDate).add(1, "year");
      for (let date = moment(startDate); date <= endDate; date.add(1, "month")) {
        let month = date.month();
        let year = date.year();

        let published_start_date = moment({ year, month }).startOf("month").format("YYYY-MM-DD");
        let published_end_date = moment({ year, month }).endOf("month").format("YYYY-MM-DD");
        let currentDate = moment({ year, month }).startOf("month");
        let bid_end_date = currentDate.subtract(7, "day").format("YYYY-MM-DD");
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
  PropPaymentNotification();
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
        const bid_end_date = moment(date).subtract(9, "day").format("YYYY-MM-DD");

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
module.exports = { getSlot };
