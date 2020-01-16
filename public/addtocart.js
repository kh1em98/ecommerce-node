const allProduct = document.querySelectorAll(".product_inner");

allProduct.forEach(item => {
  item.querySelector(".product_button a").addEventListener("click", async e => {
    e.preventDefault();
    const slug = item.getAttribute("data-slug");
    await axios({
      method: "post",
      url: "/cart",
      data: {
        slug: slug
      }
    });
  });
});
