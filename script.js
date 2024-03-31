// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Define the dimensions of the grid
const rows = 20;
const columns = 20;

// Define initial values for resources and health points
let resources = 100; // Initial amount of gold
let healthPoints = 100; // Initial health points

// Calculate the size of each cell
const cellWidth = canvas.width / columns;
const cellHeight = canvas.height / rows;

// Define the path points (coordinates)
const pathPoints = [
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 5 },
    { x: 5, y: 5 },
    { x: 5, y: 10 },
    { x: 15, y: 10 },
    { x: 15, y: 15 },
    { x: 20, y: 15 }
];

// Define arrays for grass, sand, and water areas
const grassArea = [];
const sandArea = [];
const waterArea = [];

// Define tower types
const towerTypes = {
    basic: {
        name: 'Basic Tower',
        range: 3, // Range of attack (number of tiles)
        damage: 1,
        cost: 10
    },
    sniper: {
        name: 'Sniper Tower',
        range: 5,
        damage: 3,
        cost: 20
    },
    cannon: {
        name: 'Cannon Tower',
        range: 2,
        damage: 5,
        cost: 30
    }
};

// Define colors for each tower type
const towerColors = {
    basic: '#FF0000',   // Red for basic tower
    sniper: '#00FF00',  // Green for sniper tower
    cannon: '#0000FF'   // Blue for cannon tower
};

// Array to store placed towers and enemies
const towers = [];
const enemies = [];

// Variable to track the state of tower placement
let towerPlacementState = {
    isPlacingTower: false,
    towerType: null,
    x: null,
    y: null
};

// Define enemy types
const enemyTypes = {
    standard: {
        name: 'Standard Enemy',
        health: 50,
        speed: 1,
        damage: 1,
        pathIndex: 0,
        goldReward: 5, // Gold reward for defeating a standard enemy
        colorId: 'standard' // Used to define colours
        // Add more attributes as needed
    },
    tanky: {
        name: 'Tanky Enemy',
        health: 200,
        speed: 0.5,
        damage: 2,
        pathIndex: 0,
        goldReward: 10, // Gold reward for defeating a tanky enemy
        colorId: 'tanky' // Used to define colours
        // Add more attributes as needed
    },
    fast: {
        name: 'Fast Enemy',
        health: 50,
        speed: 2,
        damage: 1,
        pathIndex: 0,
        goldReward: 1, // Gold reward for defeating a fast enemy
        colorId: 'fast' // Used to define colours
        // Add more attributes as needed
    }
};

// Define waves of enemies
const waves = [
    // Wave 1
    [
        { type: 'standard', quantity: 5 },
    ],
    // Wave 2
    [
        { type: 'standard', quantity: 5 },
        { type: 'tanky', quantity: 2 }
    ],
    // Wave 3
    [
        { type: 'fast', quantity: 10 }
    ],
    // Add more waves as needed
];

// Define a variable to track the current wave
let currentWaveIndex = 0;
// Define a variable to track whether the current wave is active (i.e., enemies are still alive)
let isWaveActive = false;
// Define a variable to store the timeout ID for starting the next wave
let nextWaveTimeoutId;

// Define colors for each enemy type
const enemyColors = {
    standard: 'red',
    tanky: 'blue',
    fast: 'green'
    // Add more enemy types and colors as needed
};

// Function to spawn enemies from a wave
function spawnEnemiesFromWave() {
    const currentWave = waves[currentWaveIndex];

    // Loop through the wave definition
    currentWave.forEach(enemyInfo => {
        const enemyType = enemyInfo.type;
        const enemyQuantity = enemyInfo.quantity;

        // Spawn the specified quantity of enemies of the given type
        for (let i = 0; i < enemyQuantity; i++) {
            // Spawn an enemy of the specified type
            spawnEnemy(enemyType);
            enemies.push(enemyInfo);
        }
    });
}

