const express = require("express");
const User = require("../models/user.schema");
const { loginUser, getUser } = require("../services/login.service");

const router = express.Router();

router.get("/stats", (req, res) => {
  getUser(req.session.email)
    .then((user) => {
      res.json(user.playerStats);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/login", async (req, res) => {
  loginUser(req.body)
    .then((data, err) => {
      req.session.email = data.email;
      res.status(200);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
});

router.post("/logout", async (req, res) => {
  req.session.destroy();

  res.redirect("/");
});

module.exports = router;
