/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roomcreateorder = {

    run: function(roomname, rolenew, max, target, targetroomname, loadoutnew, targetcaption) {
        console.log(targetcaption)
        if (targetcaption.length > 0) {targetcaption = targetcaption+"-"};
        for (let k = 1; k <= max; k++) {
            
            let s_name = "R"+Memory.rooms[roomname].roomnumber+"-"+targetcaption+(rolenew.slice(0,1)).toUpperCase()+k; 
            
            
            
            if (((_.filter(Game.creeps, (creep) => creep.name && creep.name == s_name)).length == 0 && ((_.filter(Memory.rooms[roomname].createorders, (order) => order.name == s_name)).length == 0))) {
                Memory.rooms[roomname].createorders.push ({name: s_name, target: target.id, targetroom: targetroomname, role: rolenew, loadout: loadoutnew, home: roomname});
                
            }
        }
        
    }
}

module.exports = roomcreateorder;