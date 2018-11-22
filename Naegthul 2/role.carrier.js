/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.arbeiter');
 * mod.thing == 'a thing'; // true
 */
 

var rolecarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        let targetsource = Game.getObjectById(creep.memory.target);
        let a_containers = creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE});
        let a_containerdestinations = _.filter(a_containers, (container) => (container.structureType == STRUCTURE_CONTAINER && creep.room.memory.storage.containers[container.id].type == "destination") || container.structureType == STRUCTURE_STORAGE);
        let a_containersources = _.filter(a_containers, (container) => container.structureType == STRUCTURE_CONTAINER && creep.room.memory.storage.containers[container.id].type == "source");
        let a_destnotfull = _.filter(a_containerdestinations, (container) => _.sum(container.store) < container.storeCapacity);
        let a_sourcenotempty = _.filter(a_containersources, (container) => _.sum(container.store) > 0 );
        let a_destempty = _.filter(a_containerdestinations, (container) => _.sum(container.store) == 0)
         

        let a_containersource =  _.filter(a_containersources, (container) =>  container.pos.findInRange(FIND_SOURCES, 2)[0].id == creep.memory.target);
        
      
        if (creep.memory.waiting) {delete creep.memory.waiting};
        if (!creep.memory.job) {
            
            if (creep.carry.energy == 0) {
                
                
                
                if (creep.memory.target) {
                    
                    creep.memory.job = {type: "load", target: creep.memory.target}
                    
                }
                else{
                    creep.memory.job = {type: "loadgeneral"}
                }
            }
            else if (creep.carry.energy > 0 ) {
                
                creep.memory.job = {type: "unload"}
                
                
                
            }
            
        }
        if (creep.memory.job.type == "load") {
            
            if (creep.carry.energy == creep.carryCapacity){
                delete creep.memory.job
            }
            
            else if (creep.room.name != creep.memory.targetroom){
                let route = Game.map.findRoute(creep.room.name, creep.memory.targetroom);
             
                if (route.length > 0) {
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                
                }
            }
            else if (a_containersource.length == 0){
                if (creep.room.name != targetsource.room.name){
                    let route = Game.map.findRoute(creep.room, creep.memory.job.target);
                    
                    if (route.length > 0) {
                        creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                    
                    }
                }
                
                let closest = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: creep2 => creep.memory.target == creep2.memory.target && creep2.memory.role == "miner" && creep2.carry.energy > 25})
                
                if (closest) {
                    if (creep.pos.getRangeTo(closest) > 1) {
                        creep.moveTo(closest);
                    }
                    else{
                        closest.transfer(creep,RESOURCE_ENERGY)
                    }
                }
                else {
                    if (creep.pos.getRangeTo(targetsource) > 3){
                        creep.moveTo(targetsource)
                    }
                }
            }
            else if (a_containersource.length > 0) {

                
                let closest = Game.getObjectById(creep.memory.target).pos.findInRange(a_containersource, 2,{filter: (container) =>  _.sum(container.store) > 0 });
                
                if (creep.withdraw(closest[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest[0])
                }
                else {
                    if (creep.pos.getRangeTo(targetsource) > 3){
                        creep.moveTo(targetsource)
                    }
                }
            }
            
        }
        else if (creep.memory.job.type == "loadgeneral") {
            if (creep.carry.energy == creep.carryCapacity || (a_containerdestinations.length > 0 && a_destempty.length == a_containerdestinations.length)){
                delete creep.memory.job
            }
            else if (a_containerdestinations.length > 0) {
                let target = creep.pos.findClosestByRange(a_containerdestinations, {filter: (container) => _.sum(container.store) > 0});
                if (target){
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
            }
            
            
            
            
            
        }
        else if (creep.memory.job.type == "unload") {
            
            if (creep.memory.target) {
                var targets = creep.room.find(FIND_MY_STRUCTURES, {filter: structure => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity});
            }
            else{
                var targets = creep.room.find(FIND_MY_STRUCTURES, {filter: structure => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION /*|| (structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity * 0.75))*/) && structure.energy < structure.energyCapacity});
                var towers = creep.room.find(FIND_MY_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity * 0.75)})
            }
            let closest = creep.pos.findClosestByRange(targets)
            
            let generalcarriers = _.filter(Game.creeps, (creep2) => creep2.memory.home == creep.memory.home && (creep2.memory.role == "carrier" && !creep2.memory.target))
            
            
            if(creep.carry.energy == 0) {
                delete creep.memory.job;
            }
            else if (creep.room.name != creep.memory.home){
                let route = Game.map.findRoute(creep.room.name, creep.memory.home);
            
                if (route.length > 0) {
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                
                }
            }
            else if (closest && (!creep.memory.target || creep.room.controller.level < 3)) {
                if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
                if (creep.memory.waiting) {delete creep.memory.waiting};
            }
            else if (a_containerdestinations.length > 0 && creep.memory.target && (creep.room.controller.level < 3 || generalcarriers.length > 0)) {
                closest = creep.pos.findClosestByRange(a_containerdestinations, {filter: (container) => _.sum(container.store) < container.storeCapacity});
                if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closest);
                }
            } 
            else if (closest) {
                if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
                if (creep.memory.waiting) {delete creep.memory.waiting};
            }            
            else if (towers && towers.length > 0) {
                if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(towers[0]);
                }
            }
            else if (!creep.memory.target && creep.carry.energy < creep.carryCapacity){
                let target = creep.pos.findClosestByRange(a_containerdestinations, {filter: (container) => _.sum(container.store) > 0});
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }
            else {
                creep.memory.waiting = true;
            }
        }
    }
}
        
        
        



module.exports = rolecarrier;
