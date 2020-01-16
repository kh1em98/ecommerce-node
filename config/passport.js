require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async function(email, password, done) {
        const user = await User.findOne({ email: email });
        if (user == null) {
          return done(null, false, { message: "Sai thong tin" });
        }
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Sai thong tin" });
          }
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
