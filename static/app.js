//To try to reduce confusion in this application:
//I have tried to remain consistent in naming the many different moving parts.
//the BOARD is referencing the BOARD variable which keeps track of the cells 'memory'  [[0,1, 'empty'],[0,2, 'base']]
//the map is in reference to what the user sees on the front end.
//bcoord refers to array/BOARD coordinate [y,x] mcoord refers to map coordinate 'y - x'
const newState = new gameState(7);

//TIMER function
setInterval(function(){
    if (newState.round === 0 && newState.turnPhase === 0){
        $('#phase').html('Scouting')
        newState.turnPhase = 1;
        newState.round ++;
    }

    if (newState.turnPhase === 1 && newState.timer === 0){
        newState.turnPhase = 2;
        newState.timer = 33;
        $('#phase').html('Deployment');
    }
    if (newState.turnPhase === 2 && newState.timer === 0){
        newState.turnPhase = 1;
        newState.timer = 7;
        $('#phase').html('Recap');
    }
    if (newState.timer > 0){
        newState.timer --;
        $('#timer').html(`Timer: ${newState.timer}`);
    }
}, 1000)


//Gets the player whose turn it is.
const pTurn = function(){
   for (let i = 0; i< PLAYERARRAY.length; i++){
       if (PLAYERARRAY[i].playerTurn === true){
           return PLAYERARRAY[i];
       }}
}

//placing soldiers TO REVISE: scale down redundant code.
function createSoldier(evt , bCoord){
    let bool = 0;
    if (BOARD[findIndex(bCoord)][3] === 'empty'){
        if (validateSoldier(bCoord, 'soldierStart')){
                bool = 1;
        }
        if (pTurn().soldierCount > 0 && bool === 0){
            if (validateSoldier(bCoord, 'soldierAdd')){
            bool = 1;
            }
        }
    
        if (bool === 1){
        pTurn().soldierCount ++;
        updateMap(bCoord, pTurn().soldierCall);
        //gathering resources
        if (returnNumber(bCoord, 'surround', 'terrain', 'array')){}
        if (validateSoldier(bCoord, 'checkSoldier', 'surround')){}
        updateBOARD(bCoord, pTurn());
        
        pTurn().turnPoints --;

        
        bool = 0;
    }
    } 
    //TO IMPLIMENT redoing moves from same turn.
    // if (BOARD[findIndex(bCoord)][3] === pTurn() && arrayCompare(bCoord, tempSoldierArray)){
    //     removeStatus(bCoord);
    //     turnPoints ++;
    //     bCoord.push(findIndex(bCoord));
    //     tempSoldierArray.push(bCoord);
    // }
    
}

//TO REVISIT. The terrain creation might be moved to use this function. Reducing redundancy
function coordCheck(coordinate, checkStyle){
    let checkArray = [];
    let arrayCopy = [];
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
        arrayCopy = cross;
    }
    const horizontal = [lefti, righti];
    if (checkStyle === 'horizontal'){
        arrayCopy = horizontal;
    }
    const surround = [downi,upi,lefti,righti,diagUpiLeftx, diagUpiRightx, diagDowniLeftx, diagDowniRightx];
    if (checkStyle === 'surround'){
        arrayCopy = surround
    }
    for (element of arrayCopy){
        if (element[0] >= 0 && element[0] < HEIGHT && element[1] < WIDTH && element[1] >= 0){
            element.push(findIndex(element));
            checkArray.push(element);
        }
    }
    return checkArray;
}

//return the number of times something is surrounded next to other coordinates.
function returnNumber(bCoord, checkStyle, checkType, desireReturn){
    coordChecker = coordCheck(bCoord, checkStyle);
    counter = 0;
        for (coords of coordChecker){
            index = findIndex(coords);
            if (index <= HEIGHT*WIDTH){
            if (desireReturn === 'counter'){
                if (BOARD[index][3] === checkType){
                    counter ++;
                }
            }
            if (desireReturn === 'array'){
                if (BOARD[index][3] === checkType){
                    if (checkType === 'terrain'){
                        coords.push(index)
                        if (!arrayCompare(coords, terrainRes)){
                            terrainRes.push(coords)}
                        
                    }
                }
            }}
        }
    return counter;
}  

function validateSoldier(bCoord, checkType){
    let arrayReturn = [];
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
            let checkCoord= BOARD[findIndex(bYX)];
            // TO IMPLIMENT putting disconnected soldiers back into validpath after reconnecting them in turn.
            // if (checkCoord[3] === pTurn()){
            //     soldierPath();
            // }
            if (findIndex(bYX) >= 0){
                
                if(checkCoord[3] === `base gate ${pTurn().name}` && checkType === 'soldierStart'){
                    bCoord.push(findIndex(bCoord));
                    pTurn().soldierArray.push(bCoord);
                    pTurn().validPath.push(bCoord);
                    pTurn().soldierPrime.push(bCoord);
                    return true;

                    
                }
            
                if(arrayCompare(checkCoord, pTurn().validPath, 'bool') && checkType === 'soldierAdd'){
                    bCoord.push(findIndex(bCoord));
                    pTurn().validPath.push(bCoord);
                    pTurn().soldierArray.push(bCoord);
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
           let soldierCheck = BOARD[findIndex(bCoord)][3];
           if (soldierCheck === pTurn()){
               counter ++;
           }
           if (counter === 3){
            updateMap(terrainCoords, 'empty')
            removeStatus(terrainCoords);
            removalArray.push(terrainCoords);
            
            break;
            }
           
           }
           
        }
    for (let removal of removalArray){
        const index = terrainRes.indexOf(removal)
        terrainRes.splice(index, 1);
        pTurn().resourceCount ++;
    }
        
        
}


