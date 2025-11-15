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


router.get("/signin", (req, res) => {
  res.render("auth/signin"); 
});

router.post("/signin", (req, res, next) => {

  passport.authenticate("local.signin", { 
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/signin",
    failureFlash: true,
  })(req, res, next); 

  });


router.get("/profile", (req, res) => {
  res.send("that is his profile");
});

module.exports = router;
