// --- 1. Canvas Setup & Global Variables ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 2. Assets Loading Section ---
const img_background = new Image(); img_background.src = 'background.jpg';
const img_player = new Image(); img_player.src = 'ship.png';

const img_chicken = new Image(); img_chicken.src = 'chicken.png'; 
const img_chicken2 = new Image(); img_chicken2.src = 'chicken2.png'; 
const img_chicken3 = new Image(); img_chicken3.src = 'chicken3.png'; 
const img_elusive_green_chicken = new Image(); img_elusive_green_chicken.src = 'elusive_green_chicken.png'; 

const img_heart = new Image(); img_heart.src = 'heart.png';
const img_bullet = new Image(); img_bullet.src = 'bullet.png';
const img_egg = new Image(); img_egg.src = 'egg.png'; 
const img_food = new Image(); img_food.src = 'food.png';
const img_gift = new Image(); img_gift.src = 'gift.png';
const img_gift_laser = new Image(); img_gift_laser.src = 'gift_laser.png'; 
const img_gift_shield = new Image(); img_gift_shield.src = 'gift_shield.png'; 
const img_title = new Image(); img_title.src = 'first page.png'; 

const STATE = { START: 0, PLAYING: 1, GAMEOVER: 2, NEXT_LEVEL: 3 };
let currentState = STATE.START;
let animationId;
let score = 0;
let level = 1;
let lives = 3;
let eggTimer = 60; 

// --- متغيرات التحكم في ظهور الهدايا لكل مستوى ---
let shieldSpawnedThisLevel = false; 
let laserSpawnedThisLevel = 0; // عداد الليزر (الحد الأقصى 1)
let normalSpawnedThisLevel = 0; // عداد السلاح العادي (الحد الأقصى 3)

// --- نظام حفظ أعلى نتيجة ---
let highScore = parseInt(localStorage.getItem('chickenHighScore')) || 0;
let isNewHighScore = false; 

const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, Space: false };

// --- 3. OOP Classes (Entities) ---

class Player {
    constructor() {
        this.width = 110;  
        this.height = 140; 
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 30;
        
        this.vx = 0;             
        this.vy = 0;             
        this.acceleration = 0.6; 
        this.friction = 0.85;    
        
        this.cooldown = 0;
        this.weaponType = 'normal'; 
        this.weaponLevel = 1; 
        this.laserTimer = 0; 
        this.shieldTimer = 0; 
    }

    draw(ctx) {
        if (img_player.complete && img_player.naturalWidth !== 0) {
            ctx.drawImage(img_player, this.x, this.y, this.width, this.height);
        } else { 
            ctx.fillStyle = 'blue'; ctx.fillRect(this.x, this.y, this.width, this.height); 
        }

        if (this.shieldTimer > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.height / 2 + 10, 0, Math.PI * 2);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#00ffff'; 
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.15)'; 
            ctx.fill();
            ctx.restore();
        }
    }

    update() {
        if (keys.ArrowLeft) this.vx -= this.acceleration;
        if (keys.ArrowRight) this.vx += this.acceleration;
        if (keys.ArrowUp) this.vy -= this.acceleration;
        if (keys.ArrowDown) this.vy += this.acceleration;

        this.vx *= this.friction;
        this.vy *= this.friction;

        if (Math.abs(this.vx) < 0.1) this.vx = 0;
        if (Math.abs(this.vy) < 0.1) this.vy = 0;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x + this.width > canvas.width) { this.x = canvas.width - this.width; this.vx = 0; }

        let upperLimit = canvas.height / 2; 
        if (this.y < upperLimit) { this.y = upperLimit; this.vy = 0; }
        if (this.y + this.height > canvas.height) { this.y = canvas.height - this.height; this.vy = 0; }

        if (this.weaponType === 'laser') {
            if (this.laserTimer > 0) this.laserTimer--; 
            else this.weaponType = 'normal'; 
        }

        if (this.shieldTimer > 0) {
            this.shieldTimer--; 
        }

        if (this.cooldown > 0) this.cooldown--;
        
        if (keys.Space && this.cooldown === 0) {
            if (this.weaponType === 'laser') {
                bullets.push(new LaserBullet(this.x + this.width / 2, this.y));
                this.cooldown = 12; 
            } else {
                if (this.weaponLevel === 1) {
                    bullets.push(new Bullet(this.x + this.width / 2, this.y));
                } else if (this.weaponLevel === 2) {
                    bullets.push(new Bullet(this.x + this.width / 4, this.y));
                    bullets.push(new Bullet(this.x + (this.width / 4) * 3, this.y));
                } else {
                    bullets.push(new Bullet(this.x, this.y));
                    bullets.push(new Bullet(this.x + this.width / 2, this.y));
                    bullets.push(new Bullet(this.x + this.width, this.y));
                }
                this.cooldown = 45; 
            }
        }
    }
}

