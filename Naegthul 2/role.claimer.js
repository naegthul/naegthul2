/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.arbeiter');
 * mod.thing == 'a thing'; // true
 */
 

var roleclaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
       var roominit = require("room.init");
       let miningoutposts = _.filter(Memory.rooms, (room) => room.role == "miningoutpost" && room.home == creep.memory.home)
       let currentexplore = _.filter(Game.creeps, (creep1) => creep1.memory.job && (creep1.memory.job.type == "explore"))
       
        if (!creep.memory.job){
            
            if (Memory.rooms[creep.memory.home].toexplore && currentexplore.length < 1) {
                
                
                creep.memory.job = {type: "explore", target: Memory.rooms[creep.memory.home].toexplore[0]}
                
            }
            
            if (!creep.memory.job && miningoutposts.length > 0)  {
                for (let i in miningoutposts){
                    let current = _.filter(Game.creeps, (creep1) => creep1.memory.job && (creep1.memory.job.type == "reserve") && miningoutposts[i].controller.id == creep1.memory.job.target)
                    
                    if (current.length < 2) {
                        creep.memory.job = {type: "reserve", target: miningoutposts[i].controller.id, targetroom: miningoutposts[i].name}
                    
                    }
                }
                
               
            }
        }
        
        else if (creep.memory.job.type == "explore") {
            
            //console.log("aa")
            if (creep.room.name != creep.memory.job.target) {
                
                let route = Game.map.findRoute(creep.room, creep.memory.job.target);
                
                if (route.length > 0) {
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                    
                }

            }
            else {
                creep.moveTo(25,25)
                roominit.run(creep.room.name, "explored")
                delete creep.memory.job
            }
            if (!Memory.rooms[creep.memory.home].toexplore){delete creep.memory.job};
        }
        else if (creep.memory.job.type == "reserve") {
            
             
            
            let ret  = creep.reserveController(Game.getObjectById(creep.memory.job.target))
            
            if ( ret == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(creep.memory.job.target)) 
            }
            else if (ret == ERR_INVALID_TARGET) {
                let route = Game.map.findRoute(creep.room.name, creep.memory.job.targetroom);
                
                if (route.length > 0) {
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
                    
                }
            }
            
         
        }
    }
}

module.exports = roleclaimer;
