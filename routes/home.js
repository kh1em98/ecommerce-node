const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const dsProduct = await Product.find({}).limit(8);
  if (req.isAuthenticated()) {
    res.render("index", {
      products: dsProduct,
      email: res.locals.user.email,
      numOfProduct: res.locals.user.cart.length
    });
  } else {
    if (req.session.cart) {
      res.render("index", {
        products: dsProduct,
        numOfProduct: req.session.cart.length
      });
    } else {
      res.render("index", {
        products: dsProduct,
        numOfProduct: 0
      });
    }
  }
});

module.exports = router;