class Bullet {
    constructor(x, y) {
        this.width = 18;  
        this.height = 40; 
        this.x = x - (this.width / 2); 
        this.y = y;
        this.speed = 2.5; 
        this.damage = 1; 
        this.markedForDeletion = false;
    }
    draw(ctx) {
        if (img_bullet.complete && img_bullet.naturalWidth !== 0) {
            ctx.drawImage(img_bullet, this.x, this.y, this.width, this.height);
        } else { 
            ctx.fillStyle = '#0f0'; ctx.fillRect(this.x, this.y, this.width, this.height); 
        }
    }
    update() {
        this.y -= this.speed;
        if (this.y + this.height < 0) this.markedForDeletion = true;
    }
}

class LaserBullet {
    constructor(x, y) {
        this.width = 10;  
        this.height = 80; 
        this.x = x - (this.width / 2); 
        this.y = y - this.height; 
        this.speed = 15; 
        this.damage = 2; 
        this.markedForDeletion = false;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#00ffff'; 
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#ffffff'; 
        ctx.fillRect(this.x + 2, this.y, this.width - 4, this.height);
        ctx.restore();
    }
    update() {
        this.y -= this.speed;
        if (this.y + this.height < 0) this.markedForDeletion = true;
    }
}

class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x; this.y = y; this.width = 50; this.height = 40; 
        this.markedForDeletion = false;
        this.type = type;
        this.hp = (type === 'metal') ? 3 : (type === 'red') ? 2 : (type === 'elusive_green') ? 6 : 1;
        this.hitFlash = 0; 
    }
    draw(ctx) {
        if (this.hitFlash > 0) {
            ctx.fillStyle = 'white'; 
            ctx.fillRect(this.x, this.y, this.width, this.height);
            this.hitFlash--;
        } else {
            if (this.type === 'elusive_green' && img_elusive_green_chicken.complete && img_elusive_green_chicken.naturalWidth !== 0) {
                ctx.drawImage(img_elusive_green_chicken, this.x, this.y, this.width, this.height);
            } else if (this.type === 'metal' && img_chicken3.complete && img_chicken3.naturalWidth !== 0) {
                ctx.drawImage(img_chicken3, this.x, this.y, this.width, this.height); 
            } else if (this.type === 'red' && img_chicken2.complete && img_chicken2.naturalWidth !== 0) {
                ctx.drawImage(img_chicken2, this.x, this.y, this.width, this.height); 
            } else if (img_chicken.complete && img_chicken.naturalWidth !== 0) {
                ctx.drawImage(img_chicken, this.x, this.y, this.width, this.height); 
            } else { 
                ctx.fillStyle = (this.type === 'metal') ? 'gold' : (this.type === 'red') ? 'darkred' : (this.type === 'elusive_green') ? 'green' : 'red';
                ctx.fillRect(this.x, this.y, this.width, this.height); 
            }
        }
    }
}

