// Game Core Variables
let cookies = 0;
let totalCPS = 0;
let lifetimeCookies = 0;

// Click Core Parameters
let baseClickValue = 1;
let clickUpgradeCost = 2;
let clickUpgradeCount = 0;

// Golden Cookie System Engine
let goldenMultiplier = 1;
let frenzyTimer = 0;
const FRENZY_MAX_DURATION = 20;

// BOSS FIGHT INSTANCE PARAMETERS
let bossActive = false;
let bossHP = 750;
const BOSS_MAX_HP = 750;
let bossTimeLeft = 600; // 10 Minutes in seconds
let bossTimerInterval = null;

const upgrades = {
    cursor: { name: "Cursor", icon: "🖱️", count: 0, cost: 15, cps: 0.1 },
    grandma: { name: "Grandma", icon: "👵", count: 0, cost: 100, cps: 1 },
    farm: { name: "Farm", icon: "🌾", count: 0, cost: 1100, cps: 8 },
    factory: { name: "Factory", icon: "🏭", count: 0, cost: 12000, cps: 47 },
    bank: { name: "Bank", icon: "🏦", count: 0, cost: 130000, cps: 260 },
    temple: { name: "Temple", icon: "🏛️", count: 0, cost: 1000000, cps: 1400 },
    portal: { name: "Portal", icon: "🌀", count: 0, cost: 14000000, cps: 7800 },
    timeMachine: { name: "Time Machine", icon: "⏳", count: 0, cost: 170000000, cps: 44000 }
};

const unlockedAchievements = [];
const cookieBtn = document.getElementById('cookie-btn');
const leftSection = document.querySelector('.left-section');
const newsContent = document.getElementById('news-content');
const frenzyBarWrap = document.getElementById('frenzy-bar-wrap');
const frenzyBar = document.getElementById('frenzy-bar');

// 1. CLICK COOKIE CORE LOGIC
cookieBtn.addEventListener('mousedown', (e) => {
    if (bossActive) {
        // If a Boss is active, manual clicks deal damage instead of earning points
        damageBoss();
    } else {
        let clickPayout = baseClickValue * goldenMultiplier;
        cookies += clickPayout;
        lifetimeCookies += clickPayout;
        createFloatingText(e.clientX, e.clientY, `+${clickPayout}`);
    }
    checkAchievements();
    updateUI();
});

function createFloatingText(x, y, text, customColor = null) {
    const textElement = document.createElement('div');
    textElement.className = 'floating-text';
    textElement.innerText = text;
    textElement.style.left = `${x - 10}px`;
    textElement.style.top = `${y - 20}px`;
    
    if (customColor) {
        textElement.style.color = customColor;
    } else if (goldenMultiplier > 1) {
        textElement.style.color = "#f1c40f";
    }
    
    document.body.appendChild(textElement);
    setTimeout(() => textElement.remove(), 500);
}

// 2. PURCHASE UPGRADES
function buyClickUpgrade() {
    if (cookies >= clickUpgradeCost) {
        cookies -= clickUpgradeCost;
        clickUpgradeCount++;
        baseClickValue *= 2;
        clickUpgradeCost *= 2;
        newsContent.innerText = `Upgrade! Manual clicks now yield x${baseClickValue} cookies!`;
        updateUI();
    }
}

function buyUpgrade(type) {
    const item = upgrades[type];
    if (lifetimeCookies >= item.cost && cookies >= item.cost) {
        cookies -= item.cost;
        item.count++;
        item.cost = Math.ceil(item.cost * 1.15);
        calculateCPS();
        updateUI();
    }
}

function calculateCPS() {
    totalCPS = 0;
    for (let key in upgrades) {
        totalCPS += upgrades[key].count * upgrades[key].cps;
    }
}

