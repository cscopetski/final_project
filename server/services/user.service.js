const User = require("../models/user.schema");

async function playerDie(user) {
  const updatedUser = new User(user);
  updatedUser.playerStats = {};
  return await updatedUser.save();
}

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

async function setStats(user, stats) {
  const updatedUser = new User(user);

  console.log(stats);

  updatedUser.playerStats.picture = stats.picture
    ? stats.picture
    : updatedUser.playerStats.picture;

  updatedUser.playerStats.name = stats.name ? stats.name : "Gompei";

  updatedUser.playerStats.maxHealth = stats.maxHealth
    ? stats.maxHealth
    : updatedUser.playerStats.currHealth;

  updatedUser.playerStats.currHealth = stats.currHealth
    ? stats.currHealth
    : updatedUser.playerStats.currHealth;

  updatedUser.playerStats.currHealth = Math.max(
    updatedUser.playerStats.currHealth,
    0
  );

  updatedUser.playerStats.damage = stats.damage
    ? stats.damage
    : updatedUser.playerStats.damage;

  updatedUser.playerStats.gold = stats.gold
    ? stats.gold
    : updatedUser.playerStats.gold;
  updatedUser.playerStats.gold = Math.max(updatedUser.playerStats.gold, 0);

  return new Promise((resolve, reject) => {
    updatedUser.save((err, res) => {
      err ? reject(err) : resolve(updatedUser.playerStats);
    });
  });
}

module.exports = { getUser, updateStats, setStats, playerDie };
