const encounterTypes = ["shop", "combat", "non-combat"];

const req_headers = new Headers();
req_headers.append("Content-Type", "application/json");

window.onload = function () {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.onclick = logout;

  const playerAvatar = document.getElementById("displayedImg");
  const playerName = document.getElementById("player-name");

  getPlayerStats()
    .then((stats) => {
      playerName.innerHTML = stats.name;
      console.log(stats.picture);
      switch (stats.picture) {
        case 0:
          playerAvatar.src = "/public/images/hammer_guy.png";
          break;
        case 1:
          playerAvatar.src = "/public/images/knight.png";
          break;
        case 2:
          playerAvatar.src = "/public/images/sorceress.png";
          break;
        default:
          playerAvatar.src = "/public/images/hammer_guy.png";
          break;
      }
      getNextEncounter();
    })
    .catch((err) => {
      console.log(err);
    });
};

function updateHealth(element, curr, max) {
  const div = document.createElement("div");
  const bar = document.getElementById("health-bar");
  bar.value = curr;
  bar.max = max;
  div.innerText = "Health: " + curr + "/" + max;
  element.append(div);
}

function updateGold(
  element = document.querySelector("#stats-container"),
  value
) {
  const div = document.createElement("div");
  div.innerText = "Gold: " + value;
  element.append(div);
}

function updateDamage(
  element = document.querySelector("#stats-container"),
  value
) {
  const div = document.createElement("div");
  div.innerText = "Damage: " + value;
  element.append(div);
}

function updateStats(stats) {
  const statsContainer = document.querySelector("#stats-container");
  removeAllChildNodes(statsContainer);
  updateHealth(statsContainer, stats.currHealth, stats.maxHealth);
  updateDamage(statsContainer, stats.damage);
  updateGold(statsContainer, stats.gold);
}

const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

async function getNextEncounter() {
  const encounter = await fetch("/encounters/get-next", {
    method: "GET",
    headers: req_headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  getPlayerStats().then((stats) => {
    updateStats(stats);
    setEncounterText("");
    const buttonContainer = document.querySelector("#button-container");
    removeAllChildNodes(buttonContainer);
    let newStats = undefined;

    switch (encounter.type) {
      case encounterTypes[0]:
        printToScreen("Shop Encounter");
        break;
      case encounterTypes[1]:
        printToScreen("Combat Encounter");
        newStats = startCombat(stats, encounter.data.enemies);
        break;
      case encounterTypes[2]:
        printToScreen("Non-Combat Encounter");
        break;
      default:
        console.log("Error getting encounter type");
        break;
    }

    if (newStats) {
      setPlayerStats(newStats);
      updateStats(newStats);
    }
  });
}

function restart() {
  playerDie().then(() => {
    document.location.href = "/select";
  });
}

async function getPlayerStats() {
  return await fetch("/users/stats", {
    method: "GET",
    headers: req_headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
}

async function setPlayerStats(stats) {
  return await fetch("/users/set-stats", {
    method: "POST",
    body: JSON.stringify(stats),
    headers: req_headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
}

async function playerDie() {
  return await fetch("/users/die", {
    method: "GET",
    headers: req_headers,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
}

function startCombat(playerStats, enemies) {
  printToScreen("You have been ambushed by " + enemies.length + " enemies");
  setEncounterText("Choose an enemy to attack: ");
  const buttonContainer = document.querySelector("#button-container");
  let count = 1;

  function enemiesAttack() {
    return enemies.every((enemy) => {
      if (playerStats.currHealth > 0) {
        printToScreen(
          enemy.name + " attacked you for " + enemy.attack + " damage"
        );
        playerStats.currHealth -= enemy.attack;
        printToScreen("You have " + playerStats.currHealth + " health left");
        if (playerStats.currHealth > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  }

  function combatWin() {
    printToScreen("You have defeated all the enemies!");
    removeAllChildNodes(buttonContainer);
    const btn = document.createElement("button");
    btn.textContent = "Next Encounter";
    setEncounterText("All enemies defeated, you may continue on your journey");
    setPlayerStats(playerStats).then(() => {
      btn.onclick = function () {
        getNextEncounter();
      };
      buttonContainer.append(btn);
    });
  }

  function combatLose() {
    printToScreen("You have died!");
    removeAllChildNodes(buttonContainer);
    const btn = document.createElement("button");
    setEncounterText("GAME OVER...");
    btn.textContent = "Restart";
    btn.onclick = function () {
      restart();
    };
    buttonContainer.append(btn);
  }

  enemies.forEach((enemy) => {
    printToScreen(
      enemy.name + ":\nHealth: " + enemy.health + "\nAttack: " + enemy.attack
    );
    const intialHP = enemy.health;
    enemy.id = count;

    const btn = document.createElement("button");
    btn.id = count;

    btn.textContent =
      enemy.name +
      " HP:" +
      enemy.health +
      "/" +
      intialHP +
      " AD:" +
      enemy.attack;

    count++;

    btn.onclick = function () {
      function killEnemy() {
        const index = enemies.indexOf(enemy);
        if (index > -1) {
          enemies.splice(index, 1);
        }
        printToScreen(
          "You have slain the " + enemy.name + "!\nGain " + enemy.gold + " gold"
        );
        playerStats.gold += enemy.gold;
        btn.disabled = true;
      }

      function playerAttack() {
        printToScreen(
          "Attacked " + enemy.name + " for " + playerStats.damage + " damage"
        );
        enemy.health -= playerStats.damage;
        printToScreen(enemy.name + " has " + enemy.health + " health left");
        if (enemy.health > 0) {
        } else {
          killEnemy();
        }
      }

      if (playerStats.currHealth > 0) {
        playerAttack();

        if (enemies.length > 0) {
          if (enemiesAttack() === false) {
            combatLose();
          }
        } else {
          combatWin();
        }
      } else {
        combatLose();
      }
      btn.textContent =
        enemy.name +
        " HP:" +
        enemy.health +
        "/" +
        intialHP +
        " AD:" +
        enemy.attack;
      updateStats(playerStats);
    };
    buttonContainer.append(btn);
  });
}

function printToScreen(msg) {
  const screen = document.querySelector("#game-text-container");
  const paragraph = document.createElement("p");
  paragraph.textContent = msg;
  screen.append(paragraph);
  screen.scrollTop = screen.scrollHeight;
}

function setEncounterText(msg) {
  const screen = document.querySelector("#encounter-title-container");
  screen.textContent = msg;
}

async function logout() {
  document.location.href = "/logout";
}
