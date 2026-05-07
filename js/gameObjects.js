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
