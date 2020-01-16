const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  function convertToVND(str) {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  }
  let arrayOfSlug = [];
  let arrayOfPrice = [];

  if (req.isAuthenticated()) {
    const user = await User.findById({
      _id: req.session.passport.user
    }).populate("cart");

    // Tính số lượng từng sản phẩm
    const histogram = new Map();

    if (user.cart == "") {
      res.render("cart_no_product", {
        email: user.email,
        allProducts: histogram,
        numOfProduct: user.cart.length,
        user: res.locals.user
      });
    } else {
      user.cart.forEach(product => {
        arrayOfSlug.push(product._id);
        arrayOfPrice.push(convertToVND(product.pricing.sale));
        if (histogram.has(product)) {
          histogram.set(product, histogram.get(product) + 1);
        } else {
          histogram.set(product, 1);
        }
      });

      arrayOfSlug = arrayOfSlug.join("-");
      arrayOfPrice = arrayOfPrice.join("-");

      res.render("cart", {
        email: user.email,
        allProducts: histogram,
        numOfProduct: user.cart.length,
        user: res.locals.user,
        arrayOfSlug,
        arrayOfPrice
      });
    }
  } else {
    const histogram = new Map();

    if (req.session.cart) {
      if (req.session.cart == "") {
        res.render("cart_no_product", {
          numOfProduct: 0
        });
      } else {
        req.session.cart.forEach(product => {
          arrayOfSlug.push(product._id);
          arrayOfPrice.push(convertToVND(product.pricing.sale));
          if (histogram.has(product)) {
            histogram.set(product, histogram.get(product) + 1);
          } else {
            histogram.set(product, 1);
          }
        });

        arrayOfSlug = arrayOfSlug.join("-");
        arrayOfPrice = arrayOfPrice.join("-");

        res.render("cart", {
          allProducts: histogram,
          numOfProduct: req.session.cart.length,
          arrayOfSlug,
          arrayOfPrice
        });
      }
    } else {
      res.render("cart", {
        allProducts: [],
        numOfProduct: 0
      });
    }
  }
});

router.post("/", async (req, res) => {
  const { slug } = req.body;
  const product = await Product.findOne({ slug: slug });
  if (req.isAuthenticated()) {
    await User.updateOne(
      { _id: req.session.passport.user },
      { $push: { cart: product._id } }
    );
  } else {
    req.session.cart.push(product);
  }
  res.end("bu cac");
});

router.get("/clear", async (req, res) => {
  if (req.isAuthenticated()) {
    await User.findByIdAndUpdate(
      { _id: req.session.passport.user },
      { $set: { cart: [] } }
    );
  } else {
    req.session.cart = [];
  }
  res.redirect("/cart");
});

module.exports = router;
