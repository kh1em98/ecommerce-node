module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash("fail_msg", "You need to login to view resource");
      res.redirect("/login");
    }
  },

  forwardAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      next();
    }
  }
};
