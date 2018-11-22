/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomexplore = {

    run: function(thisroom, claimerloadout, farsourcesneeded) {
        var roomcreateorder = require("room.createorder");
        let roomname = thisroom.name

        if (thisroom.energyCapacityAvailable >= 800){
            let toexplore = [];
            
            
            for (let exit in thisroom.memory.exits) {
                let exitname = thisroom.memory.exits[exit]
                if (!Memory.rooms[exitname]){
                    toexplore.push (exitname)
                }
                else{
                    for (let exit2 in Memory.rooms[exitname].exits) {
                        let exit2name = Memory.rooms[exitname].exits[exit2]
                        if (!Memory.rooms[exit2name]){
                            toexplore.push (exit2name)
                        }
                    }
                }
            }
          /*  let toexplore = [thisroom.name];
            let findtoexplore = [thisroom.name];
            let exprange = 2;
            let i = 0;
            while (i < exprange) {
                for (let exit in Memory.rooms[findtoexplore[i]]) {
                    let exitname = thisroom.memory.exits[exit]
                    if (!Memory.rooms[exitname]){
                        toexplore.push (exitname)
                        findtoexplore.push (exitname)
                    }
                    findtoexplore.splice(i,1)
                }
            }*/
            

            
            // order claimers
            let maxclaimers = 0;
            if (toexplore.length > 0){
                maxclaimers = 1;
                delete thisroom.memory.toexplore
                thisroom.memory.toexplore = toexplore
            }
            else if (thisroom.memory.toexplore){delete thisroom.memory.toexplore};
            
            maxclaimers = maxclaimers + (2 * thisroom.memory.outposts.length);
            
            roomcreateorder.run(roomname, "claimer", maxclaimers, "", "", claimerloadout, "Claimer");
        
        
            //Expanding
            
            
            let found = 0;
            let candidates = [];
            let farsources = 0
            for (let i in thisroom.memory.outposts) {
                farsources = farsources + thisroom.memory.outposts[i].sources
            }
            if (farsources < farsourcesneeded) {
                
                for (let i in Memory.rooms){
                    let distance = Game.map.findRoute(i,thisroom.name).length;
                    let sources = Object.keys(Memory.rooms[i].sources).length;
                    
                    
                    if (distance == 1 && sources >= 1 && found < farsourcesneeded && Memory.rooms[i].role == "explored"){
                        found = found + sources;
                        candidates.push ({name: i, sources: sources, distance: distance});
                    }
                }
                
                let stop = 0;
                for (let i in candidates){
                    
                    if (stop < farsourcesneeded) {
                        console.log("candidates[i]")
                  
                        Memory.rooms[candidates[i].name].role = "miningoutpost";
                        Memory.rooms[candidates[i].name].home = thisroom.name;
                        thisroom.memory.outposts.splice(0,0,(candidates[i]));
                        console.log(thisroom.memory.outposts.length)
                        stop = stop + candidates[i].sources;
                    }
                }
            }
        }
        
    }
}

module.exports = roomexplore;