/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.myspawn');
 * mod.thing == 'a thing'; // true
 */

var roommyspawn = {

    run: function(roomname) {
        //console.log("roommyspawn start")
        
        var roomcreateorder = require("room.createorder");
        var roomspawnunits = require("room.spawnunits");
        var buildsimple = require("build.simple");
        var roomminesources = require("room.minesources");
        var roomupdatememory = require("room.updatememory");
        var roomroads = require("room.roads");
        var roombuildextensions = require("room.buildextensions");
        var roletower = require('role.tower');
        var roomexplore = require('room.explore');
        
        let thisroom = Game.rooms[roomname];
        
        let thiscontroller = thisroom.controller;
        let controllerlevel = thiscontroller.level;
        let a_spawns = []
        for  (let i in Memory.rooms[roomname].spawns) {a_spawns.push (Game.getObjectById(Memory.rooms[roomname].spawns[i].id))};
        
        let a_mycreeps = _.filter(Game.creeps, (creep) => creep.room == thisroom && creep.my);
        let a_mydonecreeps = _.filter(Game.creeps, (creep) => creep.room == thisroom && !creep.spawning);
   
        let a_miners = _.filter(a_mycreeps, (creep) => creep.room == thisroom && creep.memory.role == 'miner');
        let a_carriers = _.filter(a_mycreeps, (creep) => creep.room == thisroom && creep.memory.role == 'carrier');
        let i_miners = a_miners.length;
        let i_carriers = a_carriers.length;
        
        let roomstructures = thisroom.find(FIND_STRUCTURES);
        let a_extensions = _.filter(roomstructures, (structure) => structure.structureType == STRUCTURE_EXTENSION);
        let a_towers = _.filter(roomstructures, (structure) =>  structure.structureType == STRUCTURE_TOWER);
        let a_containers = _.filter(roomstructures, (structure) =>  structure.structureType == STRUCTURE_CONTAINER);
        let a_storages = _.filter(roomstructures, (structure) =>  structure.structureType == STRUCTURE_STORAGE);
        
        let a_posstructures = [];
        for ( let i in a_spawns) {a_posstructures.push(a_spawns[i].pos)};
        for ( let i in a_extensions) {a_posstructures.push(a_extensions[i].pos)};
        for ( let i in a_towers) {a_posstructures.push(a_towers[i].pos)};
        for ( let i in a_storages) {a_posstructures.push(a_storages[i].pos)};

        
        let i_extensionsbuilt = a_extensions.length;
        let i_containersbuilt = a_containers.length;
        let i_towersbuilt = a_towers.length;
        let num_extensions = (thisroom.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_EXTENSION})).length + i_extensionsbuilt;
        let num_containers = (thisroom.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_CONTAINER})).length + i_containersbuilt;
        let num_towers = (thisroom.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_TOWER})).length + i_towersbuilt;
        let num_storages = (thisroom.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_STORAGE})).length + a_storages.length;
        
        //set creep loadout
        
        if (thisroom.energyCapacityAvailable < 550 || a_miners.length < 1){
            var minerloadout = [WORK,CARRY,MOVE,MOVE];
            var minerspeed = 2;
            var minercarry = 50;
            var maxminers = Math.ceil(10 / minerspeed);
            var carrierloadout = [CARRY,CARRY,MOVE,MOVE];
            var carriercarry = 100;
            var upgraderloadout = [WORK,CARRY,MOVE,MOVE];
            var upgraderspeed = 1;
            var upgradercarry = 50
            var builderloadout = [WORK,CARRY,MOVE,MOVE];
            var buildspeed = 30;
            var builderspeed = 5;
            var buildercarry = 50;    
        }
        else if (thisroom.energyCapacityAvailable < 800 && a_miners.length >= 1) {
            
            var minerloadout = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            var minerspeed = 4;
            var minercarry = 100;
            var maxminers = Math.ceil(10 / minerspeed);
            var carrierloadout = [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
            var carriercarry = 250;
            var builderloadout = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            var buildspeed = 80;
            var builderspeed = 10;
            var buildercarry = 100;  
        }
        else if (thisroom.energyCapacityAvailable <= 1300 && a_miners.length >= 1) {
            
            var minerloadout = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            var minerspeed = 10;
            var minercarry = 100;
            var maxminers = Math.ceil(10 / minerspeed);
            var carrierloadout = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            var carriercarry = 350;
            var builderloadout = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            var buildspeed = 160;
            var builderspeed = 20;
            var buildercarry = 200; 
            var claimerloadout = [CLAIM,MOVE,MOVE]
            var claimerspeed = 1;
        }        
                else if (thisroom.energyCapacityAvailable <= 1800 && a_miners.length >= 1) {
            
            var minerloadout = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            var minerspeed = 10;
            var minercarry = 100;
            var maxminers = Math.ceil(10 / minerspeed);
            var carrierloadout = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            var carriercarry = 350;
            var builderloadout = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            var buildspeed = 160;
            var builderspeed = 20;
            var buildercarry = 200; 
            var claimerloadout = [CLAIM,MOVE,MOVE]
            var claimerspeed = 1;
        }  
        
        
        
        
        //order miners and coupled carriers
        
        roomminesources.run(thisroom, thisroom, maxminers, minerspeed, minercarry, minerloadout, carriercarry, carrierloadout)
        
            //console.log(i_containersbuilt)
        
        //order general carriers
        if (i_containersbuilt > 0){
            roomcreateorder.run(roomname, "carrier", i_containersbuilt - Object.keys(thisroom.memory.sources).length, "", "", carrierloadout, "");
        }
        
        
        
        //order builder
        if (i_carriers > 1) {
            
            let maxbuilder = Math.ceil(buildspeed / builderspeed);
            roomcreateorder.run(roomname, "builder", maxbuilder, "", "", builderloadout, "");
        }

        
        //Exploration
        
        roomexplore.run(thisroom, claimerloadout, 5)
        
        
        
        //delete done orders
        for (let j in Memory.rooms[roomname].createorders) {
            for (let k in Game.creeps){
                if (Memory.rooms[roomname].createorders[j] == null || Memory.rooms[roomname].createorders[j].name == Game.creeps[k].name){
                    Memory.rooms[roomname].createorders.splice (j,1);
                }
            }
        }
        

       
        //create creeps
        roomspawnunits.run(thisroom, a_spawns)
        
        //delete all orders if economy broken
        
        if (thisroom.energyAvailable <= 300 && a_miners.length == 0){
            for (let i in thisroom.memory.createorders) {
                thisroom.memory.createorders.splice (i,1)
            }
        }

        
        //updatememory
        
        roomupdatememory.run(thisroom, a_containers, i_containersbuilt)
        
        
        //build containers
        
        if (num_containers - Object.keys(thisroom.memory.sources).length < 1 || (num_containers - Object.keys(thisroom.memory.sources).length < 2 && thisroom.energyCapacityAvailable >= 550) || 
                (num_containers - Object.keys(thisroom.memory.sources).length < 3 && thisroom.energyCapacityAvailable >= 800) ) {
            if (Object.keys(Game.constructionSites).length < 90) { 
                buildsimple.run(thisroom, 3, 2, a_spawns[0].pos, STRUCTURE_CONTAINER, a_spawns[0].pos);
                
            }
        }
        
        //build storage
        if (num_storages < 1 && thisroom.energyCapacityAvailable >= 1300 && Object.keys(Game.constructionSites).length < 90) {
            buildsimple.run(thisroom, 3, 2, a_spawns[0].pos, STRUCTURE_STORAGE, a_spawns[0].pos);
        }
        
        
        //build_towers
        
        if (num_towers < 1  && controllerlevel == 3) {
          
            if (Object.keys(Game.constructionSites).length < 90) { 
                buildsimple.run(thisroom, 2, 1, a_spawns[0].pos, STRUCTURE_TOWER, a_spawns[0].pos);
                
            }
        }        
        
        //role towers
        
        for (let i in a_towers) {
            let tower = a_towers[i];
            roletower.run(tower);
            
        }
        
        //build roads
        
        roomroads.run(thisroom, a_spawns, thiscontroller);
        
        
        //build extensions

        roombuildextensions.run(thisroom, a_posstructures, a_spawns, num_extensions, controllerlevel)


        
        
        
        
    }
}

module.exports = roommyspawn;