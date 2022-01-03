let gameView = document.querySelector('#gameView');
let ctx = gameView.getContext('2d');
let bubbles = [];
let bubbleSize = 85;
let bubbleRadius = 40;
let selectedIndexX = -1;
let selectedIndexY = -1;

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
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fill();
    }
}

const drawAll = function() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.shadowColor = 'transparent';
    drawBubbles();
    drawSelectedBubble(bubbleRadius + selectedIndexX * bubbleSize, bubbleRadius + selectedIndexY * bubbleSize, bubbleRadius);

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
        }
        selectedIndexX = -1;
        selectedIndexY = -1;
    }

    drawAll();
})

// for (let i = 1; i <= 10; i++) {
//     console.log(i);
// }



// const recurPrintNumber = function(k) {
//     if (k <= 10) {
//         console.log(k);
//         recurPrintNumber(k + 1);
//     }
// }

// recurPrintNumber(1);


generateBubbles();
drawBubbles();