const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const SessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});
const flash = require("connect-flash");
const passport = require("passport");

const User = require("./models/User");

// Su dung bien moi truong

require("dotenv").config();

// Bao mat
app.use(helmet());
app.use(cors());

app.use(cookieParser());

mongoose.connect(
  process.env.Mongo_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  err => {}
);

// Set view
app.set("view engine", "ejs");
app.set("views", "./views");

// Config
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Cấu hình session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: SessionStore,
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.fail_msg = req.flash("fail_msg");
  res.locals.error = req.flash("error");
  next();
});

// Nếu user đã đăng nhập, lưu tạm vào res.locals

app.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await User.findById({
      _id: req.session.passport.user
    }).populate("cart");
    res.locals.user = user;
  } else {
    if (!req.session.cart) {
      req.session.cart = [];
    }
  }
  next();
});

// Route
app.use("/order", require("./routes/order"));
app.use("/", require("./routes/home"));
app.use("/category", require("./routes/category"));
app.use("/cart", require("./routes/cart"));
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/logout", require("./routes/logout"));
app.use("/user", require("./routes/user"));
app.use("/checkout", require("./routes/checkout"));
app.use("/about", (req, res) => {
  res.render("about");
});

app.use("/product", require("./routes/product"));

app.use("/listorders", require("./routes/listorders"));
app.use("/search", require("./routes/search"));
app.use("/review", require("./routes/review"));

// Handle error

/* app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status(400);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("notfound");
}); */

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {});
