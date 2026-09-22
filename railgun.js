
ModAPI.require("player");


ModAPI.addEventListener("sendchatmessage", function(event) {
    if (!ModAPI.player) return;

   
    if (event.message && event.message.trim().toLowerCase() === ".orbital") {
        
       
        event.preventDefault();

       
        ModAPI.player.sendChatMessage("/playsound random.explode @a ~ ~ ~ 1.0 1.0");

   
        ModAPI.player.sendChatMessage("/summon LightningBolt ~ ~ ~");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~5 ~ ~");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~-5 ~ ~");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~ ~ ~5");
        ModAPI.player.sendChatMessage("/summon LightningBolt ~ ~ ~-5");

     
        ModAPI.player.sendChatMessage("/summon PrimedTnt ~ ~40 ~");
        ModAPI.player.sendChatMessage("/summon PrimedTnt ~2 ~40 ~2");
        ModAPI.player.sendChatMessage("/summon PrimedTnt ~-2 ~40 ~-2");
    }
});
