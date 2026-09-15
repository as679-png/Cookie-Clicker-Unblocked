// Game State Core Engine Settings
let cookies = 0;
let totalCPS = 0;
let lifetimeCookies = 0;

// Golden Cookie Buff Engines
let clickMultiplier = 1;
let frenzyTimer = 0;

const upgrades = {
    cursor: { name: "Cursor", icon: "🖱️", count: 0, cost: 15, cps: 0.1 },
    grandma: { name: "Grandma", icon: "👵", count: 0, cost: 100, cps: 1 },
    farm: { name: "Farm", icon: "🌾", count: 0, cost: 1100, cps: 8 },
    factory: { name: "Factory", icon: "🏭", count: 0, cost: 12000, cps: 47 },
    bank: { name: "Bank", icon: "🏦", count: 0, cost: 130000, cps: 260 },
    portal: { name: "Portal", icon: "🌀", count: 0, cost: 1400000, cps: 1400 }
};

const unlockedAchievements = [];
const cookieBtn = document.getElementById('cookie-btn');
const leftSection = document.querySelector('.left-section');
const newsContent = document.getElementById('news-content');

// 1. HANDLING COOKIE MANUAL CLICKS
cookieBtn.addEventListener('mousedown', (e) => {
    // Add cookies factoring in standard click value * current frenzy active multiplier
    let baseGain = 1 * clickMultiplier;
    cookies += baseGain;
    lifetimeCookies += baseGain;
    
    createFloatingText(e.clientX, e.clientY, `+${baseGain}`);
    checkAchievements();
    updateUI();
});

function createFloatingText(x, y, text) {
    const textElement = document.createElement('div');
    textElement.className = 'floating-text';
    textElement.innerText = text;
    textElement.style.left = `${x - 10}px`;
    textElement.style.top = `${y - 20}px`;
    
    // Golden color text if multiplier buff is active
    if (clickMultiplier > 1) {
        textElement.style.color = "#f1c40f";
        textElement.style.fontSize = "1.8rem";
    }
    
    document.body.appendChild(textElement);
    setTimeout(() => textElement.remove(), 600);
}

// 2. PURCHASING SHOP INFRASTRUCTURE UPGRADES
function buyUpgrade(type) {
    const item = upgrades[type];
    
    if (lifetimeCookies >= item.cost && cookies >= item.cost) {
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
               (upgrades.factory.count * upgrades.factory.cps) +
               (upgrades.bank.count * upgrades.bank.cps) +
               (upgrades.portal.count * upgrades.portal.cps);
}

// 3. MODIFYING INFO NEWS DESCRIPTORS
function updateNewsTicker(type) {
    if (type === 'cursor') newsContent.innerText = "New clicking devices are automated.";
    if (type === 'grandma') newsContent.innerText = "Grandmas have arrived to help upscale batch baking.";
    if (type === 'farm') newsContent.innerText = "Huge chocolate-chip crop yield harvested today.";
    if (type === 'factory') newsContent.innerText = "Industrial cookie production operations look highly efficient.";
    if (type === 'bank') newsContent.innerText = "The Cookie Economy is booming. Vaults are filling up.";
    if (type === 'portal') newsContent.innerText = "A rift opens. Cookies flood in from alternate dimensions!";
}

// 4. MILESTONE EVALUATION FRAMEWORK
function checkAchievements() {
    if (cookies >= 1 && !unlockedAchievements.includes('ach-1')) {
        unlock('ach-1', "First cookie produced! Your bakery timeline begins.");
    }
    if (cookies >= 100 && !unlockedAchievements.includes('ach-100')) {
        unlock('ach-100', "100 cookies reached! Production rate increasing.");
    }
    if (cookies >= 10000 && !unlockedAchievements.includes('ach-10k')) {
        unlock('ach-10k', "10,000 cookies baked! Your brand is famous.");
    }
    if (cookies >= 1000000 && !unlockedAchievements.includes('ach-1m')) {
        unlock('ach-1m', "1,000,000 cookies! You are an interstellar industrialist.");
    }

    if (upgrades.cursor.count >= 1 && !unlockedAchievements.includes('ach-cursor')) {
        unlock('ach-cursor', "Achievement: Click Storm! You owned your first cursor.");
    }
    if (upgrades.grandma.count >= 1 && !unlockedAchievements.includes('ach-grandma')) {
        unlock('ach-grandma', "A dedicated Grandma joins the assembly line.");
    }
    if (upgrades.farm.count >= 1 && !unlockedAchievements.includes('ach-farm')) {
        unlock('ach-farm', "Achievement: Green Thumb! Your fields are blooming with cookies.");
    }
    if (upgrades.factory.count >= 1 && !unlockedAchievements.includes('ach-factory')) {
        unlock('ach-factory', "Achievement: Overproduction! Smog blocks out the sun.");
    }
    if (upgrades.bank.count >= 1 && !unlockedAchievements.includes('ach-bank')) {
        unlock('ach-bank', "Achievement: Millionaire! Interest accrued in chocolate chips.");
    }
    if (upgrades.portal.count >= 1 && !unlockedAchievements.includes('ach-portal')) {
        unlock('ach-portal', "Achievement: Multiverse Master! Realities are collapsing into sweetness.");
    }
}

function unlock(id, announcement) {
    unlockedAchievements.push(id);
    const badgeElement = document.getElementById(id);
    if (badgeElement) badgeElement.classList.remove('locked');
    newsContent.innerText = announcement;
}

// 5. INTERFACE STATE SYNCHRONIZATION RENDERER
function updateUI() {
    document.getElementById('cookie-count').innerText = `${Math.floor(cookies)} cookies`;
    document.getElementById('cps-count').innerText = `per second: ${totalCPS.toFixed(1)}`;

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

        if (cookies >= item.cost) {
            element.classList.remove('disabled');
        } else {
            element.classList.add('disabled');
        }
    }
}

