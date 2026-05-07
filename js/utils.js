// --- 5. Logic & Mechanics ---

function getEnemyType(greenChance, metalChance, redChance) {
    let rand = Math.random();
    if (rand < greenChance) return 'elusive_green';
    if (rand < greenChance + metalChance) return 'metal';
    if (rand < greenChance + metalChance + redChance) return 'red';
    return 'normal';
}

function initLevel() {
    enemies = []; bullets = []; particles = []; eggs = []; foods = []; gifts = []; 
    boss = null;
    
    shieldSpawnedThisLevel = false; 
    laserSpawnedThisLevel = 0; 
    normalSpawnedThisLevel = 0; 
    
    if (!player || currentState === STATE.GAMEOVER) {
        player = new Player();
    } else {
        let tempWeapon = player.weaponLevel; let tempType = player.weaponType;
        player = new Player(); player.weaponLevel = tempWeapon; player.weaponType = tempType;
    }

    enemyDirection = 1;
    let currentEnemySpeed = baseEnemySpeed + (level * 0.2);

    if (level % 5 === 0) {
        boss = new Boss();
    } else {
        let redChance = level >= 3 ? Math.min(0.2 + (level * 0.05), 0.6) : 0; 
        let metalChance = level >= 4 ? Math.min(0.1 + (level * 0.05), 0.4) : 0; 
        let greenChance = level >= 6 ? Math.min(0.05 + (level * 0.02), 0.2) : 0; 

        if (level % 4 === 2) { 
            let centersX = [250, 550]; 
            let spacingX = 50; 
            let spacingY = 45; 
            
            for (let t = 0; t < 2; t++) { 
                for (let r = 0; r < 5; r++) { 
                    let startX = centersX[t] - (r * spacingX) / 2;
                    for (let c = 0; c <= r; c++) {
                        let type = getEnemyType(greenChance, metalChance, redChance);
                        let enemy = new Enemy(startX + (c * spacingX) - 25, r * spacingY + 70, type);
                        enemy.speed = currentEnemySpeed; 
                        enemies.push(enemy);
                    }
                }
            }
        } else if (level % 4 === 3) {
            let centersX = [250, 550]; 
            let spacingX = 50;
            let spacingY = 40;
            let shape = [2, 4, 6, 4, 2]; 
            
            for (let t = 0; t < 2; t++) { 
                for (let r = 0; r < shape.length; r++) {
                    let cols = shape[r];
                    let startX = centersX[t] - (cols * spacingX) / 2; 
                    for (let c = 0; c < cols; c++) {
                        let type = getEnemyType(greenChance, metalChance, redChance);
                        let enemy = new Enemy(startX + (c * spacingX), r * spacingY + 70, type); 
                        enemy.speed = currentEnemySpeed; enemies.push(enemy);
                    }
                }
            }
        } else {
            let rows = Math.min(4 + Math.floor(level/3), 6); 
            let cols = Math.min(8 + Math.floor(level/2), 12); 
            let startX = canvas.width/2 - (cols * 60)/2 + 25;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    let type = getEnemyType(greenChance, metalChance, redChance);
                    let enemy = new Enemy(startX + (c * 60), r * 45 + 70, type);
                    enemy.speed = currentEnemySpeed; enemies.push(enemy);
                }
            }
        }
    }
}

function checkAABBCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + (rect2.width || rect2.radius*2) &&
        rect1.x + (rect1.width || rect1.radius*2) > rect2.x &&
        rect1.y < rect2.y + (rect2.height || rect2.radius*2) &&
        rect1.y + (rect1.height || rect1.radius*2) > rect2.y
    );
}

function checkPlayerEggCollision(egg, player) {
    let playerHitbox = {
        x: player.x + 35,
        y: player.y + 35,
        width: player.width - 70,
        height: player.height - 55
    };

    return checkAABBCollision(egg, playerHitbox);
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) particles.push(new Particle(x, y, color));
}