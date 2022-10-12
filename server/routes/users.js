const express = require("express");
const User = require("../models/user.schema");
const { loginUser } = require("../services/login.service");
const {
  getUser,
  updateStats,
  setStats,
  playerDie,
} = require("../services/user.service");

const router = express.Router();

router.get("/stats", (req, res) => {
  getUser(req.session.email)
    .then((user) => {
      res.json(user.playerStats);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

router.get("/die", (req, res) => {
  getUser(req.session.email)
    .then((user) => {
      playerDie(user).then(() => {
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

/*
  Updates user's player stats and returns the updated stats

  body options:

  damage,
  maxHealth,
  currHealth,
  gold,

  Example request body:
  "Player took 3 damage and spent 10 gold"
  body = {currHealth: -3, gold: -10}

  "Player healed 3 damage and gained 10 maxHealth"
  body = {currHealth: 3, maxHealth: 10}
*/
router.post("/update-stats", (req, res) => {
  getUser(req.session.email)
    .then((user) => {
      updateStats(user, req.body).then((data) => {
        res.json(data);
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

router.post("/set-stats", (req, res) => {
  getUser(req.session.email)
    .then((user) => {
      console.log(req.body);
      setStats(user, req.body).then((data) => {
        res.json(data);
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
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
      res.sendStatus(401);
    });
});

router.post("/logout", async (req, res) => {
  req.session.destroy();

  res.redirect("/");
});

module.exports = router;