class Boss {
    constructor() {
        this.width = 150; this.height = 150;
        this.x = canvas.width/2 - this.width/2; this.y = 80;
        this.maxHp = 50 + (level * 10); this.hp = this.maxHp;
        this.angle = 0; 
        this.markedForDeletion = false; 
        this.hitFlash = 0;
        this.shootTimer = 60;
    }
    update() {
        this.angle += 0.03;
        this.x = (canvas.width/2 - this.width/2) + Math.cos(this.angle) * 250;
        this.y = 80 + Math.sin(this.angle * 2) * 50;

        this.shootTimer--;
        if(this.shootTimer <= 0) {
            eggs.push(new Egg(this.x + this.width/2 - 7, this.y + this.height - 20)); 
            eggs.push(new Egg(this.x + 20, this.y + this.height - 40)); 
            eggs.push(new Egg(this.x + this.width - 35, this.y + this.height - 40)); 
            this.shootTimer = Math.max(40, 100 - (level * 5)); 
        }
    }
    draw(ctx) {
        if (this.hitFlash > 0) {
            ctx.fillStyle = 'white'; ctx.fillRect(this.x, this.y, this.width, this.height);
            this.hitFlash--;
        } else {
            if (img_elusive_green_chicken.complete && img_elusive_green_chicken.naturalWidth !== 0) {
                ctx.drawImage(img_elusive_green_chicken, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = 'purple'; ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        ctx.fillStyle = 'red'; ctx.fillRect(this.x, this.y - 15, this.width, 10);
        ctx.fillStyle = '#0f0'; ctx.fillRect(this.x, this.y - 15, this.width * (this.hp / this.maxHp), 10);
    }
}

class Egg {
    constructor(x, y) {
        this.x = x + 15; this.y = y + 20; this.width = 15; this.height = 20;
        this.speed = 2 + (level * 0.1); this.markedForDeletion = false;
        this.angle = 0; this.spinSpeed = (Math.random() - 0.5) * 0.2;
    }
    draw(ctx) {
        if (img_egg.complete && img_egg.naturalWidth !== 0) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.angle);
            ctx.drawImage(img_egg, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else { 
            ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(this.x+7, this.y+10, 7, 10, 0, 0, Math.PI*2); ctx.fill(); 
        }
    }
    update() {
        this.y += this.speed; this.angle += this.spinSpeed;
        if (this.y > canvas.height) this.markedForDeletion = true;
    }
}

class Food {
    constructor(x, y) {
        this.x = x; this.y = y; this.width = 30; this.height = 30; this.speed = 2; this.markedForDeletion = false;
    }
    draw(ctx) {
        if (img_food.complete && img_food.naturalWidth !== 0) {
            ctx.drawImage(img_food, this.x, this.y, this.width, this.height);
        } else { 
            ctx.fillStyle = 'orange'; ctx.beginPath(); ctx.arc(this.x+15, this.y+15, 15, 0, Math.PI*2); ctx.fill(); 
        }
    }
    update() {
        this.y += this.speed; if (this.y > canvas.height) this.markedForDeletion = true;
    }
}

class Gift {
    constructor(x, y, type = 'normal') {
        this.x = x; this.y = y; this.width = 35; this.height = 35; 
        this.speed = 1.5; 
        this.markedForDeletion = false;
        this.type = type; 
    }
    draw(ctx) {
        if (this.type === 'laser') {
            if (img_gift_laser.complete && img_gift_laser.naturalWidth !== 0) {
                ctx.drawImage(img_gift_laser, this.x, this.y, this.width, this.height);
            } else { 
                ctx.fillStyle = 'cyan'; ctx.fillRect(this.x, this.y, this.width, this.height); 
            }
        } else if (this.type === 'shield') {
            if (img_gift_shield.complete && img_gift_shield.naturalWidth !== 0) {
                ctx.drawImage(img_gift_shield, this.x, this.y, this.width, this.height);
            } else { 
                ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(this.x+17, this.y+17, 17, 0, Math.PI*2); ctx.fill(); 
            }
        } else {
            if (img_gift.complete && img_gift.naturalWidth !== 0) {
                ctx.drawImage(img_gift, this.x, this.y, this.width, this.height);
            } else { 
                ctx.fillStyle = 'purple'; ctx.fillRect(this.x, this.y, this.width, this.height); 
            }
        }
    }
    update() {
        this.y += this.speed; if (this.y > canvas.height) this.markedForDeletion = true;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.radius = Math.random() * 5 + 3; 
        this.vx = (Math.random() - 0.5) * 8; this.vy = (Math.random() - 0.5) * 8; 
        this.color = color; this.alpha = 1; this.markedForDeletion = false;
    }
    draw(ctx) {
        ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.alpha -= 0.02;
        if (this.alpha <= 0) this.markedForDeletion = true;
    }
}

// --- 4. Game Management Arrays & Objects ---
let player;
let bullets = []; let enemies = []; let particles = []; let eggs = []; let foods = []; let gifts = [];
let boss = null; 
let enemyDirection = 1; let baseEnemySpeed = 0.8;

let stars = Array.from({length: 100}, () => ({
    x: Math.random() * 800, 
    y: Math.random() * 750, 
    speed: Math.random() * 2 + 0.5, 
    radius: Math.random() * 1.5 + 0.5
}));

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
    
    // --- تصفير العدادات عند بداية كل مستوى جديد ---
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

function createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) particles.push(new Particle(x, y, color));
}

// --- 6. Main Game Loop Functions ---

function update() {
    if (currentState !== STATE.PLAYING) return;

    player.update();
    bullets.forEach(b => b.update()); bullets = bullets.filter(b => !b.markedForDeletion);
    particles.forEach(p => p.update()); particles = particles.filter(p => !p.markedForDeletion);
    eggs.forEach(e => e.update()); eggs = eggs.filter(e => !e.markedForDeletion);
    foods.forEach(f => f.update()); foods = foods.filter(f => !f.markedForDeletion);
    gifts.forEach(g => g.update()); gifts = gifts.filter(g => !g.markedForDeletion);

    if (boss) {
        boss.update();
        if (boss.markedForDeletion) boss = null;
    }

    let reverseDirection = false;
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemyDirection;
        if (enemy.x + enemy.width > canvas.width - 20 || enemy.x < 20) reverseDirection = true;
    });

    if (reverseDirection) enemyDirection *= -1;

    if (enemies.length > 0 && level > 1) {
        if (eggTimer > 0) {
            eggTimer--; 
        } else {
            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            eggs.push(new Egg(randomEnemy.x, randomEnemy.y));
            eggTimer = Math.max(20, 90 - (level * 10) + (Math.random() * 30));
        }
    }

    bullets.forEach(bullet => {
        if (boss && !boss.markedForDeletion && !bullet.markedForDeletion && checkAABBCollision(bullet, boss)) {
            bullet.markedForDeletion = true; boss.hitFlash = 5; 
            boss.hp -= (bullet.damage || 1); 
            createExplosion(bullet.x, bullet.y, 'orange');
            if (boss.hp <= 0) {
                boss.markedForDeletion = true; score += 1000;
                for(let i=0; i<50; i++) createExplosion(boss.x + Math.random()*boss.width, boss.y + Math.random()*boss.height, 'yellow');
            }
        }
        
        enemies.forEach(enemy => {
            if (!bullet.markedForDeletion && !enemy.markedForDeletion && checkAABBCollision(bullet, enemy)) {
                bullet.markedForDeletion = true;
                enemy.hp -= (bullet.damage || 1); 
                enemy.hitFlash = 5; 
                
                if (enemy.hp <= 0) {
                    enemy.markedForDeletion = true;
                    createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 'rgba(0, 100, 255, 0.5)');
                    
                    let dropChance = Math.random();
                    
                    // --- نظام سقوط الهدايا بالعدد المحدد لكل مستوى ---
                    if (!shieldSpawnedThisLevel && dropChance < 0.04) {
                        gifts.push(new Gift(enemy.x, enemy.y, 'shield'));
                        shieldSpawnedThisLevel = true; 
                    } 
                    else if (laserSpawnedThisLevel < 1 && dropChance < 0.10) { 
                        gifts.push(new Gift(enemy.x, enemy.y, 'laser')); 
                        laserSpawnedThisLevel++; // زيادة العداد
                    } 
                    else if (normalSpawnedThisLevel < 1 && dropChance < 0.20) { 
                        gifts.push(new Gift(enemy.x, enemy.y, 'normal')); 
                        normalSpawnedThisLevel++; // زيادة العداد
                    } 
                    else if (dropChance < 0.40) {
                        foods.push(new Food(enemy.x, enemy.y)); 
                    }
                    // ------------------------------------------------
                    
                    score += 10 * level;
                }
            }
        });
    });

    eggs.forEach(egg => {
        if (!egg.markedForDeletion && checkAABBCollision(egg, player)) {
            egg.markedForDeletion = true; 
            
            if (player.shieldTimer > 0) {
                createExplosion(egg.x, egg.y, 'cyan'); 
                score += 10;
            } else {
                lives--;
                createExplosion(player.x + player.width/2, player.y + player.height/2, 'red');
                
                if (player.weaponType === 'laser') {
                    player.weaponType = 'normal'; 
                    player.laserTimer = 0; 
                } else if (player.weaponLevel > 1) {
                    player.weaponLevel--; 
                }
                
                if (lives <= 0 && currentState !== STATE.GAMEOVER) {
                    currentState = STATE.GAMEOVER;
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('chickenHighScore', highScore);
                        isNewHighScore = true;
                    } else {
                        isNewHighScore = false;
                    }
                }
            }
        }
    });

    foods.forEach(food => {
        if (!food.markedForDeletion && checkAABBCollision(food, player)) {
            food.markedForDeletion = true; score += 50;
        }
    });

    gifts.forEach(gift => {
        if (!gift.markedForDeletion && checkAABBCollision(gift, player)) {
            gift.markedForDeletion = true; 
            
            if (gift.type === 'shield') {
                player.shieldTimer = 600; 
                score += 500;
            } else if (gift.type === 'laser') {
                player.weaponType = 'laser'; 
                player.laserTimer = 300; 
                score += 300; 
            } else {
                if (player.weaponLevel < 3) player.weaponLevel++; 
                score += 100; 
            }
        }
    });

    enemies = enemies.filter(e => !e.markedForDeletion);

    if (enemies.length === 0 && !boss) {
        currentState = STATE.NEXT_LEVEL;
        setTimeout(() => { level++; initLevel(); currentState = STATE.PLAYING; }, 2000);
    }
}

