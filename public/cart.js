let divsproductPrice = document.querySelectorAll(".product_price");
let divsproductNum = document.querySelectorAll(".product_num");

let productPrice = [];
let productNum = [];

// Tạo mảng gồm giá tiền từng thành phần, phục vụ tính tổng
divsproductPrice.forEach(price => {
  const fixLoiResponsive = price.innerText.split(" ");
  if (fixLoiResponsive.length === 1) {
    price = parseInt(price.innerText.replace(/[.đ]/g, ""));
  } else {
    price = fixLoiResponsive[1].replace(/[.đ]/g, "");
  }
  productPrice.push(price);
});

// Tạo mảng gồm số lượng từng sản phẩm, phục vụ tính tổng
divsproductNum.forEach(num => {
  num = parseInt(num.innerText);
  productNum.push(num);
});

// Hàm chuyển định dạng tiền sang VNĐ
function convertToVND(str) {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

// Cập nhật bảng thanh toán gồm phí ship, tạm tính và tổng tiền
function updateTotal(feeShip) {
  let sum = 0;
  for (let i = 0; i < productNum.length; i++) {
    sum += productNum[i] * productPrice[i];
  }

  productNum.forEach((num, index) => {});

  const loaiShip = document
    .querySelector(".shipping_radio:checked")
    .getAttribute("id");

  document.querySelector(".subtotal").innerText = convertToVND(sum);
  document.querySelector(".total").innerText = sum;

  if (loaiShip === "radio_3") {
    document.querySelector(".total").innerText = convertToVND(sum);
    document.querySelector("#total_price_thanh_toan").value = convertToVND(sum);
    document.querySelector("#tong-tien-thanh-toan").innerText = convertToVND(
      sum
    );
    document.querySelector(".fee_ship").innerText = "Free";
  } else if (loaiShip === "radio_2") {
    sum += 10000;
    document.querySelector(".total").innerText = convertToVND(sum);
    document.querySelector("#total_price_thanh_toan").value = convertToVND(sum);
    document.querySelector("#tong-tien-thanh-toan").innerText = convertToVND(
      sum
    );
    document.querySelector(".fee_ship").innerText = "10.000đ";
  } else {
    sum += 30000;
    document.querySelector(".total").innerText = convertToVND(sum);
    document.querySelector("#total_price_thanh_toan").value = convertToVND(sum);
    document.querySelector("#tong-tien-thanh-toan").innerText = convertToVND(
      sum
    );
    document.querySelector(".fee_ship").innerText = "30.000đ";
  }
}

updateTotal();
// Cap nhat quantity

const productQuantityContainer = document.querySelectorAll(".product_quantity");

// Xu ly khi them, bot

productQuantityContainer.forEach(item => {
  item.querySelector(".qty_add").addEventListener("click", () => {
    const index = item.getAttribute("data-index");
    productNum[index] = parseInt(
      parseInt(item.querySelector(".product_num").innerText) + 1
    );
    updateTotal();
  });

  item.querySelector(".qty_sub").addEventListener("click", () => {
    const index = item.getAttribute("data-index");
    productNum[index] = parseInt(
      parseInt(item.querySelector(".product_num").innerText) - 1
    );
    updateTotal();
  });
});

// Mỗi khi chọn phí ship -> cập nhật tổng giá

const shipRadios = document.querySelectorAll(".shipping_radio");
shipRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    updateTotal();
  });
});

// Chức năng Clear Cart
document.querySelector(".button_clear").addEventListener("click", async e => {
  e.preventDefault();
  const itemList = document.querySelector(".cart_items_list");
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  await axios({
    method: "post",
    url: "/cart/clear"
  });

  // Xoá hết các thành phần trong mảng giá, cập nhật lại bảng thanh toán
  productNum = [];
  productPrice = [];
  updateTotal();
});

// Đơn hàng
