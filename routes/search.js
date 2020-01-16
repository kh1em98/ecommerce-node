const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

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

function change_alias(alias) {
  // Xoá dấu tiếng việt, chuyển về lowercase
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}

function convert_to_slug(str) {
  // Bỏ khoảng trắng đầu cuối, tách thành mảng
  return change_alias(str)
    .trim()
    .split(" ");
}

async function get_product_search(product) {
  product_search = convert_to_slug(product);

  const allProduct = await Product.find({});

  let searching_products = [];

  for (let i = 0; i < allProduct.length; i++) {
    let is_included = true;
    for (let j = 0; j < product_search.length; j++) {
      if (!allProduct[i].slug.includes(product_search[j])) {
        is_included = false;
        break;
      }
    }
    if (is_included) {
      searching_products.push(allProduct[i]);
    }
  }
  return searching_products;
}

router.get("/", async (req, res) => {
  let { product, page, sort } = req.query;
  const productPerPage = 16;

  const searching_products = await get_product_search(product);

  const totalPage = Math.ceil(searching_products.length / productPerPage);

  const arrayOfNumPage = pagination(page, totalPage);

  const products = SliceBySort(searching_products, sort, page, productPerPage);

  if (req.isAuthenticated()) {
    res.render("search", {
      products: products,
      arrayNumPage: arrayOfNumPage,
      currentPage: page,
      email: res.locals.user.email,
      numOfProduct: res.locals.user.cart.length
    });
  } else {
    if (req.session.cart) {
      res.render("search", {
        products: products,
        arrayNumPage: arrayOfNumPage,
        currentPage: page,
        numOfProduct: req.session.cart.length
      });
    } else {
      res.render("search", {
        products: products,
        arrayNumPage: arrayOfNumPage,
        currentPage: page,
        numOfProduct: 0
      });
    }
  }

  res.end("dit me may");
});

router.post("/", (req, res) => {
  const { search_input } = req.body;

  res.redirect("/search?page=1&product=" + search_input);
});

module.exports = router;
