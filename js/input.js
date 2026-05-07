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
