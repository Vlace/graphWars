//To try to reduce confusion in this application:
//I have tried to remain consistent in naming the many different moving parts.
//the board is referencing the board variable which keeps track of the cells 'memory'  [[0,1, 'empty'],[0,2, 'base']]
//the map is in reference to what the user sees on the front end.
//bcoord refers to array/board coordinate [y,x] mcoord refers to map coordinate 'y - x'
const HEIGHT = 25
const WIDTH = 25
const board = [];
let p1soldierArray = [];
let p2soldierArray = [];
const terrainRes = [];
const p1resourceBCoords = [];
const p2resourceBCoords =[];
let playerTurn = 'p1';
let opposite = 'p2'
let turnPoints = 20;
let totalPoints = 10;
let round = 0;
let p1Resources = 0;
let p2Resources = 0;
let timer = 15;
let turnPhase = 0;
let p1SoldierCount = 0;
let p2SoldierCount = 0;

//timer function
setInterval(function(){
    if (round === 0 && turnPhase === 0){
        $('#phase').html('Phase: Scouting')
        turnPhase ++;
        round ++;
    }

    if (turnPhase === 0 && timer === 0){
        turnPhase = 1;
        timer = 7;
        $('#phase').html('Phase: Recap')
    }
    if (turnPhase === 1 && timer === 0){
        turnPhase = 0;
        timer = 63;
        $('#phase').html('Phase: Deployment')
    }
    if (timer > 0){
        timer --;
        $('#timer').html(`Timer: ${timer}`);
    }
}, 1000)

class Player{
    constructor(name, shape, resources, soldierCount, soldierArray){
        this.name = name;
        this.shape = shape;
        this.resources = resources;
        this.soldierCount = soldierCount;
        this.soldierArray = soldierArray
    }
    
    
}
p1 = new Player('p1', 'square', 0, 0, []);
p2 = new Player('p2', 'square', 0, 0, []);


function enemy(player){
    let enemy = 'p2'
    if (player === 'p2'){
        enemy = 'p1';
    }
    return enemy;
}

function arrayCompare(array1, array2){
    index = array1[2];
    for (element of array2){
        console.log(element[2], index)
        if (element[2] === index){
            return true;
        }
    }
}
class Terrain{
    constructor(name){
        this.name = name
    }
}

// Choosing a random number. Useful function throughout app
function randomNum(x) {
    return Math.floor(Math.random() * x)+1
}

function elementRemove(arr, value){
    let arr1 = arr.indexOf(value);
    return arr.splice(arr1, 1);
}

function createStyle(settingVar, bCoord){
    let setting = settingVar;
    htmlId= findHtmlId(bCoord)
    if (setting ===  'addSoldier'){
        
    }
}

//Finding cell easily in board, handy function throughout app, reduces some tedious code.
function findIndex(bCoord){
    return bCoord[0]*HEIGHT + bCoord[1];
}


function findHtmlId(bCoord){
    return $(`#${bCoord[0]}-${bCoord[1]}`);
}
//creates a player profile for people ie shape preference, general, name etc.
function createPlayer(player){
    
}

// Creating the HTML map of game. HTMl table representing the board.
function makeHtmlMap() {
    const htmlMap = document.querySelector('#map');

    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement('tr');
        
        for (let x = 0; x < WIDTH; x++){
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            cell.setAttribute('class', 'empty');
            cell.setAttribute('y', y);
            cell.setAttribute('x',x);
            //for css to color tr borders correctly
            if (y % 5 == 0){
                row.setAttribute('class', 'color5');
            }
            row.append(cell);
        }
        htmlMap.append(row);
    }
}

//Creating the 'behind the scenes' memory for the front end. Refered to as board to separate from HtmlMap Board[y,x,status]
function makeBoard(){
    for (let y = 0; y < HEIGHT; y++){
        for(let x=0; x < WIDTH; x++){
            coord = [];
            coord = [y,x,'empty'];
            board.push(coord); 
        }

    }
}
//Keeps board updated on map state.
function updateBoard(bCoord, status){
       let index = findIndex(bCoord);
       let counter = 0;
       board[index].pop();
       board[index].push(status);
       if (status === 'terrain' || status === 'soldier'){
           board[index].push(counter);
       }
       
}

function updateMap(bCoord, style){
    const $coordId = findHtmlId(bCoord);

    $coordId.attr('class', style);
}

