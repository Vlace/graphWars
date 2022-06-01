const PLAYERARRAY = [];

class Player{
    constructor(name, number, shape, playerTurn, soldierCall){
    this.name = name;
    this.number = number;
    this.shape = shape;
    this.soldierCount = 0;
    this.resourceCount = 0;
    this.soldierArray = [];
    this.soldierCall = soldierCall
    this.playerTurn = playerTurn;
    this.turnPoints = 15;
    this.soldierPrime = [];
    this.validPath = [];
    }
}

const p1 = new Player('p1', 0, 'circle1.png', true, 'soldier p1');
const p2 = new Player('p2', 1, 'square1.png', false, 'soldier p2');

PLAYERARRAY.push(p1, p2);




