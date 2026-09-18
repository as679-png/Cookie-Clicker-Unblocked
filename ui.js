// ui.js
import { buildings, upgrades } from './config.js';
import { state, getBuildingCost, getTotalCps, getClickValue, saveGame } from './state.js';

// Elements
const countEl = document.getElementById("count");
const unitEl = document.querySelector(".counter-unit");
const lifetimeEl = document.getElementById("lifetime");
const rateEl = document.getElementById("rate");
const clickValueEl = document.getElementById("clickValue");
const cookieBtn = document.getElementById("cookieBtn");
const shopList = document.getElementById("shopList");
const upgradeList = document.getElementById("upgradeList");

export function formatNum(n) {
  if (n < 1000) return Number.isInteger(n) ? String(n) : n.toFixed(1);
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx"];
  let i = -1; let v = n;
  while (v >= 1000 && i < units.length - 1) { v /= 1000; i++; }
  return v.toFixed(2) + units[i];
}

export function renderAll() {
  renderStats();
  renderShop();
  renderUpgrades();
}

function renderStats() {
  if (state.bossActive) {
    countEl.textContent = formatNum(Math.ceil(state.bossHp));
    const mins = Math.floor(state.bossTimeLeft / 60);
    const secs = Math.floor(state.bossTimeLeft % 60);
    unitEl.textContent = `HP remaining • Time left: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    rateEl.textContent = `⚔️ Boss Fight active! Dealing ${formatNum(getTotalCps())} DPS ⚔️`;
  } else {
    countEl.textContent = formatNum(Math.floor(state.cookies));
    unitEl.textContent = "cookies in the jar";
    const cps = getTotalCps();
    rateEl.textContent = cps > 0 ? `${formatNum(cps)} cookies / sec` : "nothing baking yet";
  }
  lifetimeEl.textContent = formatNum(Math.floor(state.lifetime));
  clickValueEl.textContent = formatNum(getClickValue());
}

function renderShop() {
  shopList.innerHTML = "";
  buildings.forEach((b) => {
    const cost = getBuildingCost(b);
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "shop-item";
    btn.disabled = state.cookies < cost;
    btn.innerHTML = `
      <span class="item-icon">${b.icon}</span>
      <span class="item-body">
        <span class="item-name">${b.name}</span>
        <span class="item-owned">Owned: ${state.owned[b.id]}</span>
      </span>
      <span class="item-buy"><span class="item-cost">${formatNum(cost)}</span></span>
    `;
    btn.addEventListener("click", () => {
      if (state.cookies < cost) return;
      state.cookies -= cost;
      state.owned[b.id] += 1;
      renderAll();
    });
    li.appendChild(btn);
    shopList.appendChild(li);
  });
}

function renderUpgrades() {
  upgradeList.innerHTML = "";
  upgrades.forEach((u) => {
    if (state.bought[u.id] || !u.requires(state)) return;
    const btn = document.createElement("button");
    btn.className = "upgrade-btn";
    btn.disabled = state.cookies < u.cost;
    btn.innerHTML = `${u.name}<span class="u-cost">${formatNum(u.cost)}</span>`;
    btn.addEventListener("click", () => {
      if (state.cookies < u.cost || state.bought[u.id]) return;
      state.cookies -= u.cost;
      state.bought[u.id] = true;
      u.apply(state);
      renderAll();
    });
    upgradeList.appendChild(btn);
  });
}

export function spawnFloatNumber(e, amount, isBossDamage) {
  const span = document.createElement("span");
  span.textContent = (isBossDamage ? "💥 -" : "+") + formatNum(amount);
  span.style.position = "absolute";
  span.style.left = (e.offsetX ?? cookieBtn.clientWidth / 2) + "px";
  span.style.top = (e.offsetY ?? cookieBtn.clientHeight / 2) + "px";
  span.style.pointerEvents = "none";
  span.style.fontWeight = "800";
  span.style.color = isBossDamage ? "#E1614B" : "#7C9A6E";
  span.style.fontFamily = "Fredoka, sans-serif";
  span.style.transition = "transform 0.6s ease, opacity 0.6s ease";
  span.style.transform = "translate(-50%, 0)";
  cookieBtn.appendChild(span);
  requestAnimationFrame(() => {
    span.style.transform = "translate(-50%, -40px)";
    span.style.opacity = "0";
  });
  setTimeout(() => span.remove(), 650);
}
