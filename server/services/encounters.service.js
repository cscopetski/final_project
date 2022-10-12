//Encounter generation constants
const encounterTypes = ["shop", "combat", "non-combat"];
const shopFrequency = 2;
const combatFrequency = 0.5;

//Shop generation constants
const shopAttackModifer = 5;
const shopHealthModifier = 7;
const shopCurrHealthModifier = 10;
const shopGoldModifer = 1.07;
//Enemy generation constants
const enemyNames = ["Goblin", "Slime", "Orc", "Skeleton"];
const enemyAttackModifer = 2;
const enemyHealthModifier = 3;
const enemyGoldModifer = 3;
const maxEnemyLevel = 4;
const minEnemyLevel = 1;
const maxNumEnemies = 4;

//Choice generation constants

function getEncounter(level) {
  const encounter = { type: "", data: {} };

  if (level % shopFrequency === 0) {
    encounter.type = encounterTypes[0];
    encounter.data.items = getItems(level);
  } else {
    encounter.type = encounterTypes[1];
    encounter.data.enemies = getEnemies(level);
  }

  return encounter;
}

function getItems(level) {
  const items = [];

  const maxAttack = enemyAttackModifer * level;
  const minAttack = enemyAttackModifer;

  const maxHealth = enemyHealthModifier * level;
  const minHealth = enemyHealthModifier;

  const maxGold = enemyGoldModifer * 0.5 * level;
  const minGold = enemyGoldModifer;

  const dmg = {
    name: "DamageUp",
    stat: Math.floor(Math.random() * (maxAttack + 1 - minAttack) + minAttack),
    cost: Math.floor(Math.random() * (maxGold + 1 - minGold) + minGold),
  };

  const health = {
    name: "HealthUp",
    stat: Math.floor(Math.random() * (maxHealth + 1 - minHealth) + minHealth),
    cost: Math.floor(Math.random() * (maxGold + 1 - minGold) + minGold),
  };

  const heal = {
    name: "Potion",
    stat: Math.floor(
      Math.random() * (maxHealth * 2 + 1 - minHealth * 2) + minHealth * 2
    ),
    cost: Math.floor(
      Math.random() * (Math.floor(maxGold / 2) + 1 - minGold) + minGold
    ),
  };

  items.push(dmg);
  items.push(health);
  items.push(heal);

  return items;
}

function getEnemies(level) {
  const enemies = [];

  while (level > 0) {
    let enemy = createEnemy(level);

    enemies.push(enemy);

    if (enemies.length >= maxNumEnemies) {
      return enemies;
    }

    level -= enemy.level;
  }

  return enemies;
}

function createEnemy(level) {
  //Generate random enemy name
  const enemyName = enemyNames[Math.floor(Math.random() * enemyNames.length)];

  //Generate random enemy level
  const maxLevel = Math.min(level, maxEnemyLevel);
  const minLevel = minEnemyLevel;
  const enemyLevel = Math.floor(
    Math.random() * (maxLevel + 1 - minLevel) + minLevel
  );

  //Generate random enemy attack
  const maxAttack = enemyAttackModifer * enemyLevel;
  const minAttack = enemyAttackModifer;
  const enemyAttack = Math.floor(
    Math.random() * (maxAttack + 1 - minAttack) + minAttack
  );

  //Generate random enemy health
  const maxHealth = enemyHealthModifier * enemyLevel;
  const minHealth = enemyHealthModifier;
  const enemyHealth = Math.floor(
    Math.random() * (maxHealth + 1 - minHealth) + minHealth
  );

  //Generate random enemy gold
  const maxGold = enemyGoldModifer * enemyLevel;
  const minGold = enemyGoldModifer;
  const enemyGold = Math.floor(
    Math.random() * (maxGold + 1 - minGold) + minGold
  );

  return {
    name: enemyName,
    level: enemyLevel,
    attack: enemyAttack,
    health: enemyHealth,
    gold: enemyGold,
  };
}

function getChoices(level) {}

module.exports = { getEncounter, getEnemies };
