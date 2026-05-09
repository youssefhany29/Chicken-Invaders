// --- 2. Assets Loading Section ---
const img_background = new Image(); img_background.src = 'assets/images/background.jpg';
const img_player = new Image(); img_player.src = 'assets/images/ship.png';

const img_chicken = new Image(); img_chicken.src = 'assets/images/chicken.png'; 
const img_chicken2 = new Image(); img_chicken2.src = 'assets/images/chicken2.png'; 
const img_chicken3 = new Image(); img_chicken3.src = 'assets/images/chicken3.png'; 
const img_elusive_green_chicken = new Image(); img_elusive_green_chicken.src = 'assets/images/elusive_green_chicken.png'; 

const img_heart = new Image(); img_heart.src = 'assets/images/heart.png';
const img_bullet = new Image(); img_bullet.src = 'assets/images/bullet.png';
const img_egg = new Image(); img_egg.src = 'assets/images/egg.png'; 
const img_food = new Image(); img_food.src = 'assets/images/food.png';
const img_gift = new Image(); img_gift.src = 'assets/images/gift.png';
const img_gift_laser = new Image(); img_gift_laser.src = 'assets/images/gift_laser.png'; 
const img_gift_shield = new Image(); img_gift_shield.src = 'assets/images/gift_shield.png'; 
const img_title = new Image(); img_title.src = 'assets/images/first page.png'; 


const sounds = {
    shoot: new Audio('assets/sounds/shoot.wav'),
    laser: new Audio('assets/sounds/laser.wav'),
    chickenHit: new Audio('assets/sounds/chicken-hit.wav'),
    chickenDead: new Audio('assets/sounds/chicken-dead.wav'),
    hit: new Audio('assets/sounds/egg-hit-shield.wav'), 
    collect: new Audio('assets/sounds/collect.wav'),
    gameOver: new Audio('assets/sounds/game-over.wav'),
    start: new Audio('assets/sounds/start.wav')
};

let soundEnabled = true;

function setupSounds() {
    sounds.shoot.volume = 0.35;
    sounds.laser.volume = 0.35;
    sounds.chickenHit.volume = 0.45;
    sounds.chickenDead.volume = 0.55;
    sounds.hit.volume = 0.55;
    sounds.collect.volume = 0.45;
    sounds.gameOver.volume = 0.65;
    sounds.start.volume = 0.45;
}

function playSound(name) {
    if (!soundEnabled || !sounds[name]) return;

    const sound = sounds[name].cloneNode();
    sound.volume = sounds[name].volume;

    const soundStartTimes = {
        shoot: 0,
        laser: 0,
        chickenHit: 0,
        chickenDead: 1,
        hit: 0.2,
        collect: 0,
        gameOver: 0,
        start: 0
    };

    const soundDurations = {
        shoot: 0.25,
        laser: 0.25,
        chickenHit: 0.50,
        chickenDead: 0.50,
        hit: 1,
        collect: 0.30,
        gameOver: 1.20,
        start: 0.80
    };

    sound.currentTime = soundStartTimes[name] || 0;

    sound.play().then(() => {
        const duration = soundDurations[name] || 0.35;

        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, duration * 1000);
    }).catch(() => {
    });
}

setupSounds();
