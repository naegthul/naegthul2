/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roleminer = {

    run: function(creep) {
        
        let target = Game.getObjectById(creep.memory.target);
        if (!target) {
            let route = Game.map.findRoute(creep.room, creep.memory.targetroom);
                
            if (route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                
            }
        }
        else{ 
            let a_carrier = _.filter(Game.creeps, (creep2) => creep2.memory.role == "carrier" && creep2.memory.target == creep.memory.target);
            let a_containers = target.pos.findInRange(FIND_STRUCTURES, 2, {filter: structure => structure.structureType == STRUCTURE_CONTAINER});
            
            if (creep.memory.unload && creep.carry.energy == 0) {delete creep.memory.unload}
            
            if (creep.carry.energy < creep.carryCapacity && !creep.memory.unload) {
                if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                
            }
            else if ((creep.carry.energy == creep.carryCapacity || creep.memory.unload) && a_carrier.length == 0) {
                creep.memory.unload = true;
                let targets = Game.rooms[creep.memory.home].find(FIND_MY_STRUCTURES, {filter: structure => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION /*|| structure.structureType == STRUCTURE_TOWER*/) && structure.energy < structure.energyCapacity}); 
                let closest = creep.pos.findClosestByPath(targets)
                if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
                else{delete creep.memory.unload}
                if (creep.carry.energy == 0) {delete creep.memory.unload}
            }
            else if (creep.carry.energy == creep.carryCapacity && a_carrier.length > 0) {
                delete creep.memory.unload
                if (a_containers.length > 0) {
                    
                    let closest = creep.pos.findClosestByPath(a_containers)
                    if (closest && closest.hits < closest.hitsMax) {
                        if (creep.repair(closest) == ERR_NOT_IN_RANGE){
                            creep.moveTo(closest);
                        }
                    }
                    else if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest);
                    }
                }
            }
        }
    }
}


module.exports = roleminer;