// Function to spawn a single enemy of a specified type at the given coordinates
function spawnEnemy(enemyType, x, y) {
    // Use enemyType to determine the color of the enemy
    const enemyColor = enemyColors[enemyType];

    // Specify the position and size of the circle
    const radius = 10; // Adjust the radius as needed

    // Draw a circle representing the enemy on the canvas
    ctx.beginPath();
    ctx.fillStyle = enemyColor;
    ctx.arc(x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw a black border around the enemy
    ctx.strokeStyle = '#000000'; // Black color for border
    ctx.lineWidth = 2; // Adjust the width of the border
    ctx.stroke();
}

// Function to move enemies along the path
function moveEnemies() {
    // Iterate through all enemies
    enemies.forEach(enemy => {
        // Check if the enemy has reached the end of the path
        if (enemy.pathIndex < pathPoints.length - 1) {
            // Get the current and next path points
            const currentPoint = pathPoints[enemy.pathIndex];
            const nextPoint = pathPoints[enemy.pathIndex + 1];
            
            // Calculate the distance to the next point
            const distanceX = nextPoint.x - currentPoint.x;
            const distanceY = nextPoint.y - currentPoint.y;
            
            // Calculate the angle towards the next point
            const angle = Math.atan2(distanceY, distanceX);
            
            // Calculate the movement in x and y directions based on speed
            const speed = enemyTypes[enemy.type].speed;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            
            // Move the enemy
            enemy.x += dx;
            enemy.y += dy;
            
            // Check if the enemy has reached the next point
            if (Math.abs(enemy.x - nextPoint.x) < 0.1 && Math.abs(enemy.y - nextPoint.y) < 0.1) {
                // Increment the path index to move to the next point
                enemy.pathIndex++;
            }
        } else {
            // The enemy has reached the end of the path
            // Handle end of path logic (e.g., remove enemy, decrease player health)
            console.log('Enemy reached end of path!');
            // For now, let's just remove the enemy
            healthPoints -= enemy.damage;
            removeEnemy(enemy);
        }
    });
}

// Function to start the next wave
function startNextWave() {
    if (currentWaveIndex < waves.length) {
        // Spawn enemies from the next wave
        spawnEnemiesFromWave(waves[currentWaveIndex]);
        // Increment the current wave index
        currentWaveIndex++;
        // Set the wave as active
        isWaveActive = true;
    }
}

// Function to check if all enemies from the current wave are defeated
function checkWaveCompletion() {
    if (!isWaveActive && currentWaveIndex > 0 && currentWaveIndex < waves.length) {
        // If the previous wave is completed and there are more waves to come
        // Start the next wave after a delay (e.g., 10 seconds)
        nextWaveTimeoutId = setTimeout(startNextWave, 10000); // 10 seconds delay
    }
}

// Function to handle enemy defeat
function handleEnemyDefeat() {
    // Check if all enemies from the current wave are defeated
    checkWaveCompletion();
    // Update UI or perform other actions as needed
    updateEntireUI();
}

// Function to remove an enemy
function removeEnemy(enemy) {
    const index = enemies.indexOf(enemy);
    if (index !== -1) {
        enemies.splice(index, 1); // Remove the enemy from the enemies array
    }
}

// Function to simulate enemy defeat (for demonstration)
function simulateEnemyDefeat() {
    // Simulate enemy defeat
    // This function should be called whenever an enemy is defeated
    handleEnemyDefeat();
}

// Function to populate the sidebar with enemy information
function populateEnemyList() {
    const sidebar = document.getElementById('sidebar');

    // Iterate over each enemy type and create elements for them
    for (const enemyType in enemyTypes) {
        const enemy = enemyTypes[enemyType];

        // Create a list item for each enemy type
        const listItem = document.createElement('li');
        listItem.classList.add('enemy-item');

        // Create a colored box to represent the enemy
        const colorBox = document.createElement('div');
        colorBox.className = 'enemy-color';
        colorBox.style.backgroundColor = enemyColors[enemy.colorId];

        // Create a span element for enemy name and statistics
        const enemyText = document.createElement('span');
        enemyText.textContent = `${enemy.name} - HP: ${enemy.health}, Gold: ${enemy.goldReward}`;

        // Append color box and enemy text to the list item
        listItem.appendChild(colorBox);
        listItem.appendChild(enemyText);

        // Append the list item to the sidebar
        sidebar.appendChild(listItem);
    }
}

// Function to place a tower on the grid
function placeTower(x, y, towerType) {
    // Check if the player has enough resources to place the tower
    const cost = towerTypes[towerType].cost;
    if (resources >= cost) {
        // Check if there's already a tower on the grid cell
        if (!isCellOccupied(x, y) && !isWaterTile(x, y)) {
            // Deduct the cost of the tower from the player's resources
            resources -= cost;

            // Update the UI for resources
            updateResourcesUI();

            // Create a new tower object
            const tower = {
                type: towerType,
                x: x,
                y: y
                // You can add more properties such as level, attack speed, etc. if needed
            };

            // Add the tower to the towers array
            towers.push(tower);

            // Draw the tower on the grid
            drawTower(x, y, towerType);

            // For now, let's log a message to indicate that the tower has been placed
            console.log(`Placed ${towerType} tower at (${x}, ${y})`);
        } else {
            console.log("Cannot place tower on an occupied cell.");
        }
    } else {
        console.log("Not enough resources to place this tower.");
    }
}

// Function to check if a grid cell is occupied by a tower or is a water tile
function isCellOccupied(x, y) {
    return towers.some(tower => tower.x === x && tower.y === y) || isWaterTile(x, y);
}

// Function to check if a grid cell is a water tile
function isWaterTile(x, y) {
    // Implement logic to check if the grid cell at (x, y) is a water tile
    // For demonstration purposes, let's assume waterTiles is an array containing water tile coordinates
    return waterArea.some(tile => tile.x === x && tile.y === y);
}

// Function to draw a tower on the grid
function drawTower(x, y, towerType) {
    const towerColor = towerColors[towerType];
    ctx.fillStyle = towerColor;
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
}

// Function to populate the tower list in the sidebar
function populateTowerList() {
    const towerList = document.getElementById('towerList');

    // Iterate over each tower type and create a list item for it
    for (const towerType in towerTypes) {
        const tower = towerTypes[towerType];
        const listItem = document.createElement('li');

        // Create a colored box to represent the tower
        const colorBox = document.createElement('div');
        colorBox.className = 'tower-color';
        colorBox.style.backgroundColor = towerColors[towerType];

        // Create a text span for tower name and cost
        const towerText = document.createElement('span');
        towerText.textContent = `${tower.name} - Cost: ${tower.cost}`;

        // Append color box and tower text to the list item
        listItem.appendChild(colorBox);
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
            selectedTowerType = towerType;
            console.log(`Selected tower: ${selectedTowerType}`);
        });

        // Append the list item to the tower list
        towerList.appendChild(listItem);
    }

    // Select the default tower (basic tower)
    const defaultTowerItem = towerList.firstElementChild;
    defaultTowerItem.classList.add('selected-tower');
    selectedTowerType = 'basic'; // Set the default tower type
}

