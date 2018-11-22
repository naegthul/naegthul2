/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomcheckrole = {

    run: function(roomname) {
        var roommyspawn = require("room.myspawn");
        var roomminingoutpost = require("room.miningoutpost");
        
        if (Memory.rooms[roomname].role == "startroom" || (Memory.rooms[roomname].spawns && _.filter(Memory.rooms[roomname].spawns, (spawn) => spawn.owner == "Naegthul").length > 0)) {
            roommyspawn.run(roomname)
        }
        else if (Memory.rooms[roomname].role == "miningoutpost"){
            roomminingoutpost.run(roomname)
        }
        
    }
}

module.exports = roomcheckrole;