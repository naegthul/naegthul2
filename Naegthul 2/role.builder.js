/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var rolebuilder = {

    run: function(creep) {
        
        let a_containers = creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE});
        let constructionsites = [];
        let upgraders = _.filter(Memory.creeps, (creep2) => creep2.role == "builder" && creep2.job && creep2.job.type == "upgradecontroller" && creep2.home == creep.memory.home);
        let repairers = _.filter(Memory.creeps, (creep2) => creep2.role == "builder" && creep2.job && creep2.job.type == "repair" && creep2.home == creep.memory.home);
        let lookrooms = [Game.rooms[creep.memory.home]];
        let miningrooms = _.filter(Game.rooms, (room) => room.memory.role == "miningoutpost" && room.memory.home == creep.memory.home);
        
        for (let i in miningrooms) {
            lookrooms.push(miningrooms[i])
        }
        
        let repairrooms = _.filter(lookrooms, (room) => room.memory.torepair && room.memory.torepair >= 10);
        let repairroomspriority = _.filter(lookrooms, (room) => room.memory.torepairpriority && room.memory.torepairpriority > 0);
        
        for (let room in Memory.rooms) {
            if (Game.rooms[room] && (room == creep.memory.home || (Memory.rooms[room].role == "miningoutpost" && Memory.rooms[room].home == creep.memory.home))) {
                let sites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES)
                for (let site in sites) {
                    constructionsites.push (sites[site])
                }
            }
        }
        
        if (!creep.memory.job) {
            
            if (creep.carry.energy < creep.carryCapacity) {
                
                creep.memory.job = {type: "gather"};
                
                
            }
            
            else{
                
                if (upgraders.length == 0) {
                    
                    creep.memory.job = {type: "upgradecontroller"}
                }
                
                else if (repairroomspriority.length > 0 && repairers < 1) {
                    creep.memory.job = {type: "repair", targetroom: repairroomspriority[Math.floor(Math.random())*repairrooms.length].name};
                }
                else if (repairrooms.length > 0 && repairers < 1) {
                    creep.memory.job = {type: "repair", targetroom: repairrooms[Math.floor(Math.random())*repairrooms.length].name};
                }
                
                else if (constructionsites.length > 0) {
                    
                    creep.memory.job = {type: "build"};

                }
                
                
                
                else{
                    creep.memory.job = {type: "upgradecontroller"}
                    
                }
            }
        }
        
        
        
        if (creep.memory.job && creep.memory.job.type == "upgradecontroller") {
            if (creep.room.name != creep.memory.home){
                    let route = Game.map.findRoute(creep.room.name, creep.memory.home);
                
                    if (route.length > 0) {
                        creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                    
                    }
                }
            if (creep.carry.energy > 0) {
                if (creep.upgradeController(Game.rooms[creep.memory.home].controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms[creep.memory.home].controller);
                }
            }
            else {delete creep.memory.job};
        }
        
        else if (creep.memory.job && creep.memory.job.type == "gather") {
            
            if (creep.carry.energy == creep.carryCapacity) {delete creep.memory.job} 
            else if (creep.room.name != creep.memory.home){
                let route = Game.map.findRoute(creep.room.name, creep.memory.home);
            
                if (route.length > 0) {
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                
                }
            }
            
            else if (a_containers.length == 0) { 
                console.log("a")
                let closestcreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: creep2 => creep2.memory.role == "carrier" &&  creep2.memory.waiting})
                  
                if (closestcreep) {
                    if (creep.pos.getRangeTo(closestcreep) > 1) {
                        creep.moveTo(closestcreep);
                    }
                    else{
                        closestcreep.transfer(creep, RESOURCE_ENERGY);
                    }
                }    
            }
            else if (a_containers.length > 0) {
                var targets = creep.room.find(FIND_MY_STRUCTURES, {filter: structure => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity});
                let closest =  creep.pos.findClosestByRange(a_containers, {filter: container => container.store[RESOURCE_ENERGY] > 50 && (container.structureType == STRUCTURE_STORAGE || (container.structureType == STRUCTURE_CONTAINER /*&& creep.room.memory.storage.containers[container.id].type == "destination"*/))})
                  
                if (closest && (targets.length == 0 || _.sum(closest.store) > closest.storeCapacity / 2)) {
                    if (creep.withdraw(closest,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest);
                    }
                }    
            }
        }
        
        else if (creep.memory.job && creep.memory.job.type == "build") {
 
            
            
            let targetstructures = _.filter(constructionsites, (site) => site.structureType != STRUCTURE_ROAD)
            let targetcontainers = _.filter(constructionsites, (site) => site.structureType == STRUCTURE_CONTAINER)
            let target = {};
            
            if (creep.carry.energy == 0 || constructionsites.length == 0) {delete creep.memory.job}

            
            else if (!creep.memory.target){
                if (targetcontainers.length > 0) {
                    
                    target = targetcontainers[0]
                }
                else if (targetstructures.length > 0) {
                    target = targetstructures[0]
                }
                else if (constructionsites.length > 0){  
                    target = constructionsites[0]
                }
                else{
                    delete creep.memory.job
                }
                creep.memory.target = target.id;
            }
            else {
                let ret = creep.build(Game.getObjectById(creep.memory.target));
                if (ret == ERR_NOT_IN_RANGE){creep.moveTo(Game.getObjectById(creep.memory.target))}
                else if (ret == OK) {}
                else {delete creep.memory.target}
            }
            
        }
        else if (creep.memory.job && creep.memory.job.type == "repair") {
            
            if (!Game.rooms[creep.memory.job.targetroom].memory.torepair || Game.rooms[creep.memory.job.targetroom].memory.torepair == 0 || creep.carry.energy == 0){
                delete creep.memory.job
            }
            else if (creep.room.name != creep.memory.job.targetroom){
                let route = Game.map.findRoute(creep.room.name, creep.memory.job.targetroom);
                            
                if (route.length > 0) {
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                
                }
            }
            else {
                
                let target = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}))
                if (creep.repair(target)){
                    creep.moveTo(target)
                }
            }
            
            
        }
    }
}

module.exports = rolebuilder;