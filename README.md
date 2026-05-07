# Chicken Invaders Clone - Computer Graphics Project

## Project Information

**Course:** Computer Graphics  
**Semester:** Spring 2026  
**Project Type:** Final Project  
**Game Type:** 2D Space Shooting Game  

## Team Members

| Student ID | Full Name |
|---|---|
| 220303958 | Youssef Abdalla |
| 220303975 | Ahmed Ehab Hassan Ali |

## Project Description

This project is a 2D space shooting game inspired by **Chicken Invaders**.  
The player controls a spaceship at the bottom of the screen and shoots enemy chickens that appear in waves.

The game includes:

- Player spaceship movement
- Shooting system
- Enemy waves and formations
- Different enemy types
- Falling eggs as enemy attacks
- Gifts and power-ups
- Food collection
- Score system
- Lives system
- Increasing difficulty
- Boss waves
- Particle explosion effects
- High score saving using browser local storage

The game was developed using **HTML**, **CSS**, and **JavaScript** with the **HTML5 Canvas API**.

---

## Game Objective

The objective of the game is to survive as long as possible, destroy enemy chickens, avoid falling eggs, collect useful items, and achieve the highest possible score.

The player progresses through multiple waves. As the level increases, enemies become stronger and the difficulty increases. Every few levels, a boss enemy appears as an additional challenge.

---

## How to Play

| Key | Action |
|---|---|
| Enter | Start the game |
| Arrow Left | Move left |
| Arrow Right | Move right |
| Arrow Up | Move up |
| Arrow Down | Move down |
| Space | Shoot |
| R | Restart after game over |

---

## Game Rules

1. Press **Enter** to start the game.
2. Use the **Arrow Keys** to move the spaceship.
3. Press **Space** to shoot bullets.
4. Destroy all enemy chickens to clear the wave.
5. Avoid falling eggs.
6. Collect food and gifts to increase score or gain power-ups.
7. The player loses one life when hit by an egg without a shield.
8. The game ends when the player loses all lives.
9. The goal is to achieve the highest score possible.

---

## Computer Graphics Concepts Used

### 1. Canvas Rendering

The game uses the HTML5 Canvas API to draw all objects on the screen, including the background, player, enemies, bullets, eggs, gifts, particles, and user interface.

### 2. Animation

Animation is created using a continuous game loop with `requestAnimationFrame()`.  
Each frame updates object positions and redraws the scene.

### 3. 2D Transformations

The game uses translation and rotation.  
For example, falling eggs rotate while moving downward, and the boss moves using trigonometric motion.

### 4. AABB Collision Detection

The game uses **Axis-Aligned Bounding Box** collision detection to detect overlaps between:

- Bullets and enemies
- Bullets and boss
- Eggs and player
- Gifts and player
- Food and player

### 5. Sprites and Raster Graphics

The game uses raster image files such as PNG and JPG for the player, enemies, bullets, eggs, gifts, hearts, and background.

### 6. Transparency and Alpha Channel

Transparency is used in shield effects and particle explosions.  
The alpha value changes over time to create fading effects.

### 7. Particle Effects

When enemies are destroyed or the player is hit, small particles are generated to create an explosion effect.

### 8. User Interaction

Keyboard event listeners are used to control player movement and shooting.

---

## Project Structure

```text
ChickenInvaders/
│
├── index.html
├── README.md
│
├── assets/
│   └── images/
│       ├── background.jpg
│       ├── ship.png
│       ├── chicken.png
│       ├── chicken2.png
│       ├── chicken3.png
│       ├── elusive_green_chicken.png
│       ├── heart.png
│       ├── bullet.png
│       ├── egg.png
│       ├── food.png
│       ├── gift.png
│       ├── gift_laser.png
│       ├── gift_shield.png
│       └── first page.png
│
├── css/
│   └── style.css
│
└── js/
    ├── config.js
    ├── assets.js
    ├── entities.js
    ├── gameObjects.js
    ├── utils.js
    ├── game.js
    ├── input.js
    └── main.js
