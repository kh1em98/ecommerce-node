const allPageLink = document.querySelectorAll(".page-link");

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
}

allPageLink.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    if (link.innerText === "Previous") {
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = parseInt(urlParams.get("page"));
      window.location.href = updateQueryStringParameter(
        window.location.href,
        "page",
        currentPage - 1
      );
    } else if (link.innerText === "Next") {
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = parseInt(urlParams.get("page"));
      window.location.href = updateQueryStringParameter(
        window.location.href,
        "page",
        currentPage + 1
      );
    } else {
      window.location.href = updateQueryStringParameter(
        window.location.href,
        "page",
        parseInt(link.innerText)
      );
    }
  });
});
