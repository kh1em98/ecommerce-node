const btn_increase = document.querySelector(".quantity_inc");
const btn_decrease = document.querySelector(".quantity_dec");

btn_increase.addEventListener("click", e => {
  document.querySelector("#quantity_input").value++;
});

btn_decrease.addEventListener("click", e => {
  if (document.querySelector("#quantity_input").value > 1)
    document.querySelector("#quantity_input").value--;
});

const add_to_cart_btn = document.querySelector(".add-to-cart-btn");

add_to_cart_btn.addEventListener("click", async e => {
  e.preventDefault();
  const slug = add_to_cart_btn.getAttribute("data-slug");
  await axios({
    method: "post",
    url: "/cart",
    data: {
      slug: slug
    }
  });
});
