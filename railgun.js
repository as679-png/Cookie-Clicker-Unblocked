// Register player core requirement for EaglerForgeInjector
ModAPI.require("player");

var lightningCooldownTicks = 0;
var isClickingRight = false;

// Global browser listener to catch right mouse button clicks securely
window.addEventListener("mousedown", function(e) {
    if (e.button === 2) { // 2 = Right Click
        isClickingRight = true;
    }
});

window.addEventListener("mouseup", function(e) {
    if (e.button === 2) {
        isClickingRight = false;
    }
});

ModAPI.addEventListener("update", function() {
    if (!ModAPI.player) return;

    // Cooldown handler using native loop ticks
    if (lightningCooldownTicks > 0) {
        lightningCooldownTicks--;
    }

    var heldItem = ModAPI.player.getHeldItem();
    
    // Check if the player is holding a Carrot on a Stick (ID 398)
    if (heldItem && heldItem.id === 398) {
        
        // Auto-label weapon so it says Railgun in your HUD hotbar
        if (heldItem.getDisplayName() !== "§b§lLightning Railgun") {
            heldItem.setStackDisplayName("§b§lLightning Railgun");
        }
        
        // Execute when right click is pressed down and cooldown is empty
        if (isClickingRight && lightningCooldownTicks === 0) {
            lightningCooldownTicks = 20; // 1 second gap cooldown

            // Tells the local game engine to execute the lightning strike summon command
            // This casts lightning instantly at your exact crosshair coordinate boundary blocks
            ModAPI.player.sendChatMessage("/execute @p ~ ~ ~ summon LightningBolt ^ ^ ^30");
            
            // Back up explosion sound effect
            ModAPI.player.playSound("random.explode", 1.0, 1.0);
        }
    }
});
