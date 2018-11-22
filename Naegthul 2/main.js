//millitär, repairer für jeden outpost, neuer spawnraum,

module.exports.loop = function () {
    
    //INIT//MODULES//
    console.log(Object.keys(Game.constructionSites).length)
    var roominit = require("room.init");
    var roomcheckrole = require("room.checkrole");
    var roleminer = require("role.miner");
    var rolecarrier = require("role.carrier");
    var rolebuilder = require("role.builder");
    var roleclaimer = require('role.claimer');
    
    
    //CLEAN MEMORY
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    
    //INIT//STARTROOM//RESPAWN//
    
    
    if (!Memory.rooms || Game.spawns["Spawn1"].room.name != Memory.startroom) {
        delete Memory.rooms
        delete Memory.startroom
        roominit.run(Game.spawns["Spawn1"].room.name,"startroom");
    }
    
    
    //ROOM//ORDERS//
    for (let roomname in Memory.rooms) {
        roomcheckrole.run(roomname);
        
    }
    
    //CREEP//ORDERS//
    for (let name in Game.creeps) {
        let creep = Game.creeps[name]
        
        if (creep.memory.role == "miner") {roleminer.run(creep)};
        if (creep.memory.role == "carrier") {rolecarrier.run(creep)};
        if (creep.memory.role == "builder") {rolebuilder.run(creep)};
        if (creep.memory.role == "claimer") {roleclaimer.run(creep)};
    }
    
    
    
    /*
    Memory.tick = !Memory.tick
    Game.spawns["Spawn1"].room.memory.hallo = "hey"
    var rolesammler = require('role.sammler');
    var rolearbeiter = require('role.arbeiter');
    var rolebauer = require('role.bauer');
    var rolerepairer = require('role.repairer'); 
    var roledefender = require('role.defender');
    var roleclaimer = require('role.claimer');
    var rolecarrier = require('role.carrier');
    
    var roletower = require('role.tower');
    
    var i_maxsammler = 14;var i_maxsammlerfar = 8;var i_maxcarrier = 4;var i_maxarbeiter = 2;var i_maxbauer = 2;var i_bauernoroad = 2;var i_bauerfar = 2;var i_maxrepairer = 2;var i_maxdefender = 4;var i_maxclaimer = 2;
    
    var a_mycreeps = _.filter(Game.creeps, (creep) => creep.my);
    var a_mydonecreeps = _.filter(Game.creeps, (creep) => !creep.spawning);
   
    var a_sammler = _.filter(a_mycreeps, (creep) => creep.memory.role == 'sammler');
    var a_arbeiter = _.filter(a_mycreeps, (creep) => creep.memory.role == 'arbeiter');
    var a_bauer = _.filter(a_mycreeps, (creep) => creep.memory.role == 'bauer');
    var a_repairer = _.filter(a_mycreeps, (creep) => creep.memory.role == 'repairer');
    var a_defender = _.filter(a_mycreeps, (creep) => creep.memory.role == 'defender');
    var a_claimer = _.filter(a_mycreeps, (creep) => creep.memory.role == 'claimer');
    var a_carrier = _.filter(a_mycreeps, (creep) => creep.memory.role == 'carrier');
    
    var a_extensions = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION)
    var a_towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
    var a_containers = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_CONTAINER});
    var a_storages = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_STORAGE});
    var a_posstructures = [Game.spawns["Spawn1"].pos];
    for ( var i in a_extensions) {a_posstructures.push(a_extensions[i].pos)};
    for ( var i in a_towers) {a_posstructures.push(a_towers[i].pos)};
    for ( var i in a_containers) {a_posstructures.push(a_containers[i].pos)};
    for ( var i in a_storages) {a_posstructures.push(a_storages[i].pos)};

    
    var i_sammler = a_sammler.length;
    var i_arbeiter = a_arbeiter.length;
    var i_bauer = a_bauer.length;
    var i_repairer = a_repairer.length;
    var i_defender = a_defender.length;
    var i_claimer = a_claimer.length;
    var i_carrier = a_carrier.length;
    
    var i_towersbuilt = a_towers.length; 
    var i_containersbuilt = a_containers.length;
    var i_extensionsbuilt = a_extensions.length;
    var i_storagesbuilt = a_storages.length;
    
    var a_compsammler = [WORK,CARRY,MOVE,MOVE];
    var a_comparbeiter = a_compsammler;
    var a_compbauer = a_compsammler;
    var a_comprepairer = a_compsammler;
    var a_compdefender = [ATTACK,ATTACK,MOVE,MOVE];
    var a_compclaimer = [CLAIM,MOVE,MOVE];
    var a_compcarrier = [CARRY,CARRY,MOVE,MOVE];
    
    var roomlevel = 1;
    
    var num_extensions = (_.filter(Game.constructionSites, (site) => site.structureType == STRUCTURE_EXTENSION)).length + i_extensionsbuilt;
    var num_towers = (_.filter(Game.constructionSites, (site) => site.structureType == STRUCTURE_TOWER)).length + i_towersbuilt;
    var num_containers = (_.filter(Game.constructionSites, (site) => site.structureType == STRUCTURE_CONTAINER)).length + i_containersbuilt;
    var num_storages = (_.filter(Game.constructionSites, (site) => site.structureType == STRUCTURE_STORAGE)).length + i_storagesbuilt;

    
    var a_sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
    var a_controler = Game.spawns["Spawn1"].room.controller; 
    
    
    if (Game.spawns["Spawn1"].hits <= (Game.spawns["Spawn1"].hitsMax / 2)) {
        a_controler.activateSafeMode();
    }
    
//AUTOMAP

    if (Memory.room0 != Game.spawns["Spawn1"].room.name) {
        Memory.room0 = Game.spawns["Spawn1"].room.name;
    
        var room0exits = Game.map.describeExits(Memory.room0);
        Memory.room0ex = {"exleft": {},"exright": {},"extop": {},"exbottom": {}};

        Memory.room0ex["exleft"]["name"] = room0exits[7];
        Memory.room0ex["exright"]["name"] = room0exits[3];
        Memory.room0ex["extop"]["name"] = room0exits[1];
        Memory.room0ex["exbottom"]["name"] = room0exits[5];
    }
    
    //CHECKCONTROLLERS
    for (var i in Memory.room0ex){
        
        if (Memory.room0ex[i]["controllerid"] && Memory.room0ex[i]["controllerid"] != "none"){
            var controler = Game.getObjectById(Memory.room0ex[i]["controllerid"]);

            if (controler.level == 0 && controler.reservation) {
                
                if (controler.reservation.username && controler.reservation.username == "Naegthul"  ){
                    Memory.room0ex[i]["reserved"] = true;
                    for (var i in Memory.length) {
                        console.log(i)
                    }
                }
            }
            else{
                Memory.room0ex[i]["reserved"] = false;
            }
        }
    }
        

        
    
    
    
//AUTOTOWER

    if (num_towers < 1  && Game.spawns["Spawn1"].room.controller.level == 3) {
        var buildrange = 5;
        var buildpos = [];
        for (var x = -buildrange; x <= buildrange; x++) {
            for (var y = -buildrange; y <= buildrange; y++) {
                var area = Game.spawns["Spawn1"].room.lookAtArea(Game.spawns["Spawn1"].pos.y + y, Game.spawns["Spawn1"].pos.x + x, Game.spawns["Spawn1"].pos.y + y + 2, Game.spawns["Spawn1"].pos.x + x + 2, true);
                var bad = _.filter(area, (tile) => (tile.type == "terrain" && !(tile.terrain == "plain")) || (tile.type == "structure") || (tile.type == "constructionSite"));
                if (bad.length == 0) {
                    var x1 = Game.spawns["Spawn1"].pos.x + x + 1;
                    var y1 = Game.spawns["Spawn1"].pos.y + y + 1;
                    buildpos.push ({x: x1,y: y1});
                }
            }
        }
        var i_rnd = Math.floor(Math.random()*buildpos.length)
        var roadpos = [{x:-1, y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];

        var t = Game.spawns["Spawn1"].room.createConstructionSite((buildpos[i_rnd].x), (buildpos[i_rnd].y), STRUCTURE_TOWER);

        for (var i in roadpos) {
            var t = Game.spawns["Spawn1"].room.createConstructionSite((buildpos[i_rnd].x + roadpos[i].x), (buildpos[i_rnd].y + roadpos[i].y), STRUCTURE_ROAD);
        }
        var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: buildpos[i_rnd], range: 1}, {swampCost: 1, plainCost: 1});
        for (var i in path.path) {
            Game.spawns["Spawn1"].room.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
        };    
    }

//AUTOEXTENSIONS
    
    if ((num_extensions < 5  && Game.spawns["Spawn1"].room.controller.level == 2) || (num_extensions < 10  && Game.spawns["Spawn1"].room.controller.level == 3) || (num_extensions < 20  && Game.spawns["Spawn1"].room.controller.level == 4)) {
        var buildrange = 3;
        var buildpos = [];
        
        for (var z in a_posstructures) {
            
            for (var x = -buildrange; x <= buildrange; x++) {
                for (var y = -buildrange; y <= buildrange; y++) {
                    
                    var area = Game.spawns["Spawn1"].room.lookAtArea(a_posstructures[z].y + y - 1, a_posstructures[z].x - 1+ x, a_posstructures[z].y + y + 1, a_posstructures[z].x + x + 1, true);
                    var bad = _.filter(area, (tile) => (tile.terrain == "wall") || (tile.type == "structure" ) || (tile.type == "constructionSite"));
                    if (bad.length == 0) {
                        var x1 = a_posstructures[z].x + x;
                        var y1 = a_posstructures[z].y + y;
                        buildpos.push ({"x": x1,"y": y1});
                        
                    }
                }
            }
        }
        var i_rnd = Math.floor(Math.random()*buildpos.length)

        var buildpospos1 = new RoomPosition(buildpos[i_rnd].x, buildpos[i_rnd].y, Game.spawns["Spawn1"].room.name);
        var extpos = [{x:-1, y:-1},{x:1,y:-1},{x:0,y:0},{x:-1,y:1},{x:1,y:1}];
        var roadpos = [{x:-1, y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];
        for (var i in extpos) {
            var t = Game.spawns["Spawn1"].room.createConstructionSite((buildpos[i_rnd].x + extpos[i].x), (buildpos[i_rnd].y + extpos[i].y), STRUCTURE_EXTENSION);
        }
        for (var i in roadpos) {
            var t = Game.spawns["Spawn1"].room.createConstructionSite((buildpos[i_rnd].x + roadpos[i].x), (buildpos[i_rnd].y + roadpos[i].y), STRUCTURE_ROAD);
        }
        var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: buildpospos1, range: 1}, {swampCost: 1, plainCost: 1});
        for (var i in path.path) {
            Game.spawns["Spawn1"].room.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
        };          
    }


//AUTOROADS

    if (!Game.spawns["Spawn1"].memory.roads) {
        PathFinder.use(true);

        
        var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: a_controler.pos, range: 1}, {swampCost: 1, plainCost: 1});
        for (var i in path.path) {
            Game.spawns["Spawn1"].room.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
        };      
        
        for (var j in a_sources) {
            var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: a_sources[j].pos, range: 1}, {swampCost: 1, plainCost: 1});
            for (var i in path.path) {
                Game.spawns["Spawn1"].room.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            }
        }
        for (var j in a_sources) {
            var path = PathFinder.search(a_controler.pos, {pos: a_sources[j].pos, range: 1}, {swampCost: 1, plainCost: 1});
            for (var i in path.path) {
                Game.spawns["Spawn1"].room.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            }
        }
        Game.spawns["Spawn1"].memory.roads = true;
        
    }
    else {
        if (Game.spawns["Spawn1"].room.find(FIND_MY_CONSTRUCTION_SITES).length == 0 && (Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_ROAD}}) == 0)) {
            Game.spawns["Spawn1"].memory.roads = false;
        }
    }
    
    for (var z in Memory.room0ex){
        
        if (Memory.room0ex[z]["reserved"] && !Memory.room0ex[z]["roads"]) {
            
            var controler = Game.getObjectById(Memory.room0ex[z]["controllerid"]);
            
            var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: controler.pos, range: 1}, {swampCost: 1, plainCost: 1});
            console.log(path.path.length)
            for (var i in path.path) {
                Game.rooms[path.path[i].roomName].createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            };
            
            var farsources = Game.rooms[Memory.room0ex[z]["name"]].find(FIND_SOURCES);
            for (var j in farsources) {
                var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: farsources[j].pos, range: 1}, {swampCost: 2, plainCost: 1});
                for (var i in path.path) {
                    Game.rooms[path.path[i].roomName].createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
                }
            }
            Memory.room0ex[z]["roads"] = true;
        }
    }

//AUTOCONTAINER

    if ((num_containers < 4 || num_storages < 1) && roomlevel > 2) {
        var buildrange = 5;
        var buildpos = [];
        if (num_containers < 4) {
            var building = STRUCTURE_CONTAINER;
        }
        else if (num_storages < 1) {
            var building = STRUCTURE_STORAGE;
        }
        var area = Game.spawns["Spawn1"].room.lookAtArea(Game.spawns["Spawn1"].pos.y - buildrange, Game.spawns["Spawn1"].pos.x - buildrange, Game.spawns["Spawn1"].pos.y + buildrange, Game.spawns["Spawn1"].pos.x + buildrange);
        for (var i1 in area) {
            for (var j1 in area[i1]) {
                var bad = false;
                for (var k1 in area[i1][j1]) {
                    if (area[i1][j1][k1].type == "structure" || (area[i1][j1][k1].terrain == "wall")) {
                        bad = true;
                    }
                }
                if (!bad) {
                    buildpos.push ({x: j1,y: i1});

                }
            }
        }


        var i_rnd = Math.floor(Math.random()*buildpos.length);
        var buildpospos = new RoomPosition(buildpos[i_rnd].x, buildpos[i_rnd].y, Game.spawns["Spawn1"].room.name);

        var t = Game.spawns["Spawn1"].room.createConstructionSite(buildpospos, building);
        if (t==OK) {
            console.log("Neuer Container:" + buildpos[i_rnd])

            var path = PathFinder.search(Game.spawns["Spawn1"].pos, {pos: buildpospos, range: 1}, {swampCost: 1, plainCost: 1});
            for (var i in path.path) {
                Game.spawns["Spawn1"].room.createConstructionSite(path.path[i].x,path.path[i].y,STRUCTURE_ROAD)
            }
        }
        else {
            console.log("ERROR: " + t)
        }

    }

//CLEAN MEMORY
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


//CONSOLE
    console.log("Wir haben "+ i_sammler + "/" + i_maxsammler + " Sammler, "+ i_arbeiter + "/" + i_maxarbeiter + " Arbeiter, "+
        i_bauer + "/" + i_maxbauer+" Bauer, "+ i_repairer + "/" + i_maxrepairer +" Repairer, " + i_defender + "/" + i_maxdefender + " Defender, "+ 
        i_claimer + "/" + i_maxclaimer + " Claimer, "+i_carrier+"/"+i_maxcarrier+" Carrier.");

//LAGERPLATZ CHECKEN

    var i_maxstorage = Game.spawns["Spawn1"].room.energyCapacityAvailable;
    if (i_maxstorage >= 550) {
        roomlevel = 2;
    }
    if (i_maxstorage >= 800) {
        roomlevel = 3    
    };
    if (i_maxstorage >= 1300) {
        roomlevel = 4    
    }
    console.log("Max. Energy Storage: "+i_maxstorage);
    console.log("Energy Available: "+Game.spawns["Spawn1"].room.energyAvailable);

    
//CREEPS AUSRÜSTEN

    if (roomlevel >= 2 && i_sammler >= 3) {
        a_compsammler = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        a_comparbeiter = a_compsammler;
        a_compbauer = a_compsammler;
        a_comprepairer = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        a_compdefender = [ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
        a_compcarrier = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
    }
    if (roomlevel >= 3 && i_sammler >= 4) {
        a_compsammler = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        a_comparbeiter = a_compsammler;
        a_compbauer = a_compsammler;
        a_comprepairer = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        a_compdefender = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        a_compcarrier = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    }
    if (roomlevel >= 4 && i_sammler >= 2) {
        a_compsammler = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        a_compclaimer = [CLAIM,CLAIM,MOVE,MOVE];
        a_compcarrier = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    }    
    
    
//SPAWN 1 BUILDING?
var b_spawnbusy = Game.spawns["Spawn1"].spawning

//SAMMLER BAUEN
    if (!b_spawnbusy && i_sammler < i_maxsammler) {
        
        for (var i = 1; i <= i_maxsammler; i++){

            var s_name="Sammler" + i;   
            var a = Game.spawns['Spawn1'].createCreep(a_compsammler, s_name, {role: "sammler"})
            if (a == s_name) {
                console.log("Neuer Sammler: " + s_name);
                b_spawnbusy = true;
                i = i_maxsammler;
            }
            else if (a == ERR_NOT_ENOUGH_ENERGY && i_carrier > i_maxcarrier/2){
                b_spawnbusy = true;
                i = i_maxsammler;
            }
        }
    }
    
//CARRIER BAUEN
    if (!b_spawnbusy && i_carrier < i_maxcarrier && (i_containersbuilt + i_storagesbuilt) > 0) {
        
        for (var i = 1; i <= i_maxcarrier; i++){

            var s_name="Carrier" + i;   
            if (Game.spawns['Spawn1'].createCreep(a_compcarrier, s_name, {role: "carrier"}) == s_name) {
                console.log("Neuer Carrier: " + s_name);
                b_spawnbusy = true;
                i = i_maxcarrier;
            }
        }
    }
    
//ARBEITER BAUEN
    if (!b_spawnbusy && i_arbeiter < i_maxarbeiter) {
        
        for (var i = 1; i <= i_maxarbeiter; i++){

            var s_name="Arbeiter" + i;   
            if (Game.spawns['Spawn1'].createCreep(a_comparbeiter, s_name, {role: "arbeiter"}) == s_name) {
                console.log("Neuer Arbeiter: " + s_name);
                b_spawnbusy = true;
                i = i_maxarbeiter;
            }
        }
    }
    
//BAUER BAUEN
    if (!b_spawnbusy && i_bauer < i_maxbauer) {
        for (var i = 1; i <= i_maxbauer; i++){
            var s_name="Bauer" + i;   
            if (Game.spawns['Spawn1'].createCreep(a_compbauer, s_name, {role: "bauer"}) == s_name) {
                console.log("Neuer Bauer: " + s_name);
                b_spawnbusy = true;
                i = i_maxbauer;
            }
        }
    }
    
//CLAIMER BAUEN
    if ((!b_spawnbusy || (Game.rooms[Memory.room0].energyAvailable >= 1300 && i_claimer < 1)) && i_claimer < i_maxclaimer && roomlevel >= 3) {
        for (var i = 1; i <= i_maxclaimer; i++){
            var s_name="Claimer" + i;   
            if (Game.spawns['Spawn1'].createCreep(a_compclaimer, s_name, {role: "claimer"}) == s_name) {
                console.log("Neuer Claimer: " + s_name);
                b_spawnbusy = true;
                i = i_maxclaimer;
            }
        }
    }
    
//DEFENDER BAUEN
    if (!b_spawnbusy && i_defender < i_maxdefender) {
        for (var i = 1; i <= i_maxdefender; i++){
            var s_name="Defender" + i;   
            if (Game.spawns['Spawn1'].createCreep(a_compdefender, s_name, {role: "defender"}) == s_name) {
                console.log("Neuer Defender: " + s_name);
                b_spawnbusy = true;
                i = i_maxdefender;
            }
        }
    }
    
//REPAIRER BAUEN
    if (!b_spawnbusy && i_repairer < i_maxrepairer && roomlevel > 1) {
        
        for (var i = 1; i <= i_maxrepairer; i++){
            var s_name="Repairer" + i;   
            if (Game.spawns['Spawn1'].createCreep(a_comprepairer, s_name, {role: "repairer"}) == s_name) {
                console.log("Neuer Repairer: " + s_name);
                b_spawnbusy = true;
                i = i_maxrepairer;
            }
        }
    }
    
//BEFEHLE TOWER

    if (i_towersbuilt > 0) {
        for (var i in a_towers) {
            tower = a_towers[i];
            roletower.run(tower);
        }
    } 
//BEFEHLE CREEPS
    
    for (var i = i_sammler ; i > 0; i--) {
        if (_.filter(a_sammler, (creep) => creep.name == 'Sammler'+i)[0])
        if (i > (i_maxsammler - i_maxsammlerfar)) {
            _.filter(a_sammler, (creep) => creep.name == 'Sammler'+i)[0].memory.far = 1;
        }
        else {
            _.filter(a_sammler, (creep) => creep.name == 'Sammler'+i)[0].memory.far = 0;
        }
    }

    for (var i = 0; i < i_bauer; i++) {
        if (i < i_bauernoroad) {
            a_bauer[i].memory.priority = "noroad";
        }
        else if (i >= i_bauernoroad && i < (i_bauernoroad + i_bauerfar)) {
            a_bauer[i].memory.priority = "far"    
        }
        else{ 
        a_bauer[i].memory.priority = "none";
        }
    }

    for(var name in a_mydonecreeps) {
        var creep = a_mydonecreeps[name];
       
        if(creep.memory.role == 'sammler') {
            rolesammler.run(creep, i_storagesbuilt, i_containersbuilt);
        }

        else if(creep.memory.role == 'carrier') {
            rolecarrier.run(creep);
        }
        
        else if(creep.memory.role == 'arbeiter') {
            rolearbeiter.run(creep);
        }
       
        else if(creep.memory.role == 'bauer') {
            rolebauer.run(creep);
        }
        
        else if(creep.memory.role == 'repairer') {
            rolerepairer.run(creep);
        }
        
        else if(creep.memory.role == 'defender') {
            roledefender.run(creep);
        }
        
        else if(creep.memory.role == 'claimer') {
            roleclaimer.run(creep);
        }
    }
*/
}