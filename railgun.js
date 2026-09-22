// EaglerForge Railgun Mod
var railgunCooldown = false;

// Listens to every game tick (20 times per second)
ModAPI.addEventListener("update", function() {
    // Check if the player is holding a Carrot on a Stick and clicking right mouse button
    if (ModAPI.player.getCurrentEquippedItem() && ModAPI.player.getCurrentEquippedItem().id === 398) { // 398 is Carrot on a Stick
        if (ModAPI.player.isUsingItem() && !railgunCooldown) {
            
            railgunCooldown = true;
            
            // Fire Sound (Thunder strike sound)
            ModAPI.player.playSound("ambient.weather.thunder", 1.0, 1.0);
            
            // Raycast Configuration
            var maxDistance = 40; // Max range of railgun
            var step = 0.5; // Precision step
            
            var posX = ModAPI.player.x;
            var posY = ModAPI.player.y + ModAPI.player.getEyeHeight();
            var posZ = ModAPI.player.z;
            
            // Get player's look vector angles
            var yaw = ModAPI.player.yaw;
            var pitch = ModAPI.player.pitch;
            
            // Calculate look direction math formulas
            var angleYaw = (yaw + 90) * (Math.PI / 180);
            var anglePitch = -pitch * (Math.PI / 180);
            
            var dirX = Math.cos(anglePitch) * Math.cos(angleYaw);
            var dirY = Math.sin(anglePitch);
            var dirZ = Math.cos(anglePitch) * Math.sin(angleYaw);
            
            // Project the beam line forward
            for (var d = 0; d < maxDistance; d += step) {
                var beamX = posX + (dirX * d);
                var beamY = posY + (dirY * d);
                var beamZ = posZ + (dirZ * d);
                
                // Spawn tracer beam particles (Crit particles)
                ModAPI.display.spawnParticle("crit", beamX, beamY, beamZ, 0, 0, 0);
                
                // Get all nearby entities along the beam line
                var targets = ModAPI.world.getEntitiesWithinAABB(beamX - 0.5, beamY - 0.5, beamZ - 0.5, beamX + 0.5, beamY + 0.5, beamZ + 0.5);
                
                if (targets && targets.length > 0) {
                    for (var i = 0; i < targets.length; i++) {
                        var target = targets[i];
                        // Don't shoot yourself
                        if (target.id !== ModAPI.player.id) {
                            // Deal 20 damage (10 hearts) to the enemy hit
                            target.attackEntityFrom("generic", 20); 
                            ModAPI.player.playSound("random.explode", 0.8, 1.5);
                            d = maxDistance; // Pierced a target; break out of the beam loop
                            break;
                        }
                    }
                }
            }
            
            // Cooldown delay timer (1.5 seconds)
            setTimeout(function() {
                railgunCooldown = false;
            }, 1500);
        }
    }
});
