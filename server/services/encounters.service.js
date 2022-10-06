const encounterTypes = ["shop", "combat", "non-combat"];

const shopFrequency = 3;
const combatFrequency = 0.5;

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

function getEnemies(level) {}

function getChoices(level) {}

module.exports = { getEncounter };