// Function to create a water area in the middle of the grid
function createArea(area, startX, startY, endX, endY) {
    // Iterate over the area and push each coordinate into the array
    for (let i = startY; i <= endY; i++) {
        for (let j = startX; j <= endX; j++) {
            area.push({ x: j, y: i });
        }
    }
}

// Function to draw the path
function drawPath() {
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x * cellWidth + cellWidth / 2, pathPoints[0].y * cellHeight + cellHeight / 2); // Move to the starting point

    // Draw lines connecting the path points
    for (let i = 1; i < pathPoints.length; i++) {
        const point = pathPoints[i];
        const prevPoint = pathPoints[i - 1];
        
        // Check if the points are aligned horizontally or vertically
        if (point.x === prevPoint.x || point.y === prevPoint.y) {
            ctx.lineTo(point.x * cellWidth + cellWidth / 2, point.y * cellHeight + cellHeight / 2);
        }
    }

    //Set style and stroke for the path lines
    // ctx.strokeStyle = '#ff0000'; // Red color
    // ctx.lineWidth = 5; // Adjust the width of the path
    // ctx.stroke();

    // Fill the tiles of the path with a grey tone
    ctx.fillStyle = 'rgba(128, 128, 128, 1)'; // Semi-transparent grey color
    for (let i = 1; i < pathPoints.length; i++) {
        const point = pathPoints[i];
        const prevPoint = pathPoints[i - 1];

        // Fill the tiles between consecutive path points
        if (point.x === prevPoint.x) {
            const minY = Math.min(point.y, prevPoint.y);
            const maxY = Math.max(point.y, prevPoint.y);
            ctx.fillRect(point.x * cellWidth, minY * cellHeight, cellWidth, (maxY - minY + 1) * cellHeight);
        } else if (point.y === prevPoint.y) {
            const minX = Math.min(point.x, prevPoint.x);
            const maxX = Math.max(point.x, prevPoint.x);
            ctx.fillRect(minX * cellWidth, point.y * cellHeight, (maxX - minX + 1) * cellWidth, cellHeight);
        }
    }
}

// Function to draw the grid with different terrain types
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const tileX = j * cellWidth;
            const tileY = i * cellHeight;

            // Check if the tile is part of the grass, sand, or water area
            const isInGrassArea = grassArea.some(coord => coord.x === j && coord.y === i);
            const isInSandArea = sandArea.some(coord => coord.x === j && coord.y === i);
            const isInWaterArea = waterArea.some(coord => coord.x === j && coord.y === i);

            // Fill the tile based on its terrain type
            if (isInGrassArea) {
                ctx.fillStyle = '#90EE90'; // Green for grass
            } else if (isInSandArea) {
                ctx.fillStyle = '#FFD700'; // Yellow for sand
            } else if (isInWaterArea) {
                ctx.fillStyle = '#ADD8E6'; // Blue for water
            } else {
                ctx.fillStyle = '#FFFFFF'; // White for default background
            }

            // Draw the filled rectangle for the tile
            ctx.fillRect(tileX, tileY, cellWidth, cellHeight);

            // Draw border around the tile
            ctx.strokeStyle = '#000000'; // Black color for border
            ctx.lineWidth = 1; // Adjust the width of the border
            ctx.strokeRect(tileX, tileY, cellWidth, cellHeight);
        }
    }
}

