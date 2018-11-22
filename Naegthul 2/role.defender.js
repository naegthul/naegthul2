/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.bauer');
 * mod.thing == 'a thing'; // true
 */
var roledefender = {
    
        /** @param {Creep} creep **/
    run: function(creep) {
        var a_enemies = Game.flags["RallyDef1"].room.find(FIND_HOSTILE_CREEPS);
        var a_enemies2 = creep.room.find(FIND_HOSTILE_CREEPS);
        
        if (a_enemies2.length == 0 && creep.pos.getRangeTo(Game.flags["RallyDef1"]) > 1) {
            creep.moveTo(Game.flags["RallyDef1"]);
        }
        else {
            if (a_enemies.length > 0){
                creep.say("HERETIC!");
                var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                console.log("DEFENDER: ENEMY IN ROOM" + enemy)
                if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy.pos)
                }
            }
        }
    }
}

module.exports = roledefender;