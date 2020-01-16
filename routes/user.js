const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth_middleware");
const User = require("../models/User");

router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("user", {
    user: res.locals.user
  });
});

router.post("/", ensureAuthenticated, async (req, res) => {
  const { name, phone, address } = req.body;
  const newvalues = { $set: { name: name, phone: phone, address: address } };
  await User.findByIdAndUpdate({ _id: req.session.passport.user }, newvalues);
  req.flash("success_msg", "Cập nhật profile thành công");
  res.redirect("/user");
});

module.exports = router;
