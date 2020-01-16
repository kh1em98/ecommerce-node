const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.post("/", async (req, res) => {
  let { name, phone, address, slugs, prices, total_price } = req.body;

  if (
    name == "" ||
    phone == "" ||
    address == "" ||
    slugs == "" ||
    prices == "" ||
    total_price == ""
  ) {
  } else {
    slugs = slugs.split("-");
    prices = prices.split("-");

    let order;

    if (req.isAuthenticated()) {
      order = new Order({
        name,
        address,
        phone,
        date: Date.now(),
        products: slugs,
        prices: prices,
        total_price,
        user: res.locals.user._id
      });
      await order.save();
    } else {
      order = new Order({
        name,
        address,
        phone,
        date: Date.now(),
        products: slugs,
        prices: prices,
        total_price
      });
      await order.save();
    }

    if (req.isAuthenticated()) {
      await User.updateOne(
        { _id: req.session.passport.user },
        { $push: { orders: order._id } }
      );
    }

    req.flash("success_msg", "Đặt hàng thành công");
    res.redirect("/cart/clear");
  }
});

module.exports = router;
