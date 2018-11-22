/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomminingoutpost = {

    run: function(roomname) {
        
        var buildroad = require("build.road");
        var roomupdatememory = require("room.updatememory");
        var roomminesources = require("room.minesources");
        let thisroommem = Memory.rooms[roomname];
        
        
        
        if (Game.rooms[thisroommem.home] && Game.rooms[roomname]) {
            let homeroom = Game.rooms[thisroommem.home];
            let thisroom = Game.rooms[roomname]
            let thiscontroller = thisroom.controller
            let reservation = thiscontroller.reservation
            let a_mycreeps = _.filter(Game.creeps, (creep) => creep.room == thisroom && creep.my);
            let a_miners = _.filter(a_mycreeps, (creep) => creep.room == thisroom && creep.memory.role == 'miner');
            let roomstructures = thisroom.find(FIND_STRUCTURES);
            let a_containers = _.filter(roomstructures, (structure) =>  structure.structureType == STRUCTURE_CONTAINER);
            let i_containersbuilt = a_containers.length
         
            
            if (Game.rooms[thisroommem.home].energyCapacityAvailable >= 800) {
                
                var minerloadout = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                var minerspeed = 10;
                var minercarry = 100;
                var maxminers = Math.ceil(10 / minerspeed);
                var carrierloadout = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                var carriercarry = 350;
                var builderloadout = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                var buildspeed = 80;
                var builderspeed = 20;
                var buildercarry = 200; 
                var claimerloadout = [CLAIM,MOVE,MOVE]
                var claimerspeed = 1;
            }     
            
            if (thisroom.find(FIND_HOSTILE_CREEPS) == 0) {
            roomminesources.run(thisroom, homeroom, maxminers, minerspeed, minercarry, minerloadout, carriercarry, carrierloadout)
            
            
            roomupdatememory.run(thisroom,a_containers, i_containersbuilt)
            let sources = thisroom.find(FIND_SOURCES)
            let paths = 0;
            for (let i in sources){
                if (!thisroom.memory.roads && paths < sources.length){
                    if (buildroad.run(Game.rooms[thisroom.memory.home].find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_SPAWN})[0].pos, sources[i].pos) == true){
                        paths = paths + 1;
                    }
                }
            }
            if (paths == sources.length) {thisroom.memory.roads = 1}
            }
            else {
                thisroom.memory.roads = false
            }
        }
    }
}

module.exports = roomminingoutpost;