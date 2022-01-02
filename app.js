let gameView = document.querySelector('#gameView');
let ctx = gameView.getContext('2d');
let bubbles = [];

const drawBubbles = function() {
    for (let i = 0; i < bubbles.length; i++) {
        for (let j = 0; j < bubbles[i].length; j++) {
            drawCircle(41 + i * 85, 41 + j * 85, 40, bubbles[i][j]);
        }
    }
}

const drawCircle = function(centerX, centerY, radius, color) {
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

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
    for (let y = 0; y < 4; y++) {
        let row = [];
        for (let x = 0; x < 4; x++) {
            let bubbleColor = generateColor();
            row.push(bubbleColor);
        }
        bubbles.push(row);
    }

};

generateBubbles();
drawBubbles();



console.log(bubbles);