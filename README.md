# Chicken Invaders Clone

## Computer Graphics Final Project — Spring 2026

<p align="center">
  <img src="assets/images/first page.png" alt="Chicken Invaders Clone" width="600">
</p>

---

## Project Information

| Item | Details |
|---|---|
| Course | Computer Graphics |
| Semester | Spring 2026 |
| Project Type | Final Project |
| Game Type | 2D Space Shooting Game |
| Technologies | HTML, CSS, JavaScript, HTML5 Canvas |

---

## Team Members

| Student ID | Full Name |
|---|---|
| 220303975 | Ahmed Ehab Hassan Ali |
| 220303958 | Youssef Abdalla |

---

## Game Overview

**Chicken Invaders Clone** is a 2D arcade-style shooting game inspired by Chicken Invaders.

The player controls a spaceship and fights against waves of enemy chickens. The goal is to survive, destroy enemies, avoid falling eggs, collect gifts and food, and achieve the highest possible score.

The game includes multiple waves, increasing difficulty, power-ups, particle explosions, lives, score tracking, and boss battles.

---

## Game Objective

The objective of the game is to:

- Survive as long as possible
- Destroy enemy chickens
- Avoid falling eggs
- Collect gifts and power-ups
- Collect food for extra score
- Defeat boss enemies
- Achieve the highest score possible

As the level increases, enemies become stronger and the gameplay becomes more challenging.

---

## Controls

| Key | Action |
|---|---|
| `Enter` | Start the game |
| `Arrow Left` | Move left |
| `Arrow Right` | Move right |
| `Arrow Up` | Move up |
| `Arrow Down` | Move down |
| `Space` | Shoot |
| `R` | Restart after Game Over |

---

## Main Features

- Smooth spaceship movement
- Bullet shooting system
- Multiple enemy types
- Falling egg attacks
- Gifts and power-ups
- Laser weapon power-up
- Shield protection effect
- Food collection
- Lives system
- Score and high score system
- Boss battles
- Animated star background
- Explosion particle effects
- Wave progression
- Increasing difficulty over time

---

## Computer Graphics Concepts Used

### 1. Canvas Rendering

The game uses the HTML5 Canvas API to render the player, enemies, bullets, eggs, background, particles, gifts, and user interface.

### 2. Animation

A continuous game loop updates and redraws the game objects using `requestAnimationFrame()`.

### 3. 2D Coordinate System

All game objects are positioned using `x` and `y` coordinates on the canvas.

### 4. Transformations

The game uses translation and rotation. For example, falling eggs rotate while moving downward.

### 5. AABB Collision Detection

The game uses Axis-Aligned Bounding Box collision detection to detect overlaps between objects.

Collision detection is used for:

- Bullets and enemies
- Bullets and boss
- Eggs and player
- Gifts and player
- Food and player

### 6. Raster Graphics and Sprites

The game uses raster image sprites such as PNG and JPG for the player, enemies, background, eggs, bullets, and gifts.

### 7. Transparency and Alpha Channel

Transparency is used for shield effects and fading explosion particles.

### 8. Particle Effects

Particles are generated when enemies are destroyed or when collisions happen.

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
