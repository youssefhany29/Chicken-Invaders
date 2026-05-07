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

    drawBase(ctx) {
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

    draw(ctx) {
        this.drawBase(ctx);

        if (this.hitFlash > 0) {
            ctx.save();
            ctx.globalAlpha = 0.35;

            if (this.type === 'elusive_green') ctx.fillStyle = '#66ff66';
            else if (this.type === 'red') ctx.fillStyle = '#ff9999';
            else if (this.type === 'metal') ctx.fillStyle = '#fff1a8';
            else ctx.fillStyle = '#ffffff';

            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();

            this.hitFlash--;
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

    drawBase(ctx) {
        if (img_elusive_green_chicken.complete && img_elusive_green_chicken.naturalWidth !== 0) {
            ctx.drawImage(img_elusive_green_chicken, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'purple'; ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    draw(ctx) {
        this.drawBase(ctx);

        if (this.hitFlash > 0) {
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#aaffaa';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
            this.hitFlash--;
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