// Function to update the UI for resources
function updateResourcesUI() {
    const resourcesElement = document.getElementById('gold-value');
    resourcesElement.innerHTML = `${resources}`;
}

// Function to update the UI for health points
function updateHealthPointsUI() {
    const healthPointsElement = document.getElementById('health-value');
    healthPointsElement.innerHTML = `${healthPoints}`;
}

// Function to call all the update UI elements
function updateEntireUI() {
    updateHealthPointsUI();
    updateResourcesUI();
    drawGrid();
    drawPath();
}

// Function to toggle tower placement state
function toggleTowerPlacementState(x, y) {
    // Toggle between showing tower range and placing tower
    towerPlacementState.isPlacingTower = true;
    towerPlacementState.x = x;
    towerPlacementState.y = y;
    towerPlacementState.towerType = selectedTowerType;

    // Draw tower range
    drawTowerRange(x, y, towerTypes[selectedTowerType].range);
}

// Function to reset tower placement state
function resetTowerPlacementState() {
    // Reset tower placement state
    towerPlacementState.isPlacingTower = false;
    towerPlacementState.x = null;
    towerPlacementState.y = null;
    towerPlacementState.towerType = null;

    // Clear tower range
    clearTowerRange();
}

// Function to draw tower range
function drawTowerRange(x, y, range) {
    // Implement logic to draw tower range on the grid
    // For demonstration purposes, let's assume drawTowerRange function exists and draws a circle representing the tower range
    ctx.beginPath();
    ctx.arc((x + 0.5) * cellWidth, (y + 0.5) * cellHeight, range * cellWidth, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Red with transparency
    ctx.stroke();
}

// Function to clear tower range
function clearTowerRange() {
    // Clear tower range
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Redraw the grid
    drawTowers(); // Redraw the towers
}

// Add a function to draw existing towers on the grid
function drawTowers() {
    towers.forEach(tower => {
        drawTower(tower.x, tower.y, tower.type);
    });
}

// Function to show the range of a tower
function showTowerRange(tower) {
    // Clear previous tower range
    clearTowerRange();
    // Draw tower range
    drawTowerRange(tower.x, tower.y, towerTypes[tower.type].range);
}

// Add a double-click event listener to the canvas
canvas.addEventListener('click', function(event) {
    // Get the clicked position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Determine the grid coordinates (row and column) corresponding to the clicked position
    const gridX = Math.floor(mouseX / cellWidth);
    const gridY = Math.floor(mouseY / cellHeight);

    // Check if the player is already in the process of placing a tower
    if (towerPlacementState.isPlacingTower) {
        // If the player double-clicks the same tile again, place the tower
        if (gridX === towerPlacementState.x && gridY === towerPlacementState.y) {
            placeTower(gridX, gridY, towerPlacementState.towerType);
            // Reset tower placement state
            resetTowerPlacementState();
            
            // Call the drawPath function to draw the path
            drawPath();
        } else {
            // If the player double-clicks a different tile, cancel tower placement
            // Reset tower placement state
            resetTowerPlacementState();

            // Call the drawPath function to draw the path
            drawPath();
        }
    } else {
        // If the player is not already in the process of placing a tower, toggle tower placement state
        toggleTowerPlacementState(gridX, gridY);
        // Call the drawPath function to draw the path
        drawPath();
    }
});

// Add a click event listener to the canvas
canvas.addEventListener('click', function(event) {
    // Get the clicked position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Determine the grid coordinates (row and column) corresponding to the clicked position
    const gridX = Math.floor(mouseX / cellWidth);
    const gridY = Math.floor(mouseY / cellHeight);

    // Check if the clicked grid cell contains a tower
    const clickedTower = towers.find(tower => tower.x === gridX && tower.y === gridY);
    if (clickedTower) {
        // Show the range of the clicked tower
        showTowerRange(clickedTower);

        // Call the drawPath function to draw the path
        drawPath();
    }
});

// Create different areas
createArea(waterArea, 10, 3, 15, 7);
createArea(waterArea, 4, 14, 7, 17);
createArea(sandArea, 4, 18, 8, 20);
createArea(sandArea, 0, 0, 4, 20);
createArea(sandArea, 8, 15, 11, 20);
createArea(grassArea, 0, 0, 10, 14);
createArea(grassArea, 12, 15, 20, 20);
createArea(grassArea, 11, 0, 20, 2);
createArea(grassArea, 0, 8, 20, 14);
createArea(grassArea, 15, 0, 20, 20);

// Call the drawGrid function to draw the grid
drawGrid();

// Call the drawPath function to draw the path
drawPath();

// Call the function to populate the tower list when the page loads
populateTowerList();
populateEnemyList();

// Call the function to update the UI
updateEntireUI();