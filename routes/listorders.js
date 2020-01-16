const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth_middleware");
const User = require("../models/User");
const moment = require("moment");

router.get("/", ensureAuthenticated, async (req, res) => {
  const user = await User.findById({
    _id: req.session.passport.user
  }).populate("orders");

  let now = Date.now();

  const relative_times = user.orders.map(order => moment(order.date).from(now));

  res.render("listorders", {
    email: res.locals.user.email,
    user: res.locals.user,
    numOfProduct: res.locals.user.cart.length,
    listOrders: user.orders,
    relative_times
  });
});

module.exports = router;
