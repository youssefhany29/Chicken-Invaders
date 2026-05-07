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
                    
                    if (!shieldSpawnedThisLevel && dropChance < 0.04) {
                        gifts.push(new Gift(enemy.x, enemy.y, 'shield'));
                        shieldSpawnedThisLevel = true; 
                    } 
                    else if (laserSpawnedThisLevel < 1 && dropChance < 0.10) { 
                        gifts.push(new Gift(enemy.x, enemy.y, 'laser')); 
                        laserSpawnedThisLevel++;
                    } 
                    else if (normalSpawnedThisLevel < 1 && dropChance < 0.20) { 
                        gifts.push(new Gift(enemy.x, enemy.y, 'normal')); 
                        normalSpawnedThisLevel++;
                    } 
                    else if (dropChance < 0.40) {
                        foods.push(new Food(enemy.x, enemy.y)); 
                    }
                    
                    score += 10 * level;
                }
            }
        });
    });

    eggs.forEach(egg => {
        if (!egg.markedForDeletion && checkPlayerEggCollision(egg, player)) {            egg.markedForDeletion = true; 
            
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

        if (star.y > canvas.height) { 
            star.y = 0; 
            star.x = Math.random() * canvas.width; 
        }
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
