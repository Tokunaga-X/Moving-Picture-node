const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
// Load User model
const User = require("../modules/User");
const { forwardAuthenticated } = require("../config/auth");

router.use(express.static(path.join(__dirname, "..", "public")));

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/owner",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// const newUser = new User({
//   email: "officialxyc@gmail.com",
//   password: "tokunaga24253"
// });
// // Hash Password
// bcrypt.genSalt(10, (err, salt) =>
//   bcrypt.hash(newUser.password, salt, (err, hash) => {
//     if (err) throw err;
//     newUser.password = hash;

//     newUser
//       .save()
//       .then(user => {
//         console.log("!");
//       })
//       .catch(err => console.log(err));
//   })
// );

module.exports = router;
