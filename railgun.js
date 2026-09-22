// Register player core requirement for EaglerForgeInjector
ModAPI.require("player");

var lightningCooldownTicks = 0;

ModAPI.addEventListener("update", function() {
    if (!ModAPI.player) return;

    // Cooldown handler using native loop ticks
    if (lightningCooldownTicks > 0) {
        lightningCooldownTicks--;
    }

    // Safely fetch what item the player is holding
    var heldItem = ModAPI.player.getHeldItem();
    
    // Check if the player is holding a Carrot on a Stick (ID 398)
    if (heldItem && heldItem.id === 398) {
        
        // Auto-label weapon so it says Lightning Railgun in your HUD hotbar
        if (heldItem.getDisplayName() !== "§b§lLightning Railgun") {
            heldItem.setStackDisplayName("§b§lLightning Railgun");
        }
        
        // NATIVELY check if the player right-clicks (uses) the carrot on a stick
        if (ModAPI.player.isUsingItem() && lightningCooldownTicks === 0) {
            lightningCooldownTicks = 20; // 1 second gap cooldown

            // Force the player engine to execute the lightning command relative to where they look
            ModAPI.player.sendChatMessage("/execute @p ~ ~ ~ summon LightningBolt ^ ^ ^30");
            
            // Play custom localized sound effect
            ModAPI.player.playSound("random.explode", 1.0, 1.0);
        }
    }
});
