const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const { slug } = req.query;
  const product = await Product.findOne({ slug: slug });

  res.render("product", {
    product
  });
});

module.exports = router;
