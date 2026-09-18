// state.js
import { SAVE_KEY, buildings, upgrades } from './config.js';

export let state = {
  cookies: 0, lifetime: 0, clickMult: 1,
  owned: {}, bought: {}, buildingMult: {},
  bossDefeated: false, bossActive: false, bossHp: 750, bossTimeLeft: 300
};

// Initialize default maps
buildings.forEach((b) => { state.owned[b.id] = 0; state.buildingMult[b.id] = 1; });
upgrades.forEach((u) => { state.bought[u.id] = false; });

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    Object.assign(state, JSON.parse(raw));
    buildings.forEach((b) => {
      if (!(b.id in state.owned)) state.owned[b.id] = 0;
      if (!(b.id in state.buildingMult)) state.buildingMult[b.id] = 1;
    });
    upgrades.forEach((u) => { if (!(u.id in state.bought)) state.bought[u.id] = false; });
  } catch (e) { console.warn("Could not load save", e); }
}

export function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } 
  catch (e) { console.warn("Could not save", e); }
}

export function getBuildingCost(b) {
  return Math.floor(b.baseCost * Math.pow(1.15, state.owned[b.id]));
}

export function getTotalCps() {
  return buildings.reduce((sum, b) => sum + state.owned[b.id] * b.cps * state.buildingMult[b.id], 0);
}

export function getClickValue() {
  return 1 * state.clickMult;
}
