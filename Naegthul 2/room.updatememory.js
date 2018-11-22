/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomupdatememory = {

    run: function(thisroom,a_containers, i_containersbuilt) {
        
        
       /* for (let i in thisroom.memory.storage.containers) {
            if (!Game.getObjectById(i)) {
                console.log(thisroom.memory.storage.containers)
                thisroom.memory.storage.containers.splice(i,1);
                
            }
        }*/
     
        
        if (Object.keys(thisroom.memory.storage.containers).length != i_containersbuilt) {
            
            delete thisroom.memory.storage.containers;
            thisroom.memory.storage.containers = {};
            for (let i in a_containers) {
                let name = a_containers[i].id
                if (a_containers[i].pos.findInRange(FIND_SOURCES, 2).length > 0) {
                    
                    thisroom.memory.storage.containers[name] = {id: a_containers[i].id, type: "source"};
                   
                }
                else {
                    thisroom.memory.storage.containers[name] = {id: a_containers[i].id, type: "destination"};
                }
            }
        }
        
        thisroom.memory.energycapacity = thisroom.energyCapacityAvailable
        
        for (let i in thisroom.memory.outposts){
            
            if (!Memory.rooms[thisroom.memory.outposts[i].name] || Memory.rooms[thisroom.memory.outposts[i].name].role != "miningoutpost") {
                thisroom.memory.outposts.splice (i,1);
            }
        }
        
        let torepair = thisroom.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}).length
        thisroom.memory.torepair = torepair;
        let priorityrepair = thisroom.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax * 0.5}).length
        thisroom.memory.torepairpriority = priorityrepair;
    }
}

module.exports = roomupdatememory;