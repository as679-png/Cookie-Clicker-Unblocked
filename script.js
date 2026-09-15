// Game Core State Settings
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
const newsContent = document.getElementById('news-content');

// 1. Handling Cookie Manual Clicks
cookieBtn.addEventListener('mousedown', (e) => {
    cookies += 1;
    createFloatingText(e.clientX, e.clientY);
    checkAchievements();
    updateUI();
});

function createFloatingText(x, y) {
    const textElement = document.createElement('div');
    textElement.className = 'floating-text';
    textElement.innerText = '+1';
    textElement.style.left = `${x - 10}px`;
    textElement.style.top = `${y - 20}px`;
    
    document.body.appendChild(textElement);
    setTimeout(() => textElement.remove(), 600);
}

// 2. Purchasing Shop Infrastructure Upgrades
function buyUpgrade(type) {
    const item = upgrades[type];
    if (cookies >= item.cost) {
        cookies -= item.cost;
        item.count++;
        item.cost = Math.ceil(item.cost * 1.15); // Scale price up inflation tracking
        
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

// 3. Modifying Info News Descriptors
function updateNewsTicker(type) {
    if (type === 'cursor') newsContent.innerText = "New clicking devices are automated.";
    if (type === 'grandma') newsContent.innerText = "Grandmas have arrived to help upscale batch baking.";
    if (type === 'farm') newsContent.innerText = "Huge chocolate-chip crop yield harvested today.";
    if (type === 'factory') newsContent.innerText = "Industrial cookie production operations look highly efficient.";
}

// 4. Milestone Evaluation Framework
function checkAchievements() {
    if (cookies >= 1 && !unlockedAchievements.includes('ach-1')) {
        unlock('ach-1', "First cookie produced! Your bakery timeline begins.");
    }
    if (cookies >= 100 && !unlockedAchievements.includes('ach-100')) {
        unlock('ach-100', "100 cookies reached! Production rate increasing.");
    }
    if (upgrades.grandma.count >= 1 && !unlockedAchievements.includes('ach-grandma')) {
        unlock('ach-grandma', "A dedicated Grandma joins the assembly line.");
    }
}

function unlock(id, announcement) {
    unlockedAchievements.push(id);
    const badgeElement = document.getElementById(id);
    if (badgeElement) badgeElement.classList.remove('locked');
    newsContent.innerText = announcement;
}

// 5. Interface State Synchronization Renderer
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

// Main Time Interval Thread Execution (Loops every 100 milliseconds)
setInterval(() => {
    cookies += (totalCPS / 10);
    checkAchievements();
    updateUI();
}, 100);
