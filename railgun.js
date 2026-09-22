// Register player core requirement for EaglerForgeInjector
ModAPI.require("player");

// Listen directly to messages before they are processed by the server
ModAPI.addEventListener("sendchatmessage", function(event) {
    if (!ModAPI.player) return;

    // Check if the player exactly types ".orbital" in chat
    if (event.message && event.message.trim().toLowerCase() === ".orbital") {
        
        // CORRECT WAY TO CANCEL: Call it as a function to drop the message securely
        event.preventDefault();

        // Safe sound execution: Uses standard client entity triggers to prevent string splitting errors
        if (typeof Minecraft !== 'undefined' && Minecraft.getMinecraft().thePlayer) {
            Minecraft.getMinecraft().thePlayer.playSound("random.explode", 1.0, 1.0);
        }

        // Core 1.8.8 Loop: Rains down 5 massive case-sensitive lightning bolts
        ModAPI.player.sendChatMessage("/summon LightningBolt ~ ~ ~");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~5 ~ ~");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~-5 ~ ~");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~ ~ ~5");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~ ~ ~-5");

        // Force a cluster of explosive TNT to drop from 40 blocks high
        ModAPI.player.sendChatMessage("/summon PrimedTnt ~ ~40 ~");
        ModAPI.player.sendChatMessage("/summon PrimedTnt ~2 ~40 ~2");
        ModAPI.player.sendChatMessage("/summon PrimedTnt ~-2 ~40 ~-2");
    }
});
