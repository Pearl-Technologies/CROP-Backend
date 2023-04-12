const bidding = require("../../../models/admin/bidding/admin_bidding");

const createEveryDayPromotionSlot = async (req, res) => {
  let { publishedAs, publishingSlot } = req.body;
  try {
    if (publishingSlot === "day") {      
        let date = Date.now();
        //bid_start_date
      let bid_start_date = new Date(date).toLocaleDateString();
        //bid_end_date
      let bid_end_date = new Date(
        date + 1000 * 60 * 60 * 24 * 2
      ).toLocaleDateString();
        //published_start_date
      let published_start_date = new Date(
        date + 1000 * 60 * 60 * 24 * 8
      ).toLocaleDateString();
        //published_end_date
      let published_end_date = new Date(
        date + 1000 * 60 * 60 * 24 * 9
      ).toLocaleDateString();
      
      let findExistingSlot = await bidding.findOne({
        $and: [{ bid_start_date, bid_end_date, publishedAs }],
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
    } else if (publishingSlot === "week") {
      let date = Date.now();
      let startDate = new Date(date + 1000 * 60 * 60 * 24 * 8);
      console.log(startDate.getDay());
      let i = 8;
      while (startDate.getDay() !== 6) {
        startDate = new Date(date + 1000 * 60 * 60 * 24 * i);
        i++;
      }
      i = i + 5;
      let endDate = new Date(date + 1000 * 60 * 60 * 24 * i);
      let bid_start_date = startDate - 1000*60*60*24*3
      let bid_end_date = startDate-1000*60*60*24*1  
      let published_start_date = startDate
      let published_end_date = endDate

      let findExistingSlot = await bidding.findOne({
        $and: [{ bid_start_date, bid_end_date, publishedAs, published_start_date,  published_end_date}]
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
        published_end_date
      });
      res.status(201).json({ msg: "created" });
    } else if (publishingSlot === "month") {
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
        console.log(new Date(lastDate).toDateString());
        j = j + 1;
      }
      lastDate = lastDate - 1000 * 60 * 60 * 24 * 1;
      // console.log(new Date(lastDate).toDateString());
      console.log(
        "start date",
        new Date(lastDate).toLocaleDateString(),
        "end date",
        new Date(publishedDate).toLocaleDateString()
      );
      return res.send("ok");
    }

   
    // console.log(findExistingSlot);
  } catch (error) {
    return res.status();
  }
};

module.exports = { createEveryDayPromotionSlot };
