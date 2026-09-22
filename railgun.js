ModAPI.require("player");

var railgunCooldownTicks = 0;

ModAPI.addEventListener("update", function() {
    if (!ModAPI.player) return;

    if (railgunCooldownTicks > 0) {
        railgunCooldownTicks--;
    }

    var heldStack = ModAPI.player.getHeldItem();
    
    // Catch when holding a Carrot on a Stick (ID 398)
    if (heldStack && heldStack.id === 398) {
        
        // Visual Bypass: Changes display name dynamically to look like a true mod item
        if (heldStack.getDisplayName() !== "§b§lRailgun") {
            heldStack.setStackDisplayName("§b§lRailgun");
        }
        
        // Check if the player triggers a right-click block
        if (ModAPI.player.isUsingItem() && railgunCooldownTicks === 0) {
            railgunCooldownTicks = 30; // 1.5 second trigger gap
            
            ModAPI.player.playSound("ambient.weather.thunder", 1.0, 1.0);
            
            var maxDistance = 45;
            var step = 0.5;
            var posX = ModAPI.player.x;
            var posY = ModAPI.player.y + 1.62; 
            var posZ = ModAPI.player.z;
            
            var angleYaw = (ModAPI.player.yaw + 90) * (Math.PI / 180);
            var anglePitch = -ModAPI.player.pitch * (Math.PI / 180);
            
            var dirX = Math.cos(anglePitch) * Math.cos(angleYaw);
            var dirY = Math.sin(anglePitch);
            var dirZ = Math.cos(anglePitch) * Math.sin(angleYaw);
            
            for (var d = 0; d < maxDistance; d += step) {
                var beamX = posX + (dirX * d);
                var beamY = posY + (dirY * d);
                var beamZ = posZ + (dirZ * d);
                
                ModAPI.display.spawnParticle("crit", beamX, beamY, beamZ, 0, 0, 0);
                
                var targets = ModAPI.world.getEntitiesWithinAABB(beamX - 0.6, beamY - 0.6, beamZ - 0.6, beamX + 0.6, beamY + 0.6, beamZ + 0.6);
                
                if (targets && targets.length > 0) {
                    for (var i = 0; i < targets.length; i++) {
                        var target = targets[i];
                        if (target.id !== ModAPI.player.id) {
                            target.attackEntityFrom("generic", 20); 
                            ModAPI.player.playSound("random.explode", 1.0, 1.2);
                            d = maxDistance;
                            break;
                        }
                    }
                }
            }
        }
    }
});