//Creating the bases of the teams
function makeHtmlBase(player) {
    let x = randomNum(WIDTH);
    
    //Making sure when drawing base it is not off table
    if (x > WIDTH - 8){
        x = WIDTH - 8;
    }
    if(x < 3){
        x = 2
    }
    //checking to see which side of map to draw on.
    if (player == 'p1'){
        let y = 0;
        let bottom = [[y,x+1],[y,x+2],[y,x+3],[y,x+4]];
        let side = [[y+1,x],[y+2,x],[y+1,x+5],[y+2,x+5]];
        let corner = [[y,x],[y,x+5],[y+3,x],[y+3,x+5]];
        let gate = [[y+3,x+1],[y+3,x+4]];
        let base = [bottom, side, corner, gate, 'p1'];
        return base;
    }
    else{
        let y = HEIGHT - 1;
        let bottom = [[y,x+1],[y,x+2],[y,x+3],[y,x+4]];
        let side = [[y-1,x],[y-2,x],[y-1,x+5],[y-2,x+5]];
        let corner = [[y,x],[y,x+5],[y-3,x],[y-3,x+5]];
        let gate = [[y-3,x+1],[y-3,x+4]];
        let base = [bottom, side, corner, gate, 'p2'];
        return base;
    } 
    }



        


const P1BASE = makeHtmlBase('p1');
const P2BASE = makeHtmlBase('p2');

//This function is useful for labeling cells within the HTML Table
function getCell(x, mapType, player){
    //The first four statements are for labeling base components.
    if (x === 0){
        structure = `base bottom ${player}`
        type = 'base'
    }
    if (x === 1){
        structure = `base side ${player}`
        type = 'base'
    }
    if (x === 2){
        structure = `base corner ${player}`
        type = 'base'
    }
    if (x === 3){
        structure = `base gate ${player}`
        type = 'base'
    }
    //This statement is for terrain creation.
    if (x === 4){
        structure = 'terrain'
        type = 'terrain'
        img = 'static/images/forestterrain.png'
    }

    for (bCoord of mapType){
        const cell = document.getElementById(`${bCoord[0]}-${bCoord[1]}`);
        const cellArray = [bCoord[0],bCoord[1]];
        if (cell){
            if(validCheck(cellArray, type)){
        cell.setAttribute('type', type);
        cell.setAttribute('class', structure);
        if (structure ==='terrain'){
        const img = $("<img>");
        imgUrl = "static/images/forestterrain.png";
        img.attr('src', imgUrl)
        img.appendTo(cell);}


        updateBoard(bCoord,structure)}
        }
    }
}

//creating the base
function drawBaseHtml(base, base2) {
    for (x=0; x <= 3; x++){
        getCell(x, base[x], base[4]);
    }
    for (x=0; x <= 3; x++){
        getCell(x, base2[x], base2[4]);
    }
}

//creating the terrain, 
// TO IMPLIMENT: checks to make sure paths still exist between bases, and bases aren't blocked && new types of terrain, mountain, river, forest
function createTerrain(){
    // terrain quantity
    const terrainQuantity = (randomNum(2)+2)*2;
    //terrain coordinates for CSS
    const terrainSet = [];
    
        for(let i=0; i<=terrainQuantity; i++){
            //indiv terrain size
            const terrainY = randomNum(2)+1;
            const terrainX = randomNum(HEIGHT/5);
            //terrain origin point
            const originY = randomNum(HEIGHT-10) + 1;
            const originX = randomNum(WIDTH - 10) + 1;
                
                
            for(let ycoord = 0; ycoord <= terrainY; ycoord++){

                for (let j = 0; j <= terrainX; j++){
                        terrainSet.push([originY + ycoord, originX +j]);
                    }}
        }

    getCell(4, terrainSet);
}

//checks to see if coordinates are valid before adding new class/terrain/soldiers. 
function validCheck(coordinate, type){
    const indexFinder = coordinate[0]*HEIGHT + coordinate[1]
    if (type === "terrain"){
        for(let i = 1; i <= 2; i++){
            if(
                //TODO: I think there is redundancy here, will take a closer look at formula.
            $(`#${coordinate[0] + i}-${coordinate[1]}`).hasClass('base') ||
            $(`#${coordinate[0]}-${coordinate[1] + i}`).hasClass('base') ||
            $(`#${coordinate[0] + i}-${coordinate[1] + i}`).hasClass('base') ||
            $(`#${coordinate[0] - i}-${coordinate[1]}`).hasClass('base') ||
            $(`#${coordinate[0]}-${coordinate[1] - i}`).hasClass('base') ||
            $(`#${coordinate[0] - i}-${coordinate[1] - i}`).hasClass('base') ||
            $(`#${coordinate[0] - 1}-${coordinate[1] + 1}`).hasClass('base') ||
            $(`#${coordinate[0] + 1}-${coordinate[1] - 1}`).hasClass('base') ||
            $(`#${coordinate[0] + i}-${coordinate[1] + 1}`).hasClass('base') ||
            $(`#${coordinate[0] + i}-${coordinate[1] - 1}`).hasClass('base') ||
            $(`#${coordinate[0] + 1}-${coordinate[1] + i}`).hasClass('base') ||
            $(`#${coordinate[0] - 1}-${coordinate[1] + i}`).hasClass('base')
            ){
                return false;
            }
    }}
    
    if(board[indexFinder][2]==='empty'){
        return true;
    }
    else{
        return false;
    }
}


