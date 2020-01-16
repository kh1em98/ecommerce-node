const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/auth_middleware");

router.get("/:id", ensureAuthenticated, async (req, res) => {
  // Kiểm tra đơn hàng này có trong danh sách đơn hàng tài khoản mình ko
  const exist = res.locals.user.orders.filter(
    order => order._id == req.params.id
  );

  if (exist != "") {
    const order = await Order.findById({ _id: req.params.id }).populate(
      "products"
    );

    const histogram = new Map();
    order.products.forEach(product => {
      if (histogram.has(product)) {
        histogram.set(product, histogram.get(product) + 1);
      } else {
        histogram.set(product, 1);
      }
    });

    res.render("order", {
      email: res.locals.user.email,
      allProducts: histogram,
      user: res.locals.user,
      numOfProduct: res.locals.user.cart.length,
      prices: order.prices,
      total_price: order.total_price,
      name: order.name,
      phone: order.phone,
      address: order.address
    });
  } else {
    res.redirect("/listorders");
  }
});

module.exports = router;
