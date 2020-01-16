const listSorts = document.querySelectorAll(".item_sorting_btn");

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
}

listSorts.forEach(sort => {
  sort.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = updateQueryStringParameter(
      window.location.href,
      "sort",
      sort.getAttribute("data-typesort")
    );
  });
});
