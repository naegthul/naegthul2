/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init.room');
 * mod.thing == 'a thing'; // true
 */
var initroom = {
    
    run: function(roomname,rolenew) {
        console.log("init" + roomname)
        if (Memory.rooms && Memory.rooms[roomname]){
            delete Memory.rooms[roomname];
        }
        
        Game.rooms[roomname].memory = {role: rolenew}; //set role
        if (rolenew == "startroom") {Memory.startroom = Game.spawns["Spawn1"].room.name}; //set startroom
        Memory.rooms[roomname].name = roomname;
        Memory.rooms[roomname].createorders = []; //init creep buildorders
        Memory.rooms[roomname].exits = Game.map.describeExits(roomname); //set room exits
        Memory.rooms[roomname].roomnumber = Object.keys(Memory.rooms).length
        Memory.rooms[roomname].outposts = []
        
        let sources = Game.rooms[roomname].find(FIND_SOURCES); //find sources
        Memory.rooms[roomname].storage = {};
        Memory.rooms[roomname].storage.containers = {};
        
        //check spawns
        let a_spawns = Game.rooms[roomname].find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_SPAWN})
        
        Memory.rooms[roomname].spawns = {};
        for (let i in a_spawns) {
            Memory.rooms[roomname].spawns[a_spawns[i].name] = {id: a_spawns[i].id, owner: a_spawns[i].owner.username, pos: a_spawns[i].pos}
            
        }
        
        
        //check each sources details
        Memory.rooms[roomname].sources = {};
        for (let i in sources) {
            
            //how many mineable tiles
            let area = Game.rooms[roomname].lookAtArea(sources[i].pos.y - 1, sources[i].pos.x - 1, sources[i].pos.y + 1, sources[i].pos.x + 1)
            delete area[sources[i].pos.y][sources[i].pos.x]
            let mineable = 0;
            for (let y in area) {
                for (let x in area[y]) {
                    for (let z in area[y][x]) {
                        
                        if (area[y][x][z]["terrain"] == "plain" || area[y][x][z]["terrain"] == "swamp") {
                            mineable++
                        }
                    }
                } 
            }
            
            Memory.rooms[roomname].sources[sources[i].id] = {id: sources[i].id, pos: sources[i].pos, mineable: mineable, name: "source" + i};
            if (a_spawns.length > 0) {
            Memory.rooms[roomname].sources[sources[i].id].distance = PathFinder.search(a_spawns[0].pos, {pos: sources[i].pos, range: 1}, {swampCost: 1, plainCost: 1}).path.length;
            }
            
             //check for keeper lair
            if (sources[i].pos.findInRange(FIND_STRUCTURES,4, {filter: (structure) => structure.structureType == STRUCTURE_KEEPER_LAIR}).length > 0) {
                Memory.rooms[roomname].sources[sources[i].id].keeperlair = true;
            }
        }    
        //check controller
        let controler = Game.rooms[roomname].controller;
        
        if (controler){
            Memory.rooms[roomname].controller = {id: controler.id, owner: controler.owner, reservation: controler.reservation, pos: controler.pos};
        }
      
        //check hostiles
        Memory.rooms[roomname].hostilecreeps = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS).length
        Memory.rooms[roomname].hostilestructures = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS).length
    }
}


module.exports = initroom;