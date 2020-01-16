const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");

// Hiện thanh chọn trang
function pagination(currentPage, totalPage) {
  let result = [];
  let arrayOfNumPage = [];
  for (let i = 1; i <= totalPage; i++) {
    arrayOfNumPage.push(i);
  }

  currentPage = parseInt(currentPage);

  if (currentPage === 1 || currentPage === 2) {
    result = arrayOfNumPage.slice(0, 5);
    if (currentPage !== 1) {
      result.unshift("Previous");
    }
    result.push("Next");
  } else if (currentPage === totalPage - 1 || currentPage === totalPage) {
    result = arrayOfNumPage.slice(totalPage - 5, totalPage);
    if (currentPage !== totalPage) {
      result.push("Next");
    }
    result.unshift("Previous");
  } else {
    result = arrayOfNumPage.slice(currentPage - 2, currentPage + 3);
    result.unshift("Previous");
    result.push("Next");
  }

  return result;
}

// Lấy sản phẩm dựa trên trang
function SliceBySort(allProducts, sort, page, productPerPage) {
  let products;
  if (!sort || sort == "default") {
    products = allProducts.slice(
      (page - 1) * productPerPage,
      productPerPage * page
    );
  }
  // Sắp xếp giá tăng dần
  else if (sort == "ascending") {
    products = allProducts
      .sort((a, b) => a.pricing.sale - b.pricing.sale)
      .slice((page - 1) * productPerPage, productPerPage * page);
  }

  // Sắp xếp giá giảm dần
  else {
    products = allProducts
      .sort((a, b) => b.pricing.sale - a.pricing.sale)
      .slice((page - 1) * productPerPage, productPerPage * page);
  }
  return products;
}

router.get("/", async (req, res) => {
  const { category, page, sort } = req.query;
  const productPerPage = 16;

  const allProducts = await Product.find({ category: category });
  const totalPage = Math.ceil(allProducts.length / productPerPage);

  const arrayOfNumPage = pagination(page, totalPage);
  let products = SliceBySort(allProducts, sort, page, productPerPage);

  if (req.isAuthenticated()) {
    res.render("categories", {
      products: products,
      arrayNumPage: arrayOfNumPage,
      currentPage: page,
      email: res.locals.user.email,
      numOfProduct: res.locals.user.cart.length
    });
  } else {
    if (req.session.cart) {
      res.render("categories", {
        products: products,
        arrayNumPage: arrayOfNumPage,
        currentPage: page,
        numOfProduct: req.session.cart.length
      });
    } else {
      res.render("categories", {
        products: products,
        arrayNumPage: arrayOfNumPage,
        currentPage: page,
        numOfProduct: 0
      });
    }
  }
});

module.exports = router;
