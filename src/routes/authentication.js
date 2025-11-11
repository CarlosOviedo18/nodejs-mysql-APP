const express = require("express");
const router = express.Router();

const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  passport.authenticate("local.signup", {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/signup",
    failureFlash: true,
  })(req, res);
});

router.get("/profile", (req, res) => {
  res.send("that is his profile");
});

module.exports = router;
