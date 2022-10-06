const express = require("express");

const router = express.Router();

router.get("/get-next", (req, res) => {
  getUser(req.session.email)
    .then((user) => {
      user
        .set("playerStats.currLevel", user.playerStats.currLevel + 1)
        .save()
        .then((userData) => {
          const level = userData.playerStats.currLevel;
          res.json(getEncounter(level));
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = router;
