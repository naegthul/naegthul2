/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var spawnunits = {

    run: function(thisroom, roomspawns) {
        
        for (let i in roomspawns) {
            let order = {};
            let starters = []
            let miners = [];
            let farminers = []
            let carriers = [];
            let farcarriers = [];
            let generalcarriers = [];
            let builders = [];
            let claimers = [];
            for (let i in thisroom.memory.createorders) {
                if (thisroom.memory.createorders[i].role == "miner" && thisroom.memory.createorders[i].loadout.length <= 4) {starters.push (i)}
                else if (thisroom.memory.createorders[i].role == "miner" && thisroom.memory.createorders[i].home == thisroom.memory.createorders[i].targetroom) {miners.push (i)}
                else if (thisroom.memory.createorders[i].role == "carrier" && thisroom.memory.createorders[i].target && thisroom.memory.createorders[i].home == thisroom.memory.createorders[i].targetroom) {carriers.push (i)}
                else if (thisroom.memory.createorders[i].role == "miner" && thisroom.memory.createorders[i].home != thisroom.memory.createorders[i].targetroom) {farminers.push (i)}
                else if (thisroom.memory.createorders[i].role == "carrier" && thisroom.memory.createorders[i].home != thisroom.memory.createorders[i].targetroom) {farcarriers.push (i)}
                else if (thisroom.memory.createorders[i].role == "carrier" && !thisroom.memory.createorders[i].target) {generalcarriers.push (i)}
                else if (thisroom.memory.createorders[i].role == "builder") {builders.push (i)}
                else if (thisroom.memory.createorders[i].role == "claimer") {claimers.push (i)}
            }
            
            if (starters.length > 0) {order = thisroom.memory.createorders[starters[0]]}
            else if (miners.length > 0) {order = thisroom.memory.createorders[miners[0]]}
            else if (carriers.length > 0) {order = thisroom.memory.createorders[carriers[0]]}
            else if (farminers.length > 0) {order = thisroom.memory.createorders[farminers[0]]}
            else if (farcarriers.length > 0) {order = thisroom.memory.createorders[farcarriers[0]]}
            else if (generalcarriers.length > 0) {order = thisroom.memory.createorders[generalcarriers[0]]}
            else if (claimers.length > 0) {order = thisroom.memory.createorders[claimers[0]]}
            else if (builders.length > 0) {order = thisroom.memory.createorders[builders[0]]}
            else {order = thisroom.memory.createorders[0]};
            
            
            
            if (order && !roomspawns[i].spawning) {
                let s_return = roomspawns[i].createCreep(order.loadout, order.name, {home: order.home, role: order.role, target: order.target, targetroom: order.targetroom});
                if (s_return == order["name"]) {
                    Memory.rooms[thisroom.name].createorders.splice (0,1); 
                    console.log("Spawning new "+order.role+" in Room"+ Memory.rooms[thisroom.name].roomnumber +": "+order["name"])
                };
            }
        }
        
        
        
    }
}

module.exports = spawnunits;