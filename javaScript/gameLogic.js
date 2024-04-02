// Import tower and enemy class
import { Tower } from './tower.js';
import { Enemy } from './enemy.js';

// HTML elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const towerList = document.getElementById('towerList');
const enemyList = document.getElementById('enemyList');
const healthPlayerElement = document.getElementById('health-value');
const goldPlayerElement = document.getElementById('gold-value');
const nextWaveButton = document.getElementById('next-wave-btn');
const startGameButton = document.getElementById('start-game-btn');

const gridSize = 40;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Define path coordinates
const pathCoordinates = [
    [-1, 1], [1, 1], [1, 7], 
    [4, 7], [4, 11], [1, 11], 
    [1, 18], [8, 18], [8, 11], 
    [12, 11], [12, 18], [17, 18], 
    [17, 7], [10, 7], [10, 5],
    [4, 5], [4, 2], [20, 2]
];

// Game running or not
let gameRunning = false;

// Generate all coordinates in between
const allCoordinates = [];

function generateCoordinatesInBetween(coord1, coord2) {
    const [x1, y1] = coord1;
    const [x2, y2] = coord2;
    const coordinates = [];

    // Calculate differences
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Determine the direction of movement (step)
    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

    // Start from the first coordinate
    let x = x1;
    let y = y1;

    // Move towards the second coordinate until reached
    while (x !== x2 || y !== y2) {
        // Add the current coordinate
        coordinates.push([x, y]);

        // Move to the next coordinate
        x += stepX;
        y += stepY;
    }

    // Add the last coordinate (second coordinate)
    coordinates.push([x2, y2]);

    return coordinates;
}

for (let i = 0; i < pathCoordinates.length - 1; i++) {
    const currentCoord = pathCoordinates[i];
    const nextCoord = pathCoordinates[i + 1];
    const coordinatesInBetween = generateCoordinatesInBetween(currentCoord, nextCoord);
    allCoordinates.push(...coordinatesInBetween);
}

// Every tower
const standardTower = new Tower("Archer Tower", 1, 1, 20, 5, 10, "green");
const sniperTower = new Tower("Sniper tower", 5, 5, 30, 7, 15, "red");
const bombTower = new Tower("Bomb Tower", 3, 10, 40, 3, 20, "black");

// Every enemy
const basicEnemy = new Enemy("Basic enemy", 10, 1, 2.5, 1, "green");
const tankyEnemy = new Enemy("Tanky enemy", 100, 10, 1, 5, "blue");
const fastEnemy = new Enemy("Fast enemy", 5, 2, 5, 3, "orange");
const bossEnemy = new Enemy("Boss enemy", 250, 50, 0.5, 90, "yellow");

// All enemies and towers in lists
const allTowers = [standardTower, sniperTower, bombTower];
const allEnemies = [basicEnemy, tankyEnemy, fastEnemy, bossEnemy];

// Waves
const waves = [
    { enemies: [{ type: basicEnemy, count: 5 }], delay: 2000 },
    { enemies: [{ type: tankyEnemy, count: 2 }, { type: basicEnemy, count: 3 }], delay: 2000 },
    { enemies: [{ type: basicEnemy, count: 5 }, { type: fastEnemy, count: 3 }], delay: 2000 },
    { enemies: [{ type: fastEnemy, count: 3 }, { type: tankyEnemy, count: 2 }, { type: fastEnemy, count: 3 }], delay: 2000},
    { enemies: [{ type: basicEnemy, count: 8 }, { type: tankyEnemy, count: 4 }, { type: fastEnemy, count: 2 }], delay: 2000 },
    { enemies: [{ type: fastEnemy, count: 5 }, { type: basicEnemy, count: 7 }, { type: tankyEnemy, count: 3 }], delay: 2000 },
    { enemies: [{ type: tankyEnemy, count: 3 }, { type: basicEnemy, count: 6 }, { type: fastEnemy, count: 4 }], delay: 2000 },
    { enemies: [{ type: fastEnemy, count: 8 }, { type: tankyEnemy, count: 5 }, { type: basicEnemy, count: 9 }], delay: 2000 },
    { enemies: [{ type: basicEnemy, count: 10 }, { type: fastEnemy, count: 6 }, { type: tankyEnemy, count: 4 }], delay: 2000 },
    { enemies: [{ type: tankyEnemy, count: 5 }, { type: basicEnemy, count: 12 }, { type: fastEnemy, count: 8 }], delay: 2000 },
    { enemies: [{ type: tankyEnemy, count: 6 }, { type: fastEnemy, count: 4 }, { type: basicEnemy, count: 10 }], delay: 2000 },
    { enemies: [{ type: basicEnemy, count: 13 }, { type: fastEnemy, count: 7 }, { type: tankyEnemy, count: 5 }], delay: 2000 },
    { enemies: [{ type: fastEnemy, count: 10 }, { type: tankyEnemy, count: 7 }, { type: basicEnemy, count: 15 }], delay: 2000 },
    { enemies: [{ type: basicEnemy, count: 20 }, { type: fastEnemy, count: 10 }, { type: tankyEnemy, count: 8 }], delay: 2000 },
    { enemies: [{ type: tankyEnemy, count: 2 }, { type: bossEnemy, count: 1 }, { type: fastEnemy, count: 7 }], delay: 2000 },
];


