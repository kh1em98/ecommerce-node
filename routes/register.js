const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { forwardAuthenticated } = require("../middleware/auth_middleware");

router.get("/", forwardAuthenticated, (req, res) => {
  res.render("register");
});

router.post("/", forwardAuthenticated, async (req, res) => {
  const { email, password } = req.body;

  if (password.length < 6) {
    req.flash("fail_msg", "Pass quá ngắn");
    res.redirect("/register");
  } else {
    const existUser = await User.find({ email: email });
    if (existUser === []) {
      res.redirect("/register");
    } else {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          const newUser = new User({
            email: email,
            password: hash,
            img:
              "https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/73399761_158694161867280_732253952162136064_n.jpg?_nc_cat=102&_nc_ohc=m9Y_oWOAP00AX8_jpbO&_nc_ht=scontent.fsgn2-2.fna&oh=d0c24bbf521a6741c1d7e5a393c89310&oe=5E982D0E"
          });
          await newUser.save();
          req.flash("success_msg", "Đăng ký thành công! Hãy đăng nhập");
          res.redirect("/login");
        });
      });
    }
  }
});

module.exports = router;
