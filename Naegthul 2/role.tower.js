/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.bauer');
 * mod.thing == 'a thing'; // true
 */
var roletower = {
    
        /** @param {Creep} creep **/
    run: function(tower) {
        
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax});
        var closesthealtarget = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax})
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else if(closesthealtarget) {
            tower.heal(closesthealtarget);
        }
        else if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }


    }
}

module.exports = roletower;