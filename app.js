let gameView = document.querySelector('#gameView');
let ctx = gameView.getContext('2d');
let bubbles = [];
let checkedBubbles = [];
const bubbleSize = 85;
const bubbleRadius = 40;
const rows = 4;
const columns = 4;

let selectedIndexX = -1;
let selectedIndexY = -1;

let siblings1 = [];
let siblings2 = [];
const whiteColor = [255, 255, 255];

let score = 0;

const generateColor = function() {
    let color = Math.floor(Math.random() * (4 - 1)) + 1;
    if (color === 1) {
        return [255, 0, 0];
    } else if (color === 2) {
        return [0, 255, 0];
    } else {
        return [0, 0, 255];
    }
};

const generateBubbles = function() {
    for (let y = 0; y < rows; y++) {
        let row = [];

        for (let x = 0; x < columns; x++) {
            let bubbleColor = generateColor();
            row.push(bubbleColor);
        }
        bubbles.push(row);
    }
};

const initCheckedBubbles = function() {
    checkedBubbles = [];
    for (let y = 0; y < rows; y++) {
        let row = [];

        for (let x = 0; x < columns; x++) {
            row.push(false);
        }
        checkedBubbles.push(row);
    }
};

const drawBubble = function(centerX, centerY, radius, color) {
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
}

const drawBubbles = function() {
    for (let i = 0; i < bubbles.length; i++) {
        for (let j = 0; j < bubbles[i].length; j++) {
            drawBubble(bubbleRadius + i * bubbleSize, bubbleRadius + j * bubbleSize, bubbleRadius, bubbles[i][j]);
        }
    }
}

const drawSelectedBubble = function(centerX, centerY, radius) {
    if (selectedIndexX !== -1 && selectedIndexY !== -1) {
        let color = bubbles[selectedIndexX][selectedIndexY];
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fill();
    }
}

const drawScore = function() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(`Your score is ${score}`, gameView.width / 2, 370);
}

const isEqualColors = function(color1, color2) {
    if (color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2]) {
        return true;
    } else {
        return false;
    }
}

const searchSibling = function(x, y, color, siblings) {

    if (x >= 0 && x < columns && y >= 0 && y < rows && checkedBubbles[x][y] === false && isEqualColors(bubbles[x][y], color)) {

        siblings.push([x, y]);
        checkedBubbles[x][y] = true;

        searchSibling(x + 1, y, color, siblings);
        searchSibling(x, y + 1, color, siblings);
        searchSibling(x - 1, y, color, siblings);
        searchSibling(x, y - 1, color, siblings);
    }
}

const drawAll = function() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.shadowColor = 'transparent';
    drawBubbles();
    drawSelectedBubble(bubbleRadius + selectedIndexX * bubbleSize, bubbleRadius + selectedIndexY * bubbleSize, bubbleRadius);
    drawScore();
}

const clearBubbles = function(siblings) {
    if (siblings.length > 1) {
        score += siblings.length;
        siblings.forEach(e => {

            bubbles[e[0]][e[1]] = whiteColor;
        })
    }
}

const moveDown = function() {

    for (let x = 0; x < columns; x++) {
        for (let y = rows - 1; y > 0; y--) {
            if (isEqualColors(bubbles[x][y], whiteColor)) {
                for (let i = y - 1; i >= 0; i--) {

                    if (!isEqualColors(bubbles[x][i], whiteColor)) {

                        bubbles[x][y] = bubbles[x][i];
                        bubbles[x][i] = whiteColor;
                        break;
                    }
                }
            }
        }
    }
}

const replaceEmptyBubbles = function() {
    const updatedBubbles = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let newColor = generateColor();
            if (isEqualColors(bubbles[x][y], whiteColor)) {
                bubbles[x][y] = newColor;
                updatedBubbles.push([x, y]);
            }
        }
    }

    console.log('Updated bubbles:');
    printBubblesToConsole(updatedBubbles);
}

const printBubblesToConsole = function(changedBubbles) {
    for (let y = 0; y < rows; y++) {
        let line = '';
        for (let x = 0; x < columns; x++) {
            let isFound = false;
            for (let k = 0; k < changedBubbles.length; k++) {
                if (x == changedBubbles[k][0] && y == changedBubbles[k][1]) {
                    isFound = true;
                }
            }

            if (isFound) {
                line += 'X';
            } else {
                line += 'O';
            }

        }
        console.log(line);
    }
}

gameView.addEventListener('mousedown', function(e) {
    const rect = gameView.getBoundingClientRect()
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (selectedIndexX === -1 && selectedIndexY === -1) {
        selectedIndexX = Math.floor(mouseX / bubbleSize);
        selectedIndexY = Math.floor(mouseY / bubbleSize);

    } else {
        let selectedIndexX2 = Math.floor(mouseX / bubbleSize);
        let selectedIndexY2 = Math.floor(mouseY / bubbleSize);
        if ((selectedIndexX2 == selectedIndexX && Math.abs(selectedIndexY - selectedIndexY2) == 1) || (selectedIndexY2 == selectedIndexY && Math.abs(selectedIndexX - selectedIndexX2) == 1)) {
            let color = bubbles[selectedIndexX][selectedIndexY];
            let color2 = bubbles[selectedIndexX2][selectedIndexY2];
            bubbles[selectedIndexX][selectedIndexY] = color2;
            bubbles[selectedIndexX2][selectedIndexY2] = color;

            initCheckedBubbles();
            siblings1 = [];
            searchSibling(selectedIndexX, selectedIndexY, bubbles[selectedIndexX][selectedIndexY], siblings1);
            clearBubbles(siblings1);

            initCheckedBubbles();
            siblings2 = [];
            searchSibling(selectedIndexX2, selectedIndexY2, bubbles[selectedIndexX2][selectedIndexY2], siblings2);
            clearBubbles(siblings2);

            siblings1.push(...siblings2);
            console.log('Bubbles to remove:');
            printBubblesToConsole(siblings1);

            moveDown();
            replaceEmptyBubbles();

        }
        selectedIndexX = -1;
        selectedIndexY = -1;
    }
    drawAll();
})

generateBubbles();
drawAll();