//placing soldiers TO REVISE: scale down redundant code.
function createSoldier(evt ,bCoord){
    let bool = 0;
    if (board[findIndex(bCoord)][2] === 'empty'){
        if (p1SoldierCount === 0 && playerTurn === 'p1'){
            if (validateSoldier(bCoord, 'soldierStart')){
            bool = 1;
            p1SoldierCount ++;
            }
        }
        if (p1SoldierCount > 0 && playerTurn === 'p1' && bool === 0){
            if (validateSoldier(bCoord, 'soldierAdd')){
            bool = 1;
            p1SoldierCount ++;
            }
        }
        if (p2SoldierCount === 0 && playerTurn === 'p2'){
            if (validateSoldier(bCoord, 'soldierStart')){
            bool = 2;
            p2SoldierCount ++;
            }
        }
        if (p2SoldierCount > 0 && playerTurn === 'p2' && bool === 0){
            if (validateSoldier(bCoord, 'soldierAdd')){
            bool = 2;
            p2SoldierCount ++;
            }
        }

        if (bool === 1 || bool == 2){
        updateMap(bCoord, `soldier ${playerTurn}`)
        //gathering resources
        if (returnNumber(bCoord, 'surround', 'terrain', 'array')){}
        if (validateSoldier(bCoord, 'checkSoldier', 'surround')){}
        updateBoard(bCoord, `soldier ${playerTurn}`)
        turnPoints --;

        const img = $("<img>");
        if (playerTurn === 'p1'){imgUrl = "static/images/square1.png";}
        else{imgUrl = 'static/images/circle1.png'}
        img.attr('src', imgUrl)
        img.appendTo(evt.target);
        bool = 0;
    }
    }  
    
}

//TO REVISIT. The terrain creation might be moved to use this function. Reducing redundancy
function coordCheck(coordinate, checkStyle){
    
    let x = 1;
    let i = 1;

    const downi= [coordinate[0] + i, coordinate[1]];
    const upi=[coordinate[0] - i, coordinate[1]];
    const lefti=[coordinate[0], coordinate[1] - i];
    const righti=[coordinate[0], coordinate[1] + i];
    const diagUpiLeftx=[coordinate[0] - i, coordinate[1] - x];
    const diagUpiRightx=[coordinate[0] - i, coordinate[1] + x];
    const diagDowniRightx=[coordinate[0] + i, coordinate[1] + x];
    const diagDowniLeftx=[coordinate[0] + i, coordinate[1] - x];
    const diagUpxLefti=[coordinate[0] - x, coordinate[1] - i];
    const diagUpxRighti=[coordinate[0] - x, coordinate[1] + i];
    const diagDownxRighti=[coordinate[0] + x, coordinate[1] + i];
    const diagDownxLefti=[coordinate[0] + x, coordinate[1] - i];

    const cross = [downi,upi,lefti,righti];
    if (checkStyle === 'cross'){
        return cross;
    }
    const horizontal = [lefti, righti];
    if (checkStyle === 'horizontal'){
        return horizontal;
    }
    const surround = [downi,upi,lefti,righti,diagUpiLeftx, diagUpiRightx, diagDowniLeftx, diagDowniRightx];
    if (checkStyle === 'surround'){
        return surround;
    }



}

//return the number of times something is configured next to other coordinates.
function returnNumber(bCoord, checkStyle, checkType, desireReturn){
    coordChecker = coordCheck(bCoord, checkStyle);
    counter = 0;
        for (coords of coordChecker){
            index = findIndex(coords);
            if (desireReturn === 'counter'){
                if (board[index][2] === checkType){
                    counter ++;
                }
            }
            if (desireReturn === 'array'){
                if (board[index][2] === checkType){
                    if (checkType === 'terrain'){
                        coords.push(index)
                        if (!arrayCompare(coords, terrainRes)){
                            terrainRes.push(coords)}
                        
                    }
                }
            }
        }
    return counter = 0;
}  