function drawUI() {
    ctx.fillStyle = '#fff'; ctx.font = '25px Courier New'; ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
    
    const heartSize = 25;
    for (let i = 0; i < lives; i++) {
        let x = canvas.width - (lives * heartSize) + (i * heartSize) - 20;
        if (img_heart.complete && img_heart.naturalWidth !== 0) {
            ctx.drawImage(img_heart, x, 15, heartSize, heartSize);
        } else { 
            ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(x + heartSize/2, 15 + heartSize/2, heartSize/2, 0, Math.PI*2); ctx.fill(); 
        }
    }
}

function drawBackground() {
    if (img_background.complete && img_background.naturalWidth !== 0) {
        ctx.drawImage(img_background, 0, 0, canvas.width, canvas.height);
    } else { 
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }
    
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        if (currentState === STATE.PLAYING) star.y += star.speed; 
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
    });
}

function draw() {
    drawBackground();

    if (currentState === STATE.START) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (img_title.complete && img_title.naturalWidth !== 0) {
            let logoWidth = 550; 
            let logoHeight = (img_title.naturalHeight / img_title.naturalWidth) * logoWidth; 
            ctx.drawImage(img_title, canvas.width / 2 - logoWidth / 2, canvas.height / 2 - logoHeight / 2 - 80, logoWidth, logoHeight);
        } else {
            ctx.textAlign = 'center';
            ctx.shadowColor = '#0055ff'; 
            ctx.shadowBlur = 20; 
            ctx.fillStyle = '#0044cc';   
            ctx.font = 'bold 50px Arial Black, sans-serif';
            ctx.fillText('CHICKEN INVADERS', canvas.width / 2, canvas.height / 2 - 40);
            ctx.shadowBlur = 0;
        }

        ctx.fillStyle = '#ffcc00'; 
        ctx.font = 'bold 24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`HIGHEST SCORE: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);

        if (Math.floor(Date.now() / 500) % 2 === 0) {
            ctx.fillStyle = '#00ffff'; 
            ctx.font = 'bold 25px Courier New';
            ctx.fillText('>> Press [ENTER] to Start <<', canvas.width / 2, canvas.height - 150);
        }

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '18px Courier New';
        ctx.fillText('Arrows: Move | Space: Shoot', canvas.width / 2, canvas.height - 90);
        
        ctx.textAlign = 'left'; 
    } 
    else if (currentState === STATE.PLAYING || currentState === STATE.NEXT_LEVEL) {
        player.draw(ctx);
        bullets.forEach(b => b.draw(ctx));
        if (boss) boss.draw(ctx);
        enemies.forEach(e => e.draw(ctx));
        particles.forEach(p => p.draw(ctx));
        eggs.forEach(e => e.draw(ctx));
        foods.forEach(f => f.draw(ctx));
        gifts.forEach(g => g.draw(ctx)); 
        drawUI();

        if (currentState === STATE.NEXT_LEVEL) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.textAlign = 'center';
            ctx.shadowColor = '#00aaff'; 
            ctx.shadowBlur = 25;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 50px Arial Black, sans-serif';
            ctx.fillText(`WAVE ${level} CLEARED!`, canvas.width / 2, canvas.height / 2);
            ctx.shadowBlur = 0;
            ctx.textAlign = 'left';
        }
    } 
    else if (currentState === STATE.GAMEOVER) {
        ctx.fillStyle = 'rgba(50, 0, 0, 0.6)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        
        ctx.shadowColor = '#ff0000'; 
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 70px Arial Black, sans-serif';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px Courier New';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);

        ctx.fillStyle = isNewHighScore ? '#00ff00' : '#ffcc00';
        ctx.fillText(`High Score:  ${highScore}`, canvas.width / 2, canvas.height / 2 + 80);

        if (isNewHighScore && Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.fillStyle = '#ff00ff';
            ctx.font = 'bold 25px Courier New';
            ctx.fillText('🏆 NEW RECORD! 🏆', canvas.width / 2, canvas.height / 2 + 120);
        }

        if (Math.floor(Date.now() / 500) % 2 === 0) {
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 25px Courier New';
            ctx.fillText('Press [R] to Try Again', canvas.width / 2, canvas.height / 2 + 160);
        }
        
        ctx.textAlign = 'left';
    }
}

function gameLoop() {
    update(); draw();
    animationId = requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    if (['F5', 'F7', 'F8', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();

    if (e.code === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.code === 'ArrowRight') keys.ArrowRight = true;
    if (e.code === 'ArrowUp') keys.ArrowUp = true;
    if (e.code === 'ArrowDown') keys.ArrowDown = true;
    if (e.code === 'Space') keys.Space = true;

    if (currentState === STATE.PLAYING) {
        if (e.code === 'F5') lives++; 
        if (e.code === 'F7' && player.weaponLevel < 3) player.weaponLevel++; 
        if (e.code === 'F8') { enemies = []; if(boss) boss.hp = 0; } 
    }

    if (e.code === 'Enter' && currentState === STATE.START) { initLevel(); currentState = STATE.PLAYING; }
    if (e.code === 'KeyR' && currentState === STATE.GAMEOVER) { score = 0; level = 1; lives = 3; initLevel(); currentState = STATE.PLAYING; }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.code === 'ArrowRight') keys.ArrowRight = false;
    if (e.code === 'ArrowUp') keys.ArrowUp = false;
    if (e.code === 'ArrowDown') keys.ArrowDown = false;
    if (e.code === 'Space') keys.Space = false;
});

gameLoop();