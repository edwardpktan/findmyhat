const prompt = require('prompt-sync')({ sigint: true });
const clear = require('clear-screen');

// Create Global Variables
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const height = 10;  // creating 10 x 10 field
const width = 10;   // creating 10 x 10 field
const randomHoles = Math.floor(Math.random() * 6) + 15; // Generates random number between 15 and 20
const field = [];   // empty array

generateField = () => {

    for (let row = 0; row < height; row++) {
        field[row] = [];
        for (let col = 0; col < width; col++) {
            field[row].push(fieldCharacter);
        }
    }

    // Placing hat in the random position in the field
    let hatRow;
    let hatCol;
    do {
        hatRow = Math.floor(Math.random() * height);
        hatCol = Math.floor(Math.random() * width);
    } while (field[hatRow][hatCol] !== fieldCharacter);
    field[hatRow][hatCol] = hat;

    // Placing 15 to 20 random holes in the field
    let holesCreated = 0;
    while (holesCreated < randomHoles) {
        const row = Math.floor(Math.random() * height);
        const col = Math.floor(Math.random() * width);
        if (field[row][col] === fieldCharacter) {
            field[row][col] = hole;
            holesCreated++;
        }
    }

    // To print the starting position of the pathCharacter on the field
    field[0][0] = pathCharacter;

    return field;
}

print = () => {
    clear();

    const displayString = field.map(row => {
        return row.join('');
    }).join('\n');
    console.log(displayString);
}

askQuestion = () => {
    const input = prompt("Which way? ");

    if (input.toLowerCase() === "u") {
        return [-1, 0];
    } else if (input.toLowerCase() === "d") {
        return [1, 0];
    } else if (input.toLowerCase() === "l") {
        return [0, -1];
    } else if (input.toLowerCase() === "r") {
        return [0, 1];
    } else {
        console.log("Enter (u, d, l or r)");
        return askQuestion();
    }
}

// Calculate the new position of pathCharacter after moving 
getPathCharPosition = (pathCharPos, move) => {
    const row = pathCharPos[0] + move[0];
    const col = pathCharPos[1] + move[1];

    return [row, col];
}

// Check if pathCharacter is out of bounds
isOutOfBounds = nextMove => {
    const [row, col] = nextMove;
    // check if pathCharacter is a negative value. if it is, then it's beyond/outside the starting [0, 0] position. To check on the left and top of field.
    if (row < 0 || col < 0) {
        return true;
    }
    // check if pathCharacter is a more than or equals to 10. if it is, then it's beyond/outside the bottom right position [9, 9]. to check on the right and bottom of field.
    if (row >= height || col >= width) {
        return true;
    }
    return false;
}

startGame = () => {
    let isPlaying = true;
    let pathCharPos = [0, 0];

    while (isPlaying) {   // (isPlaying == true)
        print();

        const move = askQuestion();   // making a move by answering the question
        const nextMove = getPathCharPosition(pathCharPos, move);     // calculate position after moving

        if (isOutOfBounds(nextMove, field)) {                // if move into an empty array
            console.log("Out of bounds - Game Over!");
            return;
        } else if (field[nextMove[0]][nextMove[1]] === hat) {
            console.log("Congrats, you found your hat!");
            return;
        } else if (field[nextMove[0]][nextMove[1]] === hole) {
            console.log("Sorry, you fell down a hole!");
            return;
        }

        // moving pathCharacter in the field
        field[pathCharPos[0]][pathCharPos[1]] = pathCharacter;  // position of pathCharacter before move
        pathCharPos = nextMove;                                 // updating the move of pathCharacter
        field[pathCharPos[0]][pathCharPos[1]] = pathCharacter;  // position of pathCharacter after move
    }
}

generateField();
startGame();