//Check whether PLACING soldier is valid.
function validateSoldier(bCoord, checkType){
    if (checkType === 'soldierStart'){
        arrayReturn = coordCheck(bCoord, 'horizontal');
    }

    if (checkType === 'soldierAdd'){
        arrayReturn = coordCheck(bCoord, 'cross');
    }

    if (checkType === 'resourceGathering'){
        arrayReturn = coordCheck(bCoord, 'surround')
    }
    
    if(checkType === 'soldierCheck'){
        arrayReturn = coordCheck(bCoord, 'surround')
    }

    for (let bYX of arrayReturn){
            let checkCoord= board[findIndex(bYX)];

            if (findIndex(bYX) >= 0){
                
                if(checkCoord[2] === `base gate ${playerTurn}` && checkType === 'soldierStart'){
                    if (playerTurn === 'p1'){
                        p1soldierArray.push(bCoord)
                    }else{p2soldierArray.push(bCoord)}
                    return true;

                    
                }
            
                if(checkCoord[2] === `soldier ${playerTurn}` && checkType === 'soldierAdd'){
                    if (playerTurn === 'p1'){
                        p1soldierArray.push(bCoord)
                    }else{p2soldierArray.push(bCoord)}
                    return true;
                }

            }
    }
}


//Checks to see if at least three soldiers are connected to it, if so remove from map
function resourceCheck(){
    const removalArray = [];
   for (terrainCoords of terrainRes){
        let checker = coordCheck(terrainCoords, 'surround');
        let counter =0;
        
        for (let bCoord of checker){
           let soldierCheck = board[findIndex(bCoord)][2];
           if (soldierCheck === `soldier ${playerTurn}`){
               counter ++;
           }
           if (counter === 3){
            updateMap(terrainCoords, 'empty')
            removeStatus(terrainCoords);
            removalArray.push(terrainCoords);
            if (playerTurn === 'p1'){
                p1Resources ++;
            }else{p2Resources ++}
            break;
            }
           
           }
           
        }
    for (let removal of removalArray){
        const index = terrainRes.indexOf(removal)
        terrainRes.splice(index, 1);
    }
        
        
}
//Checks to see if at least two enemy soldiers are connected to it, if so remove from map
function soldierCheck(){
    const removalArray = [];
    let playerArray = [];
    if (playerTurn === 'p1'){
        playerArray = p2soldierArray;
        console.log(1, playerArray);
    } else {playerArray = p1soldierArray;
            console.log(2, playerArray)}
    
    for (soldierCoords of playerArray){
        let checker = coordCheck(soldierCoords, 'surround')
        let counter =0;
        
        for (let bCoord of checker){
           let soldierCheck = board[findIndex(bCoord)][2];
           if (soldierCheck === `soldier ${enemy(opposite)}`){
               counter ++;
           }
           if (counter >= 2){
            updateMap(soldierCoords, 'empty')
            removeStatus(soldierCoords);
            counter =0;
            removalArray.push(soldierCoords);
            if (playerTurn === 'p1'){
                p2SoldierCount --;
            }
            else{p1SoldierCount --;}
           }
           
        }
        }
    for (let removal of removalArray){
        const index = playerArray.indexOf(removal)
        playerArray.splice(index, 1);
        if (playerTurn === 'p1'){
            p2soldierArray = playerArray;
        }else{p1soldierArray = playerArray}
    }
}

function removeStatus(bCoord){
    board[findIndex(bCoord)].pop();
    board[findIndex(bCoord)][2] = 'empty';
    let mCoord = findHtmlId(bCoord);
    mCoord.removeAttr('class');
    mCoord.removeAttr('type');
    mCoord.attr('class', 'empty')
    mCoord.empty();
}



function changeTurn(){
    if (playerTurn === 'p1'){
        playerTurn = 'p2';
        opposite = 'p1'
    }
    else{
        playerTurn = 'p1';
        opposite = 'p2'
        round += 1
    }
    turnPoints = 10;
    updateHtmlColumn();
}
//updates the right column after 'finalize' button is pressed.
function updateHtmlColumn(){
    if (playerTurn === 'p1'){
        
    }
    if (playerTurn === 'p2'){

    }
    $('#turnHtml').html(`PLAYER ${playerTurn} Turn`);
    $('#p1res').html(`P1 Resources: ${p1Resources}`);
    $('#p2res').html(`P2 Resources: ${p2Resources}`);
    $('#round').html(`Round: ${round}`);
}


makeBoard();
makeHtmlMap();
drawBaseHtml(P1BASE, P2BASE);
createTerrain();



$("#map").on("click", "td", function(evt){
        cY = parseInt(evt.target.getAttribute('y'));
        cX = parseInt(evt.target.getAttribute('x'));
        cYX = [cY, cX];

        if(turnPoints > 0){
            createSoldier(evt, cYX);}
        $('#turnPoints').html(`Turn Points: ${turnPoints}/${totalPoints}`);
        $('#p1sold').html(`P1 Soldiers: ${p1SoldierCount}`);
        $('#p2sold').html(`P2 Soldiers: ${p2SoldierCount}`);
})

$('#finalize').on('click', function(){
    //TO IMPLEMENT: Warning if player has not used all move points
    resourceCheck();
    soldierCheck();
    

    changeTurn();
})