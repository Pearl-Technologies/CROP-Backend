const bidding = require("../../../models/admin/bidding/admin_bidding");
const createEveryDayPromotionSlot = async (req, res) => {
  // return console.log("hello")
  let { publishedAs, publishingSlot } = req.body;
  try {
    if (publishingSlot === "day") {
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
        date + 1000 * 60 * 60 * 24 * 11
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

      let findExistingSlot = await bidding.findOne({
        $and: [
          {
            bid_start_date,
            bid_end_date,
            publishedAs,
            published_start_date,
            published_end_date,
            publishingSlot
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
    const allSlot = await bidding.find({});
    res.status(200).json({ allSlot });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createEveryDayPromotionSlot, getSlot };
