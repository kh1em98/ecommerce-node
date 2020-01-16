const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../middleware/auth_middleware");

router.get("/", forwardAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/",
  forwardAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

module.exports = router;
