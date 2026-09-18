// main.js
import { state, loadGame, saveGame, getTotalCps, getClickValue } from './state.js';
import { renderAll, spawnFloatNumber } from './ui.js';

const cookieBtn = document.getElementById("cookieBtn");
const resetBtn = document.getElementById("resetBtn");

function tapCookie(e) {
  const gain = getClickValue();
  
  if (state.bossActive) {
    state.bossHp -= gain;
    spawnFloatNumber(e, gain, true);
    if (state.bossHp <= 0) winBossFight();
  } else {
    state.cookies += gain;
    state.lifetime += gain;
    spawnFloatNumber(e, gain, false);
    checkBossTrigger();
  }
  renderAll();
}

function checkBossTrigger() {
  if (!state.bossDefeated && !state.bossActive && state.lifetime >= 750) {
    state.bossActive = true;
    state.bossHp = 750;
    state.bossTimeLeft = 300;
    alert("⚠️ A giant hungry boss approaches! Stop it from eating your cookies within 5 minutes!");
  }
}

function winBossFight() {
  state.bossActive = false;
  state.bossDefeated = true;
  state.cookies += 500;
  state.lifetime += 500;
  alert("🎉 Victory! You defeated the boss and salvaged 500 cookies!");
  renderAll();
}

function loseBossFight() {
  state.bossActive = false;
  const penalty = Math.floor(state.cookies * 0.20);
  state.cookies = Math.max(0, state.cookies - penalty);
  alert(`😭 Time's up! The boss devoured your progress and stole ${penalty} cookies.`);
  state.lifetime = 700; // Drop back slightly so they can retry soon
  renderAll();
}

// --- Main Loops ---
let lastTick = performance.now();
function tick(now) {
  const dt = (now - lastTick) / 1000;
  lastTick = now;
  
  if (state.bossActive) {
    state.bossTimeLeft -= dt;
    const damage = getTotalCps() * dt;
    if (damage > 0) state.bossHp -= damage;
    if (state.bossHp <= 0) winBossFight();
    if (state.bossTimeLeft <= 0) loseBossFight();
    renderAll();
  } else {
    const gain = getTotalCps() * dt;
    if (gain > 0) {
      state.cookies += gain;
      state.lifetime += gain;
      checkBossTrigger();
      renderAll();
    }
  }
  requestAnimationFrame(tick);
}

// --- Initialization ---
cookieBtn.addEventListener("click", tapCookie);
resetBtn.addEventListener("click", () => {
  if (confirm("Start over? Clears all progress.")) {
    localStorage.clear();
    location.reload();
  }
});

window.addEventListener("beforeunload", saveGame);
setInterval(saveGame, 8000);

loadGame();
renderAll();
requestAnimationFrame((t) => { lastTick = t; requestAnimationFrame(tick); });
