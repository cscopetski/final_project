//Encounter generation constants
const encounterTypes = ["shop", "combat", "non-combat"];
const shopFrequency = 3;
const combatFrequency = 0.5;

//Shop generation constants

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
  } else if (Math.random() <= combatFrequency) {
    encounter.type = encounterTypes[1];
    encounter.data.enemies = getEnemies(level);
  } else {
    encounter.type = encounterTypes[2];
    encounter.data.choices = getChoices(level);
  }

  return encounter;
}

function getItems(level) {}

/*
  returns a list of randomly generated enemies with total level equal to
  current player level (up to 4 [maxNumEnemies] enemies)
  Ex. getEnemies(3) -> 
  [
  { name: 'Slime', level: 2, attack: 3, health: 4, gold: 5 },
  { name: 'Slime', level: 1, attack: 2, health: 3, gold: 3 }
  ] 
*/

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
