/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var buildroad = {

    run: function(frompos, topos) {
        
        var path = PathFinder.search(frompos, {pos: topos, range: 1}, {swampCost: 1, plainCost: 1});
        
        let maxsites = true
        
        for (var i in path.path) {
            if (Object.keys(Game.constructionSites).length < 80) {
                Game.rooms[path.path[i].roomName].createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            }
            else {maxsites = false}
        }
        return maxsites
    }
}

module.exports = buildroad;