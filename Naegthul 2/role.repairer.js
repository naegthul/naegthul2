/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */
var rolerepairer = {
    
        /** @param {Creep} creep **/
    run: function(creep) {
        
        if (!creep.memory.mining && creep.carry.energy == 0) {
            creep.memory.mining = true;
            creep.say("mining");
        }
        
        else if (creep.memory.mining && creep.carry.energy == creep.carryCapacity) {
            creep.memory.mining = false;
            creep.say("repairing");
        };
        
        if (creep.memory.mining) {
            var sources = creep.room.find(FIND_SOURCES);
            var i_rnd = Math.floor(Math.random()*sources.length);
            if (creep.harvest(sources[i_rnd]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[i_rnd]);
            };
        } 
        else { 
            var a_target = Game.rooms[Memory.room0ex["exbottom"]["name"]].find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax});
            if (a_target) {
                if (creep.repair(a_target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(a_target[0]);
                }
            }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        
    }
}



module.exports = rolerepairer;