let currentWave = 0;

// Player stuff
let playerHP = 100;
let playerGold = 100;

// Selected tower 
let selectedTowerType;
let towerInRange;

// UI stuff
function populateTowerList() {
    allTowers.forEach(tower => {
        const listItem = document.createElement('li');

        const colourBox = document.createElement('div');
        colourBox.className = 'tower-color';
        colourBox.style.backgroundColor = tower.colour;

        const towerText = document.createElement('span');
        let secondsOrSecond;

        if (tower.attackSpeed > 1) {
            secondsOrSecond = 'seconds';
        } else {
            secondsOrSecond = 'second';
        }

        towerText.textContent = `${tower.name} - Cost: ${tower.cost}, Damage: ${tower.damage}, Attack speed: ${tower.attackSpeed} ${secondsOrSecond}`;

        listItem.appendChild(colourBox);
        listItem.appendChild(towerText);

        // Add click event listener to select tower
        listItem.addEventListener('click', () => {
            // Remove selected class from all tower items
            const towerItems = document.querySelectorAll('#towerList li');
            towerItems.forEach(item => {
                item.classList.remove('selected-tower');
            });
            // Add selected class to clicked tower item
            listItem.classList.add('selected-tower');
            selectedTowerType = tower;
            console.log(`Selected tower: ${selectedTowerType.name}`);
        });

        towerList.appendChild(listItem);
    });

    // Select the default tower (basic tower)
    const defaultTowerItem = towerList.firstElementChild;
    defaultTowerItem.classList.add('selected-tower');
    selectedTowerType = allTowers[0]; // Set the default tower type
}

function populateEnemyList() {
    allEnemies.forEach(enemy => {
        const listItem = document.createElement('li');

        const colourBox = document.createElement('div');
        colourBox.className = 'enemy-color';
        colourBox.style.backgroundColor = enemy.colour;

        const enemyText = document.createElement('span');
        enemyText.textContent = `${enemy.name} - HP: ${enemy.health}, Gold: ${enemy.goldAmount}`;

        listItem.appendChild(colourBox);
        listItem.appendChild(enemyText);

        enemyList.appendChild(listItem);
    });
}

function drawGrid() {
    ctx.strokeStyle = '#ccc';

    for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

// Function to draw the path on the canvas
function drawPath() {
    ctx.strokeStyle = 'red'; // Path color
    ctx.lineWidth = 3; // Path line width

    ctx.beginPath();
    ctx.moveTo(pathCoordinates[0][0] * gridSize + gridSize / 2, pathCoordinates[0][1] * gridSize + gridSize / 2);

    for (let i = 1; i < pathCoordinates.length; i++) {
        const x = pathCoordinates[i][0] * gridSize + gridSize / 2;
        const y = pathCoordinates[i][1] * gridSize + gridSize / 2;
        ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// Game logic
let towers = [];
let enemies = [];

function spawnEnemies() {
    const wave = waves[currentWave];
    let delay = 0; // Initialize delay for spawning enemies

    nextWaveButton.disabled = true;

    for (let waveData of wave.enemies) {
        let enemy = waveData.type;
        let count = waveData.count;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                enemies.push(new Enemy(enemy.name, enemy.health, enemy.damage, enemy.speed, enemy.goldAmount, enemy.colour));
            }, delay); // Use the current delay for setTimeout
            delay += wave.delay; // Increment delay for the next enemy in the wave
        }
    }

    const checkCompletion = setInterval(() => {
        if (enemies.length === 0) {
            nextWaveButton.disabled = false;
            clearInterval(checkCompletion);
        }
    }, 1000);

    currentWave++;

    if (currentWave >= waves.length) {
        currentWave = 0;
    }
}

