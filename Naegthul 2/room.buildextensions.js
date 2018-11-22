/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var roombuildextensions = {

    run: function(thisroom, a_posstructures, a_spawns, num_extensions, controllerlevel) {
        let roomname = thisroom.name
        if ( Object.keys(Game.constructionSites).length <= 80 && ((num_extensions < 5  && controllerlevel == 2) || (num_extensions < 10  && controllerlevel == 3) || (num_extensions < 20  && controllerlevel == 4) || (num_extensions < 30  && controllerlevel == 5))) {
            let buildrange = 5;
            let buildpos = [];
            
            for (let z in a_posstructures) {
                
                for (let x = -buildrange; x <= buildrange; x++) {
                    for (let y = -buildrange; y <= buildrange; y++) {
                        if (!(a_posstructures[z].y - buildrange - 1 < 1 || a_posstructures[z].x - buildrange - 1 < 1 || a_posstructures[z].y + buildrange + 1 > 48 || a_posstructures[z].x + buildrange + 1 > 48)){
                            let area = thisroom.lookAtArea(a_posstructures[z].y + y - 1, a_posstructures[z].x + x - 1, a_posstructures[z].y + y + 1, a_posstructures[z].x + x + 1, true);
                            let bad = _.filter(area, (tile) => (tile.terrain == "wall") || (tile.type == "structure" ) || (tile.type == "constructionSite"));
                            if (bad.length == 0) {
                                let x1 = a_posstructures[z].x + x;
                                let y1 = a_posstructures[z].y + y;
                                buildpos.push ({"x": x1,"y": y1});
                                
                            }
                        }
                    }
                }
            }
         
            let i_rnd = Math.floor(Math.random()*buildpos.length)
    
            let buildpospos1 = new RoomPosition(buildpos[i_rnd].x, buildpos[i_rnd].y, roomname);
            let extpos = [{x:-1, y:-1},{x:1,y:-1},{x:0,y:0},{x:-1,y:1},{x:1,y:1}];
            let roadpos = [{x:-1, y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];
            for (let i in extpos) {
                let t = thisroom.createConstructionSite((buildpos[i_rnd].x + extpos[i].x), (buildpos[i_rnd].y + extpos[i].y), STRUCTURE_EXTENSION);
            }
            for (let i in roadpos) {
                let t = thisroom.createConstructionSite((buildpos[i_rnd].x + roadpos[i].x), (buildpos[i_rnd].y + roadpos[i].y), STRUCTURE_ROAD);
            }
            let path = PathFinder.search(a_spawns[0].pos, {pos: buildpospos1, range: 1}, {swampCost: 1, plainCost: 1});
            for (let i in path.path) {
                thisroom.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            };          
        }
    }
}

module.exports = roombuildextensions;