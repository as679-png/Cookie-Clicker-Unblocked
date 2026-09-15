// Core Game Engine Data
let cookies = 0;
let totalCPS = 0;

const upgrades = {
    cursor: { count: 0, cost: 15, cps: 0.1, domId: 'cursor' },
    grandma: { count: 0, cost: 100, cps: 1, domId: 'grandma' },
    bakery: { count: 0, cost: 1100, cps: 8, domId: 'bakery' }
};

const cookieBtn = document.getElementById('cookie-btn');
const clickArea = document.getElementById('click-area');
const clickSound = document.getElementById('click-sound');

// Click Action & Pop-up Effect
cookieBtn.addEventListener('mousedown', (e) => {
    cookies += 1;
    createFloatingText(e.clientX, e.clientY);
    playClickSound();
    updateUI();
});

// Audio Trigger Function
function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0; // Rewind sound back to start so rapid clicks work
        clickSound.play().catch(err => console.log("Audio play delayed until user interacts."));
    }
}

function createFloatingText(x, y) {
    const num = document.createElement('div');
    num.className = 'floating-text';
    num.innerText = '+1';
    num.style.left = `${x - 15}px`;
    num.style.top = `${y - 25}px`;
    
    clickArea.appendChild(num);
    setTimeout(() => num.remove(), 800);
}

// Shop Purchase Logic
function buyUpgrade(type) {
    const item = upgrades[type];
    if (cookies >= item.cost) {
        cookies -= item.cost;
        item.count++;
        item.cost = Math.ceil(item.cost * 1.15); // Dynamic item inflation scale
        calculateCPS();
        updateUI();
    }
}

function calculateCPS() {
    totalCPS = (upgrades.cursor.count * upgrades.cursor.cps) +
               (upgrades.grandma.count * upgrades.grandma.cps) +
               (upgrades.bakery.count * upgrades.bakery.cps);
}

// UI Synchronization Engine
function updateUI() {
    document.getElementById('cookie-count').innerText = `${Math.floor(cookies)} cookies`;
    document.getElementById('cps-count').innerText = `per second: ${totalCPS.toFixed(1)}`;

    // Check store items affordability statuses
    for (let key in upgrades) {
        const item = upgrades[key];
        const element = document.getElementById(`item-${item.domId}`);
        document.getElementById(`cost-${item.domId}`).innerText = item.cost;
        document.getElementById(`count-${item.domId}`).innerText = item.count;

        if (cookies >= item.cost) {
            element.classList.remove('disabled');
            element.classList.add('affordable');
        } else {
            element.classList.remove('affordable');
            element.classList.add('disabled');
        }
    }
}

// Internal Clock Loop (Runs every 100 milliseconds for fluid score tracking)
setInterval(() => {
    cookies += (totalCPS / 10);
    updateUI();
}, 100);
