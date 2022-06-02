//To try to reduce confusion in this application:
//I have tried to remain consistent in naming the many different moving parts.
//the BOARD is referencing the BOARD variable which keeps track of the cells 'memory'  [[0,1, 'empty'],[0,2, 'base']]
//the map is in reference to what the user sees on the front end.
//bcoord refers to array/BOARD coordinate [y,x] mcoord refers to map coordinate 'y - x'



//Compare [] -> [[],[]] to see if 1 is in other. Due to formula of index only need to compare index's to know if true.
function arrayCompare(array1, array2, checkStyle){
    index = array1[2];
    for (element of array2){
        if (element[2] === index && checkStyle === 'bool'){
            return true;
        }
        if (element[2] === index && checkStyle === 'index'){
            return array2.indexOf(element);
        }
    }
}

// Choosing a random number. Useful function throughout app.
function randomNum(x) {
    return Math.floor(Math.random() * x)+1
}

//Finding cell easily in BOARD, handy function throughout app, reduces some tedious code.
function findIndex(bCoord){
    index = bCoord[0] * HEIGHT + bCoord[1];
    indexTotal = (HEIGHT) * (WIDTH)
    if (index <= indexTotal && index >= 0){
        return index;
    }
}

//find the Html mCoord, jQuery
function findHtmlId(bCoord){
    return $(`#${bCoord[0]}-${bCoord[1]}`);
}

//Keeps BOARD updated on map state.
function updateBOARD(bCoord, status){
    let index = findIndex(bCoord);
    BOARD[index].pop();
    
    BOARD[index].push(status);
    return true;
}

//gives cells class
function updateMap(bCoord, style){
    const $coordId = findHtmlId(bCoord);
    $coordId.attr('class', style);
    imgMap($coordId);
    return true;
}

//update both map and board
function updateBoth(bCoord, style){
    updateBOARD(bCoord, style);
    updateMap(bCoord, style);
}


//give mcoord class and image, jQuery
function imgMap($mCoord){
    const img = $("<img>");
    if ($mCoord.hasClass('soldier p1')){
        imgUrl = "static/images/square1.png";
    }
    if ($mCoord.hasClass('soldier p2')){
        imgUrl = "static/images/circle1.png";
    }
    if ($mCoord.hasClass('terrain')){
        imgUrl = "static/images/forestterrain.png"
    }
    img.attr('src', imgUrl);
    img.appendTo($mCoord);
}

//removes mcoord class and img, given bCoord
function removeStatus(bCoord){
    BOARD[findIndex(bCoord)].pop();
    BOARD[findIndex(bCoord)][3] = 'empty';
    let mCoord = findHtmlId(bCoord);
    mCoord.removeAttr('class');
    mCoord.removeAttr('type');
    mCoord.attr('class', 'empty')
    mCoord.empty();
}

//checks within array for certain array by index. If there removes.
function removeArray(bCoord, array){
    index = findIndex(bCoord);
    for (element of array){
        if (element[3] === index){
            array.splice(array.indexOf(element), 1);
            
        }
    }
}

function returnStyle(bCoord, checkStyle, style){
    const checkArray = coordCheck(bCoord, checkStyle);
    const returnArray = [];
    for (element of checkArray){

        const BOARDCoord = BOARD[element[2]];
        if (BOARDCoord[3] === style){
            returnArray.push(element);
        }
    }
    return returnArray;
}