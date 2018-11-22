/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomroads = {

    run: function(thisroom, a_spawns, thiscontroller) {
        
      
        let roomname = thisroom.name
        let a_safesources = []
        for  (let i in Memory.rooms[roomname].sources) {
            if (!Memory.rooms[roomname].sources[i].keeperlair) {
                a_safesources.push (Game.getObjectById(Memory.rooms[roomname].sources[i].id))
            }
        };
        
        if (!thisroom.memory.roads) {
           
            PathFinder.use(true);
            let maxsites = false;
            let path1 = PathFinder.search(a_spawns[0].pos, {pos: thiscontroller.pos, range: 1}, {swampCost: 1, plainCost: 1});
            for (let i in path1.path) {
                if (Object.keys(Game.constructionSites).length < 80) {
                    if (thisroom.createConstructionSite(path1.path[i].x,path1.path[i].y,STRUCTURE_ROAD) == ERR_FULL){
                        maxsites = true;
                    }
                }
                else {maxsites = true};
            };      
            
            for (let j in a_safesources) {
                let path1 = PathFinder.search(a_spawns[0].pos, {pos: a_safesources[j].pos, range: 1}, {swampCost: 1, plainCost: 1});
                for (let i in path1.path) {
                    if (Object.keys(Game.constructionSites).length < 80) {
                        if (thisroom.createConstructionSite(path1.path[i].x,path1.path[i].y,STRUCTURE_ROAD) == ERR_FULL){
                            maxsites = true;
                        }
                    }
                    else {maxsites = true};
                }
            }
            for (let j in a_safesources) {
                let path1 = PathFinder.search(thiscontroller.pos, {pos: a_safesources[j].pos, range: 1}, {swampCost: 1, plainCost: 1});
                for (let i in path1.path) {
                    if (Object.keys(Game.constructionSites).length < 80) {
                        if (thisroom.createConstructionSite(path1.path[i].x,path1.path[i].y,STRUCTURE_ROAD) == ERR_FULL){
                            maxsites = true;
                        }
                    }
                    else {maxsites = true};
                }
            }
            if (maxsites == false){
                thisroom.memory.roads = 1;
            }
            }
        else {
            if (thisroom.find(FIND_CONSTRUCTION_SITES).length == 0 && (thisroom.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_ROAD}) == 0)) {
                thisroom.memory.roads = false;
            }
        }        
    }
}

module.exports = roomroads;