// ==========================================
// 6. RANDOM SPAWNING GOLDEN COOKIE MECHANICS
// ==========================================
function spawnGoldenCookie() {
    // Avoid double spawning
    if (document.querySelector('.golden-cookie')) return;

    const golden = document.createElement('div');
    golden.className = 'golden-cookie';

    // Get boundaries of the left section clicking dashboard panel
    const rect = leftSection.getBoundingClientRect();
    
    // Position completely randomly inside the Left Dashboard constraints
    const randomX = Math.random() * (rect.width - 90) + rect.left;
    const randomY = Math.random() * (rect.height - 90) + rect.top;

    golden.style.left = `${randomX}px`;
    golden.style.top = `${randomY}px`;

    // Click trigger behavior
    golden.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // Avoid triggering standard cookie click behind it
        
        // Dynamic payout reward calculation: 15% of bank stash + 15 base cookies minimum
        let rawBonus = Math.floor(cookies * 0.15) + 15;
        cookies += rawBonus;
        lifetimeCookies += rawBonus;

        // Activate 100x Click frenzy modifier flag
        clickMultiplier = 100;
        frenzyTimer = 20; // 20 Seconds duration counter
        
        leftSection.classList.add('frenzy-active');
        newsContent.innerText = `Golden Cookie Clicked! Earned +${rawBonus} cookies and 100x CLICK BOOST for 20s!`;
        
        createFloatingText(e.clientX, e.clientY, `+${rawBonus} & 100x Boost!`);
        golden.remove();
        updateUI();
    });

    document.body.appendChild(golden);

    // Despawn golden cookie automatically if ignored for 12 seconds
    setTimeout(() => {
        if (document.body.contains(golden)) {
            golden.remove();
        }
    }, 12000);
}

// Engine core random timing clock loop loop checker (evaluates conditions every single second)
setInterval(() => {
    // Handling tracking ticking down active boost timers
    if (frenzyTimer > 0) {
        frenzyTimer--;
        if (frenzyTimer === 0) {
            clickMultiplier = 1;
            leftSection.classList.remove('frenzy-active');
            newsContent.innerText = "News: Your clicking multiplier frenzy has faded.";
        }
    }

    // 2.5% chance to spawn a golden cookie every single second (Ranges from instantly up to a few minutes)
    if (Math.random() < 0.025) {
        spawnGoldenCookie();
    }
}, 1000);

// Main Base CPS Automatic Income Time Interval Thread Execution (Loops every 100 milliseconds)
setInterval(() => {
    cookies += (totalCPS / 10);
    if (totalCPS > 0) {
        lifetimeCookies += (totalCPS / 10);
    }
    checkAchievements();
    updateUI();
}, 100);
