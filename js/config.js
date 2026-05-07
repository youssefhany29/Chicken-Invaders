// --- 1. Canvas Setup & Global Variables ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const STATE = { START: 0, PLAYING: 1, GAMEOVER: 2, NEXT_LEVEL: 3 };
let currentState = STATE.START;
let animationId;
let score = 0;
let level = 1;
let lives = 3;
let eggTimer = 60; 

let shieldSpawnedThisLevel = false; 
let laserSpawnedThisLevel = 0;
let normalSpawnedThisLevel = 0;

// --- save the highest score ---
let highScore = parseInt(localStorage.getItem('chickenHighScore')) || 0;
let isNewHighScore = false; 

const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, Space: false };