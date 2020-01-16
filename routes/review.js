const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth_middleware");
const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const moment = require("moment");
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
  const { id, page } = req.query;

  let histogram = await Review.aggregate([
    {
      $match: { product: mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  if (histogram == "") {
    const prod = await Product.findById({ _id: mongoose.Types.ObjectId(id) });
    req.flash("fail_msg", "Sản phẩm này chưa có review");
    res.redirect(`/product?slug=${prod.slug}`);
  } else {
    const { average, count } = histogram[0];

    histogram = await Review.aggregate([
      {
        $match: { product: mongoose.Types.ObjectId(id) }
      },
      {
        $group: {
          _id: "$rating",
          countEachRating: { $sum: 1 }
        }
      }
    ]);

    const allReviews = await Review.find({
      product: mongoose.Types.ObjectId(id)
    })
      .populate("user")
      .sort({ date: -1 });

    const reviewPerPage = 8;
    const totalPage = Math.ceil(allReviews.length / reviewPerPage);

    const arrayOfNumPage = pagination(page, totalPage);
    let reviews = SliceBySort(allReviews, "", page, reviewPerPage);

    histogram.sort((a, b) => {
      return b._id - a._id;
    });

    for (let i = 0; i < histogram.length; i++) {
      histogram[i].percent = (histogram[i].countEachRating / count) * 100 + "%";
    }

    let now = Date.now();

    let relative_times = allReviews.map(rv => moment(rv.date).from(now));

    res.render("review", {
      count: count,
      average: average,
      histogram: histogram,
      allReviews: reviews,
      relative_times
    });
  }
});

function check_exist_review(res, productid) {
  let i;

  for (i = 0; i < res.locals.user.reviews.length; i++) {
    if (res.locals.user.reviews[i].product == productid) {
      break;
    }
  }

  if (i == res.locals.user.reviews.length) {
    return false;
  }
  return true;
}

router.post("/", ensureAuthenticated, async (req, res) => {
  const { rating, review, productid, slug } = req.body;

  console.log(slug);
  const test = await Review.find({
    product: mongoose.Types.ObjectId(productid),
    user: mongoose.Types.ObjectId(res.locals.user._id)
  });

  console.log(test == "");

  if (test != "") {
    req.flash("fail_msg", "Bạn đã đánh giá rồi");
    res.redirect(`/review?id=${productid}&page=1`);
  } else {
    const new_review = new Review({
      rating: parseInt(rating),
      review: review,
      date: new Date(),
      user: res.locals.user._id,
      product: productid
    });

    await new_review.save();

    await User.updateOne(
      { _id: res.locals.user._id },
      { $push: { reviews: new_review._id } }
    );

    req.flash("success_msg", "Gửi đánh giá thành công");

    res.redirect(`/review?id=${productid}&page=1`);
  }
  res.end("Dit me may");
});

module.exports = router;
