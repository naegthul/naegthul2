/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomminesources = {

    run: function(thisroom, fromroom, maxminers, minerspeed, minercarry, minerloadout, carriercarry, carrierloadout) {
        
        var roomcreateorder = require("room.createorder");
        var buildsimple = require("build.simple");
        let roomname = thisroom.name
        
        for (let i in thisroom.memory.sources) {
            if (!thisroom.memory.sources[i].keeperlair) {
                //calculate need
                let thismineable = thisroom.memory.sources[i].mineable;
                let maxorderminers
                
                if (maxminers > thismineable) {maxorderminers = thismineable} else{ maxorderminers = maxminers};
                
                let current = 0
                
                current = (_.filter(Game.creeps, (creep) => creep.memory.role == "miner" && creep.memory.target == thisroom.memory.sources[i].id)).length  + (_.filter(fromroom.memory.createorders, (order) => order.role == "miner" &&order["target"] == thisroom.memory.sources[i].id)).length;
                
                
                thisroom.memory.sources[i].maxminers = maxorderminers;
                thisroom.memory.sources[i].currentminers = current;
                    
                if (thisroom.name == fromroom.name) {
                    roomcreateorder.run(fromroom.name, "miner", maxorderminers, thisroom.memory.sources[i], thisroom.name, minerloadout, thisroom.memory.sources[i].name);
                }
                else {
                    roomcreateorder.run(fromroom.name, "miner", maxorderminers, thisroom.memory.sources[i], thisroom.name, minerloadout, "R"+thisroom.memory.roomnumber+ thisroom.memory.sources[i].name);
                }
                
            }
            else if(thisroom.memory.sources[i].maxminers) {delete thisroom.memory.sources[i].maxminers};
            
            
            //order carrier
            
            if (thisroom.memory.sources[i].maxminers) {
                thisroom.memory.sources[i].distance = PathFinder.search(fromroom.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_SPAWN})[0].pos, {pos: thisroom.memory.sources[i].pos, range: 1}, {swampCost: 1, plainCost: 1}).path.length;
                let test = PathFinder.search(fromroom.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_SPAWN})[0].pos, {pos: thisroom.memory.sources[i].pos, range: 1}, {swampCost: 1, plainCost: 1}).path.length;
                let maxcarrier = Math.ceil(thisroom.memory.sources[i].maxminers * ((minerspeed*2*thisroom.memory.sources[i].distance)/(carriercarry*1.5)) );
                
                if (thisroom.memory.sources[i].currentminers >= thisroom.memory.sources[i].maxminers){
                    
                    if (thisroom.name == fromroom.name) {
                        
                        roomcreateorder.run(fromroom.name, "carrier", maxcarrier, thisroom.memory.sources[i], thisroom.name, carrierloadout, thisroom.memory.sources[i].name);
                    }
                    else {
                        roomcreateorder.run(fromroom.name, "carrier", maxcarrier, thisroom.memory.sources[i], thisroom.name, carrierloadout, "R"+thisroom.memory.roomnumber+ thisroom.memory.sources[i].name);
                    }
                    
                    thisroom.memory.sources[i].maxcarriers = maxcarrier;
                    
                }
                
            }
            
            //check/build containers
            if (Game.rooms[thisroom.name]) {
                
                let source = Game.getObjectById(thisroom.memory.sources[i].id)
                let closecontainers = source.pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => structure.structureType == STRUCTURE_CONTAINER})
                let closecontconstr = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 2, {filter: (structure) => structure.structureType == STRUCTURE_CONTAINER})
                if (!closecontainers) {closecontainers = []};
                if (!closecontconstr) {closecontconstr = []};
                
                if (!closecontainers|| (closecontainers.length + closecontconstr.length < 1)) {
                    let test = buildsimple.run(thisroom, 2, 1, source.pos, STRUCTURE_CONTAINER, false);
                    
                }
            };
            
            
        }        
    }
}

module.exports = roomminesources;