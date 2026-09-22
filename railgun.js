// Register metadata natively to EaglerForgeInjector's ModAPI core
ModAPI.registerMod("LightningRailgun", "1.0.0", "Community");

var lightningCooldownTicks = 0;

ModAPI.addEventListener("update", function() {
    // Access the core internal Minecraft client instance safely
    if (typeof Minecraft === 'undefined' || !Minecraft.getMinecraft() || !Minecraft.getMinecraft().thePlayer) return;
    
    var mc = Minecraft.getMinecraft();
    var player = mc.thePlayer;

    // Tick-down handle using native engine update frames
    if (lightningCooldownTicks > 0) {
        lightningCooldownTicks--;
    }

    // Access the raw held item stack safely
    if (player.inventory && player.inventory.getCurrentItem()) {
        var heldStack = player.inventory.getCurrentItem();
        
        // Check for Carrot on a Stick
        if (heldStack.getItem && heldStack.getItem().getUnlocalizedName() && heldStack.getItem().getUnlocalizedName().includes("carrotOnAStick")) {
            
            // Forces visual hotbar name injection
            heldStack.setStackDisplayName("§b§lLightning Railgun");

            // Bulletproof right-click check using the native game keybind status
            if (mc.gameSettings.keyBindUseItem.isKeyDown() && lightningCooldownTicks === 0) {
                lightningCooldownTicks = 20; // 1-second gap cooldown

                // Natively triggers local thread client command engine execution with strict 1.8.8 casing
                player.sendChatMessage("/execute @p ~ ~ ~ summon LightningBolt ~ ~ ~15");
                
                // Play standard explosion audio at the player coordinates
                player.playSound("random.explode", 1.0, 1.0);
            }
        }
    }
});