function moveEnemy(enemy, deltaTime) {
    if (enemy.pathIndex < allCoordinates.length - 1) {
        const nextPoint = allCoordinates[enemy.pathIndex + 1];
        const targetX = nextPoint[0] * gridSize + gridSize / 2;
        const targetY = nextPoint[1] * gridSize + gridSize / 2;

        const currentX = enemy.x * gridSize + gridSize / 2;
        const currentY = enemy.y * gridSize + gridSize / 2;

        const dx = targetX - currentX;
        const dy = targetY - currentY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if the enemy is very close to the next point
        const tolerance = enemy.speed * deltaTime * 0.5; // Adjust tolerance as needed
        if (distance <= tolerance) {
            // Snap the enemy to the next point
            enemy.x = nextPoint[0];
            enemy.y = nextPoint[1];
            enemy.pathIndex++;
        } else {
            // Update position based on direction and speed
            const directionX = dx / distance;
            const directionY = dy / distance;

            enemy.x += directionX * enemy.speed * deltaTime;
            enemy.y += directionY * enemy.speed * deltaTime;
        }

        // Check if the enemy has overshot the target point
        const newX = enemy.x * gridSize + gridSize / 2;
        const newY = enemy.y * gridSize + gridSize / 2;
        const newDistance = Math.sqrt((targetX - newX) ** 2 + (targetY - newY) ** 2);
        if (newDistance > distance) {
            // Snap the enemy to the target point to prevent overshooting
            enemy.x = nextPoint[0];
            enemy.y = nextPoint[1];
            enemy.pathIndex++;

        }

        // Check if the enemy has reached the last coordinate
        if (enemy.pathIndex >= allCoordinates.length - 1) {
            // Remove the enemy from the enemies array
            const index = enemies.indexOf(enemy);
            if (index !== -1) {
                enemies.splice(index, 1);
            }
            // Reduce the base health by the enemy's damage
            playerHP -= enemy.damage;
        }
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        const x = enemy.x * gridSize + gridSize / 2;
        const y = enemy.y * gridSize + gridSize / 2;

        ctx.fillStyle = enemy.colour;
        ctx.beginPath();
        ctx.arc(x, y, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Click again to confirm tower placement stuff
let towerPlacementMode = false; // Flag to indicate tower placement mode
let towerPlacementRange = 0; // Range of the tower being placed
let towerPlacementX = 0; // X-coordinate for tower placement
let towerPlacementY = 0; // Y-coordinate for tower placement

// Place towers
function placeTower(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const gridX = Math.floor(mouseX / gridSize);
    const gridY = Math.floor(mouseY / gridSize);

    if (towerPlacementMode && Math.abs(mouseX - towerPlacementX) < gridSize / 2 && Math.abs(mouseY - towerPlacementY) < gridSize / 2) {
        const isValidLocation = isValidTowerLocation(gridX, gridY);

        const hasEnoughGold = playerGold >= selectedTowerType.cost;
        
        try {
            if (!isValidLocation) {
                throw new Error('Not a valid location!');
            }

            if (!hasEnoughGold) {
                throw new Error('Not enough gold!');
            }

            playerGold -= selectedTowerType.cost;

            let newTower = new Tower(selectedTowerType.name, selectedTowerType.attackSpeed, selectedTowerType.damage, selectedTowerType.cost, selectedTowerType.range, selectedTowerType.sellValue, selectedTowerType.colour);
            newTower.placeTower(gridX, gridY);

            towers.push(newTower);

            goldPlayerElement.textContent = playerGold;

            console.log(`${selectedTowerType.name} placed at (${gridX}, ${gridY})`);
            towerPlacementMode = false;
            clearTowerRange();
            showMessage("");
        } catch (error) {
            showMessage(error.message);
        }
    } else {
        // Pass the tower object corresponding to the clicked tile
        const clickedTower = towers.find(tower => tower.x === gridX && tower.y === gridY);
        if (clickedTower) {
            towerInRange = clickedTower;
            towerPlacementMode = false; // Ensure towerPlacementMode remains false
        } else {
            towerInRange = false
            towerPlacementMode = true;
        }
        
        showTowerRange(selectedTowerType, mouseX, mouseY);
    }
}

function isValidTowerLocation(x, y) {
    if (x < 0 || x >= 20 || y < 0 || y >= 20) {
        return false;
    }

    if (checkPathCoordinates(x, y)) {
        return false;
    }

    if (towers.find(tower => tower.x === x && tower.y === y)) {
        return false;
    }

    selectedTowerType.placeTower(x, y);
    return true;
}

function checkPathCoordinates(x, y) {
    for (let coord of allCoordinates) {
        if(coord[0] === x && coord[1] === y) {
            return true;
        }
    }

    return false;
}

let activeTowerRanges = [];

// Function to show tower range
function showTowerRange(tower, x, y) {
    const towerRange = {
        x: x,
        y: y,
        range: tower.range * gridSize,
    }

    activeTowerRanges.push(towerRange);

    // Store tower range and position
    towerPlacementRange = tower.range * gridSize;
    towerPlacementX = x; // Example: Set tower position to center of canvas
    towerPlacementY = y; // Example: Set tower position to center of canvas

    // Draw tower range circle
    ctx.beginPath();
    //ctx.arc(towerPlacementX, towerPlacementY, towerPlacementRange, 0, 2 * Math.PI);
    ctx.arc(x, y, towerRange.range, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to clear tower range
function clearTowerRange() {
    activeTowerRanges.forEach(towerRange => {
        ctx.clearRect(towerRange.x - towerRange.range, towerRange.y - towerRange.range, towerRange.range * 2, towerRange.range * 2);
    });
}

// Function to handle clicks outside of the canvas
function handleOutsideClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the click is outside of the canvas
    if (mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > canvasHeight) {
        // If tower placement mode is active, deactivate it and clear tower range
        if (towerPlacementMode) {
            towerPlacementMode = false;
            clearTowerRange();
        } else if (towerInRange) {
            clearTowerRange();
        }
    }
}

function drawTowers() {
    towers.forEach(tower => {
        const x = tower.x * gridSize + gridSize / 2;
        const y = tower.y * gridSize + gridSize / 2;

        ctx.fillStyle = tower.colour;
        ctx.beginPath();
        ctx.arc(x, y, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Function to draw all game elements on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
    drawGrid(); // Draw grid lines
    drawPath(); // Draw path
    drawTowers(); // Draw towers
    drawEnemies(); // Draw enemies

    if (towerPlacementMode) {
        showTowerRange(selectedTowerType, towerPlacementX, towerPlacementY); // Draw tower range if in tower placement mode
    } else if (towerInRange) {
        showTowerRange(towerInRange, towerInRange.x * gridSize + gridSize / 2, towerInRange.y * gridSize + gridSize / 2); // Draw tower range if tower is in range
    }
}

function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
}

let lastTimestamp = performance.now();

function updateEnemyLocation() {
    const currentTimestamp = performance.now();
    const deltaTime = (currentTimestamp - lastTimestamp) / 1000;
    lastTimestamp = currentTimestamp;

    for (let enemy of enemies) {
        moveEnemy(enemy, deltaTime);
    }
}

// Function to handle tower attacks
function handleTowerAttacks() {
    towers.forEach(tower => {
        // Find enemies within the tower's range
        const enemiesInRange = enemies.filter(enemy => {
            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= tower.range;
        });

        // If there are enemies in range, initiate attacks
        if (enemiesInRange.length > 0 && !tower.cooldown) {
            initiateAttack(tower, enemiesInRange[0]); // For simplicity, attack the first enemy in range

            tower.cooldown = true; // Set tower on cooldown
            setTimeout(() => {
                tower.cooldown = false; // Reset tower cooldown after attackSpeed duration
            }, tower.attackSpeed * 1000); // Set the cooldown duration to tower's attack speed
        }
    });
}

// Function to initiate an attack from a tower to an enemy
function initiateAttack(tower, enemy) {
    // Change tower color temporarily to indicate attack
    const originalEnemyColour = enemy.colour;
    const originalTowerColour = tower.colour;
    tower.colour = lightenColor(originalTowerColour);

    enemy.health -= tower.damage;
    console.log(`${tower.name} shot at ${enemy.name}`);

    if (enemy.health <= 0) {
        const index = enemies.indexOf(enemy);
        if (index !== -1) {
            enemies.splice(index, 1);
            
            playerGold += enemy.goldAmount;
            console.log(`${tower.name} killed ${enemy.name}`);
        }
    } else {
        // Change enemy colour
        enemy.colour = '#8B0000';
    }

    // Set tower cooldown
    setTimeout(() => {
        tower.colour = originalTowerColour; // Revert tower color back to original after a delay
    }, (tower.attackSpeed - 1) * 1000); // Adjust duration as needed

    // Change enemy colour back to original colour
    setTimeout(() => {
        enemy.colour = originalEnemyColour;
    }, 250);
}

// Function to lighten a color (convert to a lighter shade)
function lightenColor(color) {
    // Convert hex to RGB
    const rgb = hexToRgb(color);

    // Lighten RGB values
    const newRgb = {
        r: Math.min(rgb.r + 50, 255), // Increase red component (adjust as needed)
        g: Math.min(rgb.g + 50, 255), // Increase green component (adjust as needed)
        b: Math.min(rgb.b + 50, 255)  // Increase blue component (adjust as needed)
    };
    // Convert RGB back to hex
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Function to convert hex color to RGB object
function hexToRgb(hex) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    // Check if it's a shorthand or long-form hexadecimal color
    if (hex.length === 3) {
        // Convert shorthand to long-form (e.g., #abc to #aabbcc)
        hex = hex.replace(/(.)/g, '$1$1');
    }

    // Parse the hexadecimal color
    const bigint = parseInt(hex, 16);

    // Extract RGB components
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Return RGB object
    return { r, g, b };
}

// Function to convert RGB values to hex color
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function checkPlayerHP() {
    if (playerHP <= 0) {
        stopGame();
    }
}

function stopGame() {
    gameRunning = false;

    // Create a black overlay div
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Create a div to display the score
    const scoreDisplay = document.createElement('div');
    scoreDisplay.textContent = `Score: ${currentWave * 100}`; // Assuming playerGold holds the score
    scoreDisplay.classList.add('score-display');

    // Create the "Try again?" button
    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try again?';
    tryAgainButton.classList.add('try-again-button');
    tryAgainButton.addEventListener('click', () => {
        // Reload the page to restart the game
        window.location.reload();
    });

    // Append the button to the overlay
    overlay.appendChild(scoreDisplay);
    overlay.appendChild(tryAgainButton);

    // Append the overlay to the body
    document.body.appendChild(overlay);
}

// Game loop so it keeps running
function gameLoop() {
    if (!gameRunning) {
        return;
    }

    handleTowerAttacks();

    updateEnemyLocation();

    drawEnemies();
    drawGame();
    updateUI();
    checkPlayerHP();

    requestAnimationFrame(gameLoop);
}

function updateUI() {
    healthPlayerElement.innerHTML = playerHP;
    goldPlayerElement.innerHTML = playerGold;
}

// Start game
function startGame() {
    populateTowerList();
    populateEnemyList();

    gameLoop();
}

function startGameClicked() {
    const startGameContainer = document.getElementById('start-game-container');
    startGameContainer.style.display = 'none';

    const gameContainer = document.getElementById('entire-game-container');
    gameContainer.style.display = 'block';

    gameRunning = true;
    if (gameRunning) {
        canvas.addEventListener('click', placeTower);

        window.addEventListener('click', handleOutsideClick);

        nextWaveButton.addEventListener('click', spawnEnemies);

        startGame();
    }
}

startGameButton.addEventListener('click', startGameClicked);