//Runs at end of turn. Checks to see if enemy soldiers to be removed.
function soldierCheck(){
    for (soldier of pTurn().soldierArray){
        //coordCheck returns array of valid points that soldier touching.
        let crossArray = coordCheck(soldier, 'cross');
        for (coord of crossArray){
            //if coord in checked array is a soldier but not the main players ...continue
            if (findHtmlId(coord).hasClass('soldier') && BOARD[coord[2]][3] !== pTurn()){
                //if returned number is >= 2 remove soldier from map
                if (returnNumber(coord, 'cross', pTurn(), 'counter') >= 2){
                    //get player of soldier to be removed
                    const enemyPlayer = BOARD[coord[2]][3]
                    //remove from their array
                    removeArray(coord, enemyPlayer.soldierArray);
                    //remove from map & BOARD and update to empty
                    removeStatus(coord);

                }

            }
        }
    }
        
}

//Checks to see if soldier is 'connected' to base/barracks. Runs at beginning of turn.
function soldierPath(){
    let indexArray = [];
    let pathArray = [];
    //Start the path at base/barracks of player
    for (prime of pTurn().soldierPrime){
         indexArray.push(prime[2]);
         let soldierConnect = returnStyle(prime, 'cross', pTurn());
         for (element of soldierConnect){
            if (!indexArray.includes(element[2])){ 
                indexArray.push(element[2])
                pathArray.push(element)
            }
         }
    }
    //Check cross squares and if pTurn then put in valid path array. Ignore if not.
    for (element of pathArray){
        let soldierConnect = returnStyle(element, 'cross', pTurn());
        for (element of soldierConnect){
            if (!indexArray.includes(element[2])){ 
                indexArray.push(element[2])
                pathArray.push(element)
            }
         }
    }
    //If soldier not on valid path, validSoldier won't place soldier.
    pTurn().validPath = pathArray;
}


//changes turn to next player in row.
function changeTurn(){
    let index = 0;
    (pTurn().number + 1 < PLAYERARRAY.length)?index=pTurn().number+1:index=0;
    pTurn().playerTurn = false;
    PLAYERARRAY[index].playerTurn = true;
    PLAYERARRAY[index].turnPoints = 15;
    soldierPath();

}

//creates column with all current players.
function createHtmlColumn(){
    const $htmlColumn = $('#info');
    for (player of PLAYERARRAY){
        const $h4a = $("<h4></h4>");
        $h4a.attr('id', `${player.name}sold`);
        $h4a.html(`${player.name} soldiers: ${player.soldierCount}`);
        $htmlColumn.append($h4a);
        const $h4b = $("<h4></h4>");
        $h4b.attr('id', `${player.name}res`);
        $h4b.html(`${player.name} resources: ${player.resourceCount}`);
        $htmlColumn.append($h4b);
    }
}
//updates the right column after 'finalize' button is pressed.
function updateHtmlColumn(){
    $('#turnHtml').html(`${pTurn().name} Turn`);
    $(`#turnPoints`).html(`Turn points: ${pTurn().turnPoints}`)
    for (player of PLAYERARRAY){
    $(`#${player.name}sold`).html(`${player.name} soldiers: ${player.soldierCount}`);
    $(`#${player.name}res`).html(`${player.name} resources: ${player.resourceCount}`);
    
    $('#round').html(`Round ${newState.round}`);}
}






createHtmlColumn();

//update options button
$(".dropdown-menu").on("click", function(evt){
    evt.preventDefault()
    $('#dropdownMenuButton').html($(evt.target).html())
})

$('.navbar').on('click', function(evt){
    evt.preventDefault()

    if ($(evt.target).html() === 'Map'){
        $('#mapPage').show()
        $('#settings').hide()
    }
    if ($(evt.target).html() === 'Settings'){
        $('#mapPage').hide()
        $('#settings').show()
    }
})


$("#map").on("click", "td", function(evt){
        cY = parseInt(evt.target.getAttribute('y'));
        cX = parseInt(evt.target.getAttribute('x'));
        cYX = [cY, cX];
        if(pTurn().turnPoints > 0 && $('#dropdownMenuButton').html() === 'Deploy'){
            createSoldier(evt, cYX);
        }



        $('#turnPoints').html(`Turn Points: ${pTurn().turnPoints}/15`);
        $(`#${pTurn().name}sold`).html(`${pTurn().name} soldiers: ${pTurn().soldierCount}`);
})

$('.finalize').on('click', function(evt){
    
    //TO IMPLEMENT: Warning if player has not used all move points
    $('#dropdownMenuButton').html('Deploy');
    resourceCheck();
    soldierCheck();
    changeTurn();
    updateHtmlColumn();}
        
    )