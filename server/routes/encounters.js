const express = require("express");

const router = express.Router();

/*
  responds with the next randomly generated encounter and increments the player level
  An encounter is one of:

  1. shop (occurs after a set number of levels)
    - data will contains items: a list of shop items
    Ex. encounter = { type: "shop", data: {items: []} }
    
  2. combat (randomly occurs when not a shop level)
    - data will contains enemies: a list of enemies
    Ex. encounter = { type: "combat", data: {enemies: [{ name: 'Slime', level: 1, attack: 2, health: 3, gold: 3 }]} }

  3. non-combat (randomly occurs when not a shop level)
    - data will contain 
    Ex. encounter = { type: "non-combat", data: {choices: []} }
*/
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
      res.sendStatus(404);
    });
});

module.exports = router;
