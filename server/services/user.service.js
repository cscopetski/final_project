const User = require("../models/user.schema");

function getUser(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
}

async function updateStats(user, stats) {
  const updatedUser = new User(user);

  if (stats.maxHealth) {
    updatedUser.playerStats.maxHealth += stats.maxHealth;
    updatedUser.playerStats.currHealth += stats.maxHealth;
  }

  updatedUser.playerStats.currHealth += stats.currHealth ? stats.currHealth : 0;

  updatedUser.playerStats.currHealth = Math.min(
    updatedUser.playerStats.currHealth,
    updatedUser.playerStats.maxHealth
  );

  updatedUser.playerStats.damage += stats.damage ? stats.damage : 0;

  updatedUser.playerStats.gold += stats.gold ? stats.gold : 0;
  updatedUser.playerStats.gold = Math.max(updatedUser.playerStats.gold, 0);

  return new Promise((resolve, reject) => {
    updatedUser.save((err, res) => {
      err ? reject(err) : resolve(updatedUser.playerStats);
    });
  });
}

module.exports = { getUser, updateStats };
