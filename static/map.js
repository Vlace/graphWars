// Creating the HTML map of game. HTMl table representing the BOARD.
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
    //checking to see which side of map to draw on. Due to way map is configured, hard code is nesc.
    if (player === p1){
        let y = 0;
        let bottom = [[y,x+1],[y,x+2],[y,x+3],[y,x+4]];
        let side = [[y+1,x],[y+2,x],[y+1,x+5],[y+2,x+5]];
        let corner = [[y,x],[y,x+5],[y+3,x],[y+3,x+5]];
        let gate = [[y+3,x+1],[y+3,x+4]];
        let base = [bottom, side, corner, gate, p1];
        return base;
    }
    else{
        let y = HEIGHT - 1;
        let bottom = [[y,x+1],[y,x+2],[y,x+3],[y,x+4]];
        let side = [[y-1,x],[y-2,x],[y-1,x+5],[y-2,x+5]];
        let corner = [[y,x],[y,x+5],[y-3,x],[y-3,x+5]];
        let gate = [[y-3,x+1],[y-3,x+4]];
        let base = [bottom, side, corner, gate, p2];
        return base;
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
// TO IMPLIMENT: checks to make sure paths still exist between bases
function createTerrain(){
    indexArray = [];
    // terrain quantity
    const terrainQuantity = (randomNum(6)+5)*9;
    //terrain coordinates for CSS
    const terrainSet = [];
    
    for(let i=0; i<=terrainQuantity; i++){
        //indiv terrain size
        const terrainY = randomNum(3)+2;
        const terrainX = randomNum(HEIGHT/5);
        //terrain origin point
        const originY = randomNum(HEIGHT-10) + 1;
        const originX = randomNum(WIDTH - 10) + 1;
                
                
        for(let ycoord = 0; ycoord <= terrainY; ycoord++){

            for (let j = 0; j <= terrainX; j++){
                let index = findIndex([originY + ycoord, originX + j]);
                    if(validCheck([originY + ycoord, originX + j], 'terrain')){
                        if (!indexArray.includes(index)){
                        terrainSet.push();
                        indexArray.push(index);
                        updateBoth([originY + ycoord, originX +j], 'terrain');
                    }
                }
            }
        }
    }
    // getCell(4, terrainSet, 'p');
}

//checks to see if coordinates are valid before adding new class/terrain/soldiers. Checks MAP.
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
    
    if(BOARD[indexFinder][3] === 'empty'){
        return true;
    }
    else{
        return false;
    }
}
//TODO format this differently to account for when game is two-four players.
makeHtmlMap();
const P1BASE = makeHtmlBase(p1);
const P2BASE = makeHtmlBase(p2);

drawBaseHtml(P1BASE, P2BASE);
createTerrain();


