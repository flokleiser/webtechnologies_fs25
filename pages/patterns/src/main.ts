const bigTitleContainer = document.querySelector("[data-js='big-title']") as HTMLElement;
const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
const cardHeader = document.querySelector(".cardHeader") as HTMLElement;
const cardFooter = document.querySelector(".cardFooter") as HTMLElement;
const buttonReload = document.querySelector(".buttonReload") as HTMLElement;
const canvasCard = document.querySelector(".cardCanvas") as HTMLCanvasElement;
const ctxCard = canvasCard.getContext("2d");
const button1 = document.querySelector(".button1") as HTMLElement;
const button2 = document.querySelector(".button2") as HTMLElement;

const buttonHilbert = document.querySelector(".buttonHilbert") as HTMLElement;
const buttonTruchet = document.querySelector(".buttonTruchet") as HTMLElement;
const buttonGrid = document.querySelector(".buttonGrid") as HTMLElement;
const buttonTest = document.querySelector(".buttonTest") as HTMLElement;

let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 3;
let randomOrder: number;
let previousRandomOrder: number;

// const palette = ["#f8f9fa","#e9ecef","#dee2e6","#ced4da","#adb5bd","#6c757d","#495057","#343a40","#212529"]
const palette = ["#999999","#777777","#555555","#333333","#111111"]

let activeMode: "Hilbert" | "Truchet" | "Grid" | "Pattern" = "Truchet";

let tiles: string[][] = [];
let rows: number = 10;
let cols: number;

let animationID: number | null = null;

let animationIsActive = true; 

async function loadCard(activeMode: string) {
    initCanvas(activeMode);
    bigTitleContainer.textContent = activeMode;
}

function initCanvas(activeMode: string) {
    if (!canvasCard || !ctxCard) {
        console.error("Canvas or context is not available.");
        return;
    }

    buttonGrid.innerHTML= `Wavy </br> Grid </br> ${animationIsActive ? "Animated" : "Static"}`;
    canvasCard.width = cardContainerBounds.width;
    canvasCard.height = cardContainerBounds.height;

    ctxCard.clearRect(0, 0, canvasCard.width, canvasCard.height);

    drawOnCanvas(activeMode);
}

function drawOnCanvas(activeMode: string) {
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
    } else if (activeMode === "Truchet") {
        drawTruchetTiling(canvasCard, ctxCard);
    } else if (activeMode === "Grid") {
        drawGrid(canvasCard, ctxCard)
    } else if (activeMode === "Pattern") {
        drawTestPattern(canvasCard, ctxCard);
    }
}

function drawHilbertCurve(order: number,canvas: HTMLCanvasElement,ctx: CanvasRenderingContext2D) {
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

    function hilbert(level: number, dx: number, dy: number) {
        if (level <= 0) return;

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

function drawTruchetTiling(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!canvas || !ctx) {
        console.error("Canvas or context is not available.");
        return;
    }

    let tiles: boolean[][] = [];
    let rows = 10;
    let cols: number;
    
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

                //p5js equivalent, for future reference
                //arc(x, y, s, s, 0, PI / 2);
                ctx.beginPath();
                ctx.arc(x, y, s/2, 0, Math.PI / 2);
                ctx.stroke();

                //arc(x + s, y + s, s, s, PI, (3 * PI) / 2);                
                ctx.beginPath();
                ctx.arc(x + s, y + s, s/2, Math.PI, (3 * Math.PI) / 2);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(x + s, y, s/2, Math.PI / 2, Math.PI);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(x, y + s, s/2, (3 * Math.PI) / 2, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
}

function drawGrid(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!canvas || !ctx) {
        console.error("Canvas or context is not available.");
        return;
    }

    if (animationID) {
        cancelAnimationFrame(animationID);
    }

    function animate() {
        const gridSize = 20;
        const amplitude = 10
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
                } else {
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
                } else {
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
        const amplitude = 10
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
                } else {
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
                } else {
                    ctx.lineTo(waveX2, y);
                }
            }
            ctx.stroke();
        }
    }

    if (animationIsActive) {
        animate();
    } else {
        drawStaticGrid();
    }
}

function stopAnimation() {
    if (animationID) {
        cancelAnimationFrame(animationID);
        animationID = null;
    }
}

function drawTestPattern(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    let s = canvas.width / 5;
	
	for (let x = 0; x < canvas.width; x += s) {
    for (let y = 0; y < canvas.height; y += s) {
			if (Math.random() < 1/2) {
				makeTile(x, y, s/2, canvas, ctx);
				makeTile(x+s/2, y, s/2, canvas, ctx);
				makeTile(x, y+s/2, s/2, canvas, ctx);
				makeTile(x+s/2, y+s/2, s/2, canvas, ctx);
			} else {
      	makeTile(x, y, s, canvas, ctx);
			}
		}
  }
}

function makeTile(x:number, y:number, s:number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

    ctx.fillStyle = palette[Math.floor(Math.random() * 9) + 1];
    ctx.fill();
    ctx.rect(x, y, s, s);
    ctx.save();

    ctx.translate(x+s/2, y+s/2);

    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    ctx.rotate(angles[Math.floor(Math.random() * angles.length)]);

    ctx.fillStyle = palette[Math.floor(Math.random() * 9) + 1];

	let r = Math.floor(Math.random()* 3);

	if (r == 0) {
        // ctx.beginPath();
        // ctx.arc(-s/2, 0, s/2, 0 , Math.PI);
        // ctx.stroke()
        ctx.beginPath();
        ctx.moveTo(-s / 2, 0); 
        ctx.lineTo(0, -s / 2); 
        ctx.lineTo(s / 2, 0); 
        ctx.closePath();
        ctx.fill(); 
	} else if (r == 1) {
		ctx.rect(-s/2, -s/2, s/2, s);
    }
	else if (r == 2) {
        ctx.beginPath();
        ctx.moveTo(-s/2, -s/2);
        ctx.lineTo(s/2, -s/2);
        ctx.lineTo(-s/2, s/2);
        ctx.closePath();
        ctx.fill();
	}

	ctx.restore();
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
        } else if (activeMode === "Truchet") {
            loadCard("Truchet");
        } else if (activeMode === "Grid") {
            loadCard("Grid");
        } else if (activeMode === "Pattern") {
            loadCard("Pattern");
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
        buttonGrid.innerHTML= `Wavy </br> Grid </br> ${animationIsActive ? "Animated" : "Static"}`;
        activeMode = "Grid";
        // loadCard("Grid");

        if (animationIsActive) {
            // drawOnCanvas("Grid");
            loadCard("Grid");
        } else {
            stopAnimation();
            // drawOnCanvas("Grid");
        }
    });    

    buttonTest.addEventListener("click", () => {
        activeMode = "Pattern";
        loadCard("Pattern");
        stopAnimation();
    });
}

function handleCardHover(e: MouseEvent) {
    const { clientX, clientY, currentTarget } = e;
    const target = currentTarget as HTMLElement;
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