// 3. BOSS CONFLICT CONTROLLER ENGINE
function startBossFight() {
    if (bossActive) return;
    bossActive = false; // Reset setup flags
    bossActive = true;
    bossHP = BOSS_MAX_HP;
    bossTimeLeft = 600; // 10 minutes
    
    document.getElementById('boss-overlay').style.display = 'block';
    newsContent.innerText = "⚠️ THE OVERSEER HAS BLOCKED REGULAR PRODUCTION! CLICK THE COOKIE TO DESTROY HIM!";
    updateBossUI();

    bossTimerInterval = setInterval(() => {
        bossTimeLeft--;
        
        // Format time string
        let mins = Math.floor(bossTimeLeft / 60);
        let secs = bossTimeLeft % 60;
        document.getElementById('boss-timer').innerText = `Time Left: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (bossTimeLeft <= 0) {
            failBossFight();
        }
    }, 1000);
}

function damageBoss() {
    bossHP--;
    updateBossUI();
    
    // Spawn floating damage text over mouse coordinates
    let randomX = window.innerWidth / 4; // Approximating Left Dashboard boundaries
    let randomY = window.innerHeight / 2;
    createFloatingText(randomX, randomY, "💥 CRIT!", "#ff4757");

    if (bossHP <= 0) {
        winBossFight();
    }
}

function updateBossUI() {
    let pct = (bossHP / BOSS_MAX_HP) * 100;
    document.getElementById('boss-hp-bar').style.width = `${pct}%`;
    document.getElementById('boss-hp-text').innerText = `${bossHP} / ${BOSS_MAX_HP} CLICKS`;
}

function winBossFight() {
    clearInterval(bossTimerInterval);
    bossActive = false;
    document.getElementById('boss-overlay').style.display = 'none';
    
    // Award 5,000 cookies bounty prize
    cookies += 5000;
    lifetimeCookies += 5000;
    
    unlock('ach-boss', "🏆 DEFEATED THE OVERSEER! You earned a massive bounty of 5,000 cookies!");
    updateUI();
}

function failBossFight() {
    clearInterval(bossTimerInterval);
    bossActive = false;
    document.getElementById('boss-overlay').style.display = 'none';
    
    // Penalize half of the current cookies stash
    cookies = Math.floor(cookies / 2);
    newsContent.innerText = "💀 TIME EXPIRED! The Overseer absorbed 50% of your cookie vaults.";
    updateUI();
}

// 4. SECRET OWNER ACCESS AND MANAGEMENT
function openOwnerMenu() {
    let keyInput = prompt("🔑 ENTER SYSTEM KEY PHRASE:");
    if (keyInput === "COOKIEOVERLORD") {
        document.getElementById('owner-modal').style.display = 'flex';
    } else if (keyInput !== null) {
        alert("❌ ACCESS DENIED: INVALID PRIVILEGE LEVEL.");
    }
}

function closeOwnerMenu() {
    document.getElementById('owner-modal').style.display = 'none';
}

function cheatCookies(amount) {
    cookies += amount;
    lifetimeCookies += amount;
    newsContent.innerText = `[CHEAT]: Injected +${amount} cookies into the system.`;
    updateUI();
}

function cheatEvent(type) {
    closeOwnerMenu();
    if (type === 'golden') {
        spawnGoldenCookie();
    } else if (type === 'boss') {
        startBossFight();
    }
}

// 5. MILESTONE CHECKER
function checkAchievements() {
    if (cookies >= 1 && !unlockedAchievements.includes('ach-1')) unlock('ach-1', "First cookie produced!");
    if (cookies >= 100 && !unlockedAchievements.includes('ach-100')) unlock('ach-100', "100 cookies reached!");
}

function unlock(id, msg) {
    if (unlockedAchievements.includes(id)) return;
    unlockedAchievements.push(id);
    const el = document.getElementById(id);
    if (el) el.classList.remove('locked');
    newsContent.innerText = msg;
}

// 6. GENERAL UI SYSTEM SYNCHRONIZER
function updateUI() {
    document.getElementById('cookie-count').innerText = `${Math.floor(cookies)} cookies`;
    document.getElementById('cps-count').innerText = `per second: ${totalCPS.toFixed(1)}`;

    document.getElementById('cost-clickUpgrade').innerText = clickUpgradeCost;
    document.getElementById('count-clickUpgrade').innerText = clickUpgradeCount;
    
    const clickItemRow = document.getElementById('item-clickUpgrade');
    if (cookies >= clickUpgradeCost) clickItemRow.classList.remove('disabled');
    else clickItemRow.classList.add('disabled');

    for (let key in upgrades) {
        const item = upgrades[key];
        const element = document.getElementById(`item-${key}`);
        const titleEl = document.getElementById(`title-${key}`);
        const iconEl = document.getElementById(`icon-${key}`);
        
        document.getElementById(`cost-${key}`).innerText = item.cost;
        document.getElementById(`count-${key}`).innerText = item.count;

        if (lifetimeCookies < item.cost && item.count === 0) {
            element.classList.add('mystery');
            titleEl.innerText = "???";
            iconEl.innerText = "❓";
        } else {
            element.classList.remove('mystery');
            titleEl.innerText = item.name;
            iconEl.innerText = item.icon;
        }

        if (cookies >= item.cost) element.classList.remove('disabled');
        else element.classList.add('disabled');
    }
}

// 7. GOLDEN COOKIE LOGIC
function spawnGoldenCookie() {
    if (document.querySelector('.golden-cookie') || bossActive) return;

    const golden = document.createElement('div');
    golden.className = 'golden-cookie';
    const rect = leftSection.getBoundingClientRect();
    
    const randomX = Math.random() * (rect.width - 90) + rect.left;
    const randomY = Math.random() * (rect.height - 90) + rect.top;

    golden.style.left = `${randomX}px`;
    golden.style.top = `${randomY}px`;

    golden.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        let rawBonus = Math.floor(cookies * 0.15) + 15;
        cookies += rawBonus;
        lifetimeCookies += rawBonus;

        goldenMultiplier = 100;
        frenzyTimer = FRENZY_MAX_DURATION;
        
        frenzyBarWrap.style.display = 'block';
        leftSection.classList.add('frenzy-active');
        newsContent.innerText = `Golden Cookie Captured! 100x CLICK BOOST activated!`;
        
        golden.remove();
        updateUI();
    });

    document.body.appendChild(golden);
    setTimeout(() => { if (document.body.contains(golden)) golden.remove(); }, 12000);
}

// Timers / Intervals
setInterval(() => {
    if (frenzyTimer > 0) {
        frenzyTimer--;
        let pctRemaining = (frenzyTimer / FRENZY_MAX_DURATION) * 100;
        frenzyBar.style.width = `${pctRemaining}%`;

        if (frenzyTimer === 0) {
            goldenMultiplier = 1;
            frenzyBarWrap.style.display = 'none';
            leftSection.classList.remove('frenzy-active');
        }
    }

    // 1% random chance to trigger an explicit Overseer boss invasion if the user passes a score threshold of 200 cookies
