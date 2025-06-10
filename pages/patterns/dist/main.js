"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
const buttonReload = document.querySelector(".buttonReload");
const canvasCard = document.querySelector(".cardCanvas");
const ctxCard = canvasCard.getContext("2d");
const button1 = document.querySelector(".button1");
const button2 = document.querySelector(".button2");
const buttonHilbert = document.querySelector(".buttonHilbert");
const buttonTruchet = document.querySelector(".buttonTruchet");
const buttonGrid = document.querySelector(".buttonGrid");
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const threshold = 3;
let randomOrder;
let previousRandomOrder;
let activeMode = "Truchet";
let tiles = [];
let rows = 10;
let cols;
let animationID = null;
let animationIsActive = true;
async function loadCard(activeMode) {
    initCanvas(activeMode);
    bigTitleContainer.textContent = activeMode;
}
function initCanvas(activeMode) {
    if (!canvasCard || !ctxCard) {
        console.error("Canvas or context is not available.");
        return;
    }
    buttonGrid.innerHTML = `Wavy </br> Grid </br> ${animationIsActive ? "Animated" : "Static"}`;
    canvasCard.width = cardContainerBounds.width;
    canvasCard.height = cardContainerBounds.height;
    ctxCard.clearRect(0, 0, canvasCard.width, canvasCard.height);
    drawOnCanvas(activeMode);
}
function drawOnCanvas(activeMode) {
    if (!canvasCard || !ctxCard) {
        console.error("Canvas or context is not available.");
        return;
    }
    let attempts = 0;
    const maxAttempts = 10;
    do {
        randomOrder = Math.floor(Math.random() * 4) + 3;
        attempts++;
    } while (randomOrder === previousRandomOrder && attempts < maxAttempts);
    if (randomOrder === previousRandomOrder) {
        randomOrder = previousRandomOrder === 6 ? 2 : previousRandomOrder + 1;
    }
    previousRandomOrder = randomOrder;
    ctxCard.fillStyle = "rgb(31,31,31)";
    ctxCard.strokeStyle = "rgb(255, 255, 255)";
    ctxCard.fillRect(0, 0, canvasCard.width, canvasCard.height);
    if (activeMode === "Hilbert") {
        drawHilbertCurve(randomOrder, canvasCard, ctxCard);
    }
    else if (activeMode === "Truchet") {
        drawTruchetTiling(canvasCard, ctxCard);
    }
    else if (activeMode === "Grid") {
        drawGrid(canvasCard, ctxCard);
    }
}
function drawHilbertCurve(order, canvas, ctx) {
    if (!canvas || !ctx) {
        console.error("Canvas or context is not available.");
        return;
    }
    const size = Math.min(canvas.width, canvas.height);
    const step = size / Math.pow(2, order);
    let x = (canvas.width - size) / 2 + step / 2;
    let y = (canvas.height - size) / 2 + step / 2;
    // ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    function hilbert(level, dx, dy) {
        if (level <= 0)
            return;
        hilbert(level - 1, dy, dx);
        x += dx * step;
        y += dy * step;
        ctx.lineTo(x, y);
        hilbert(level - 1, dx, dy);
        x += dy * step;
        y += dx * step;
        ctx.lineTo(x, y);
        hilbert(level - 1, dx, dy);
        x -= dx * step;
        y -= dy * step;
        ctx.lineTo(x, y);
        hilbert(level - 1, -dy, -dx);
    }
    hilbert(order, 0, 1);
    ctx.stroke();
}
function drawTruchetTiling(canvas, ctx) {
    if (!canvas || !ctx) {
        console.error("Canvas or context is not available.");
        return;
    }
    let tiles = [];
    let rows = 10;
    let cols;
    cols = Math.floor(rows / canvas.width * canvas.height);
    for (let i = 0; i < rows; i++) {
        tiles.push(new Array(cols).fill(false));
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            tiles[i][j] = Math.round(Math.random()) === 1;
        }
    }
    const s = canvas.width / rows + 2;
    // const s = canvas.width / rows;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = (canvas.width * i) / rows;
            const y = (canvas.height * j) / cols;
            ctx.lineWidth = 2;
            if (tiles[i][j]) {
                ctx.beginPath();
                ctx.arc(x, y, s / 2, 0, Math.PI / 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x + s, y + s, s / 2, Math.PI, (3 * Math.PI) / 2);
                ctx.stroke();
            }
            else {
                ctx.beginPath();
                ctx.arc(x + s, y, s / 2, Math.PI / 2, Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x, y + s, s / 2, (3 * Math.PI) / 2, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
}
function drawGrid(canvas, ctx) {
    if (!canvas || !ctx) {
        console.error("Canvas or context is not available.");
        return;
    }
    if (animationID) {
        cancelAnimationFrame(animationID);
    }
    function animate() {
        const gridSize = 20;
        const amplitude = 10;
        const frequency = 0.015;
        const timeOffset = Date.now() * 0.0005;
        ctx.fillStyle = "rgb(31, 31, 31)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 2;
        for (let y = 0; y <= canvas.height + gridSize; y += gridSize) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 2) {
                const waveY = y + Math.sin((x + y) * frequency + timeOffset) * amplitude;
                const waveY2 = waveY + Math.cos((x - y) * frequency * 0.7 + timeOffset * 0.8) * amplitude * 0.6;
                if (x === 0) {
                    ctx.moveTo(x, waveY2);
                }
                else {
                    ctx.lineTo(x, waveY2);
                }
            }
            ctx.stroke();
        }
        for (let x = 0; x <= canvas.width + gridSize; x += gridSize) {
            ctx.beginPath();
            for (let y = 0; y <= canvas.height; y += 2) {
                const waveX = x + Math.sin((x + y) * frequency + timeOffset) * amplitude;
                const waveX2 = waveX + Math.cos((x - y) * frequency * 0.7 + timeOffset * 0.8) * amplitude * 0.6;
                if (y === 0) {
                    ctx.moveTo(waveX2, y);
                }
                else {
                    ctx.lineTo(waveX2, y);
                }
            }
            ctx.stroke();
        }
        if (animationIsActive) {
            animationID = requestAnimationFrame(animate);
        }
    }
    function drawStaticGrid() {
        const gridSize = 20;
        const amplitude = 10;
        const frequency = 0.015;
        ctx.fillStyle = "rgb(31, 31, 31)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 2;
        for (let y = 0; y <= canvas.height + gridSize; y += gridSize) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 2) {
                const waveY = y + Math.sin((x + y) * frequency) * amplitude;
                const waveY2 = waveY + Math.cos((x - y) * frequency * 0.7) * amplitude * 0.6;
                if (x === 0) {
                    ctx.moveTo(x, waveY2);
                }
                else {
                    ctx.lineTo(x, waveY2);
                }
            }
            ctx.stroke();
        }
        for (let x = 0; x <= canvas.width + gridSize; x += gridSize) {
            ctx.beginPath();
            for (let y = 0; y <= canvas.height; y += 2) {
                const waveX = x + Math.sin((x + y) * frequency) * amplitude;
                const waveX2 = waveX + Math.cos((x - y) * frequency * 0.7) * amplitude * 0.6;
                if (y === 0) {
                    ctx.moveTo(waveX2, y);
                }
                else {
                    ctx.lineTo(waveX2, y);
                }
            }
            ctx.stroke();
        }
    }
    if (animationIsActive) {
        animate();
    }
    else {
        drawStaticGrid();
    }
}
function stopAnimation() {
    if (animationID) {
        cancelAnimationFrame(animationID);
        animationID = null;
    }
}
function loadEventListeners() {
    cardContainer.addEventListener("mouseenter", () => {
        cardBounds = cardContainer.getBoundingClientRect();
        cardContainer.addEventListener("mousemove", handleCardHover);
    });
    cardContainer.addEventListener("mouseleave", () => {
        cardContainer.removeEventListener("mousemove", handleCardHover);
        resetCardStyle();
    });
    buttonReload.addEventListener("click", () => {
        if (activeMode === "Hilbert") {
            loadCard("Hilbert");
        }
        else if (activeMode === "Truchet") {
            loadCard("Truchet");
        }
        else if (activeMode === "Grid") {
            loadCard("Grid");
        }
    });
    buttonHilbert.addEventListener("click", () => {
        activeMode = "Hilbert";
        loadCard("Hilbert");
        stopAnimation();
    });
    buttonTruchet.addEventListener("click", () => {
        activeMode = "Truchet";
        loadCard("Truchet");
        stopAnimation();
    });
    buttonGrid.addEventListener("click", () => {
        animationIsActive = !animationIsActive;
        buttonGrid.innerHTML = `Wavy </br> Grid </br> ${animationIsActive ? "Animated" : "Static"}`;
        activeMode = "Grid";
        // loadCard("Grid");
        if (animationIsActive) {
            // drawOnCanvas("Grid");
            loadCard("Grid");
        }
        else {
            stopAnimation();
            // drawOnCanvas("Grid");
        }
    });
}
function handleCardHover(e) {
    const { clientX, clientY, currentTarget } = e;
    const target = currentTarget;
    const { clientWidth, clientHeight } = target;
    const offsetLeft = target.getBoundingClientRect().left;
    const offsetTop = target.getBoundingClientRect().top;
    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;
    const rotateX = (horizontal * threshold - threshold / 2).toFixed(2);
    const rotateY = (threshold / 2 - vertical * threshold).toFixed(2);
    cardContainer.style.transform = `translate(-50%, -50%) perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.015, 1.015, 1.015)`;
}
function resetCardStyle() {
    cardContainer.style.transform = `translate(-50%, -50%) perspective(450px) rotateX(0deg) rotateY(0deg)`;
}
document.addEventListener("DOMContentLoaded", async () => {
    loadCard(activeMode);
    loadEventListeners();
});
