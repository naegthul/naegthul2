/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.checkrole');
 * mod.thing == 'a thing'; // true
 */
 
var buildsimple = {

    run: function(thisroom, buildrange, buildrangestop, startpos, building, pathfrompos) {
        let buildpos = [];
       
        let area = thisroom.lookAtArea(startpos.y - buildrange, startpos.x - buildrange, startpos.y + buildrange, startpos.x + buildrange);

  
        if (buildrangestop && buildrangestop > 0){
            for (let y = -buildrangestop; y <= buildrangestop; y++) {
                for (let x = -buildrangestop; x <= buildrangestop; x++) {
                    delete area[startpos.y + y][startpos.x + x];
                }
            }
        }

       
        for (let y1 in area) {
            for (let x1 in area[y1]) {
                let bad = false;
                for (let k1 in area[y1][x1]) {
                    //console.log(y1 +" "+ x1 + " " + area[y1][x1][k1].type + " " + area[y1][x1][k1].terrain)
                    if (area[y1][x1][k1].type == "structure" || (area[y1][x1][k1].terrain == "wall")) {
                        bad = true;
                        
                    }
                }
                if (!bad) {
                    buildpos.push ({x: x1,y: y1});
                }
            }
        }
        //console.log(buildpos[0].x +" "+buildpos[0].y)
        
        
        let i_rnd = Math.floor(Math.random()*buildpos.length);
        let buildpospos = new RoomPosition(buildpos[i_rnd].x, buildpos[i_rnd].y, thisroom.name);
        let t = thisroom.createConstructionSite(buildpospos, building);
        
        if (t==OK) {
            console.log("Neuer Container:" + buildpos[i_rnd])
        }    
        else {
            console.log("ERROR: " + t)
        }       
        
        if (pathfrompos) {
    
            let path = PathFinder.search(pathfrompos, {pos: buildpospos, range: 1}, {swampCost: 1, plainCost: 1});
            for (let i in path.path) {
                thisroom.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            }
        }
        return buildpos[i_rnd];
    }
    
}


module.exports = buildsimple;