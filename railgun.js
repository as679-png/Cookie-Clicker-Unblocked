// Register player core requirement for EaglerForgeInjector
ModAPI.require("player");

// Listen directly to messages before they are processed by the server
ModAPI.addEventListener("sendchatmessage", function(event) {
    if (!ModAPI.player) return;

    // Check if the player exactly types ".orbital" in chat
    if (event.message.trim().toLowerCase() === ".orbital") {
        
        // STOP the message from actually showing up in the public chat box
        event.preventDefault = true;

        // Play the explosive audio cue at your location
        ModAPI.player.playSound("random.explode", 1.0, 1.0);

        // Core 1.8.8 Loop: Rains down 5 massive case-sensitive lightning bolts
        // Spawns them in a cross pattern around your current coordinates
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
