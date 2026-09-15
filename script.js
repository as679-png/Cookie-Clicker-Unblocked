let cookies = 0;
let totalCPS = 0;

const upgrades = {
    cursor: { count: 0, cost: 15, cps: 0.1 },
    grandma: { count: 0, cost: 100, cps: 1 },
    farm: { count: 0, cost: 1100, cps: 8 },
    factory: { count: 0, cost: 12000, cps: 47 }
};

const unlockedAchievements = [];

const cookieBtn = document.getElementById('cookie-btn');
const leftColumn = document.querySelector('.left-column');
const newsContent = document.getElementById('news-content');

// 1. CLICK COOKIE ACTION
cookieBtn.addEventListener('mousedown', (e) => {
    cookies += 1;
    createFloatingText(e.clientX, e.clientY);
    checkAchievements();
    updateUI();
});

function createFloatingText(x, y) {
    const num = document.createElement('div');
    num.className = 'floating-text';
    num.innerText = '+1';
    num.style.left = `${x - 10}px`;
    num.style.top = `${y - 20}px`;
    
    document.body.appendChild(num);
    setTimeout(() => num.remove(), 700);
}

// 2. BUY BUILDINGS
function buyUpgrade(type) {
    const item = upgrades[type];
    if (cookies >= item.cost) {
        cookies -= item.cost;
        item.count++;
        item.cost = Math.ceil(item.cost * 1.15);
        
        calculateCPS();
        checkAchievements();
        updateNewsTicker(type);
        updateUI();
    }
}

function calculateCPS() {
    totalCPS = (upgrades.cursor.count * upgrades.cursor.cps) +
               (upgrades.grandma.count * upgrades.grandma.cps) +
               (upgrades.farm.count * upgrades.farm.cps) +
               (upgrades.factory.count * upgrades.factory.cps);
}

// 3. RUNTIME TICKER UPDATES
function updateNewsTicker(type) {
    if (type === 'cursor') newsContent.innerText = "News: New clicker items are clicking on their own accord.";
    if (type === 'grandma') newsContent.innerText = "News: Local grandmas agree that your cookie batter is decent.";
    if (type === 'farm') newsContent.innerText = "News: Cookie farms harvest their first chocolate-chip fields.";
    if (type === 'factory') newsContent.innerText = "News: Industrial production scales. Smog smells delicious.";
}

// 4. ACHIEVEMENTS CHECKER
function checkAchievements() {
    if (cookies >= 1 && !unlockedAchievements.includes('ach-1')) {
        unlock('ach-1', "News: First cookie baked! Your legacy begins.");
    }
    if (cookies >= 100 && !unlockedAchievements.includes('ach-100')) {
        unlock('ach-100', "News: 100 cookies achieved! The kitchen is heating up.");
    }
    if (upgrades.grandma.count >= 1 && !unlockedAchievements.includes('ach-grandma')) {
        unlock('ach-grandma', "News: Hired a Grandma! She brought extra rolling pins.");
    }
}

function unlock(id, newsMessage) {
    unlockedAchievements.push(id);
    const element = document.getElementById(id);
    if (element) element.classList.remove('locked');
    newsContent.innerText = newsMessage;
}

// 5. RENDER SYSTEM
function updateUI() {
    document.getElementById('cookie-count').innerText = `${Math.floor(cookies)} cookies`;
    document.getElementById('cps-count').innerText = `per second: ${totalCPS.toFixed(1)}`;

    for (let key in upgrades) {
        const item = upgrades[key];
        const element = document.getElementById(`item-${key}`);
        document.getElementById(`cost-${key}`).innerText = item.cost;
        document.getElementById(`count-${key}`).innerText = item.count;

        if (cookies >= item.cost) {
            element.classList.remove('disabled');
        } else {
            element.classList.add('disabled');
        }
    }
}

// GAME INTERNAL LOOP
setInterval(() => {
    cookies += (totalCPS / 10);
    checkAchievements();
    updateUI();
}, 100);
