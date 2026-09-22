// Register metadata natively to EaglerForgeInjector's ModAPI core
ModAPI.registerMod("LightningRailgun", "1.0.0", "Community");

var lightningCooldownTicks = 0;

ModAPI.addEventListener("update", function() {
    // Access the core internal Minecraft client instance safely
    if (typeof Minecraft === 'undefined' || !Minecraft.getMinecraft() || !Minecraft.getMinecraft().thePlayer) return;
    
    var player = Minecraft.getMinecraft().thePlayer;

    // Tick-down handle using native engine update frame drops
    if (lightningCooldownTicks > 0) {
        lightningCooldownTicks--;
    }

    // Access the raw held item stack using the native inventory index array
    if (player.inventory && player.inventory.getCurrentItem()) {
        var heldStack = player.inventory.getCurrentItem();
        
        // 398 is the hard network item ID for a Carrot on a Stick
        if (heldStack.getItem && heldStack.getItem().getUnlocalizedName() && heldStack.getItem().getUnlocalizedName().includes("carrotOnAStick")) {
            
            // Forces visual hotbar name injection
            heldStack.setStackDisplayName("§b§lLightning Railgun");

            // Catch native item usage right-click trigger status
            if (player.isUsingItem() && lightningCooldownTicks === 0) {
                lightningCooldownTicks = 25; // 1.25-second balance gap

                // Natively triggers local thread client command engine execution with strict 1.8.8 casing
                player.sendChatMessage("/execute @p ~ ~ ~ summon LightningBolt ~ ~ ~15");
                
                // Play standard fallback explosion audio at the player coordinates
                player.playSound("random.explode", 1.0, 1.0);
            }
        }
    }
});
