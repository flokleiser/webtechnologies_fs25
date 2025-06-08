"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer1 = document.querySelector("[data-js='colorname1']");
const titleContainer2 = document.querySelector("[data-js='colorname2']");
const titleContainer3 = document.querySelector("[data-js='colorname3']");
const title1 = document.querySelector("[data-js='title1']");
const title2 = document.querySelector("[data-js='title2']");
const title3 = document.querySelector("[data-js='title3']");
const imgContainer = document.querySelector("[data-js='photo']");
const colorSection1 = document.querySelector("[data-js='colorname1']");
const colorSection2 = document.querySelector("[data-js='colorname2']");
const colorSection3 = document.querySelector("[data-js='colorname3']");
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
const button1 = document.querySelector(".button1");
const buttonToggleMode = document.querySelector(".buttonToggleMode");
const buttonReload = document.querySelector(".buttonReload");
const buttonToggleScheme = document.querySelector(".buttonToggleScheme");
const buttonContainer1 = document.querySelector(".buttonContainer1");
const buttonContainer2 = document.querySelector(".buttonContainer2");
const buttonContainer3 = document.querySelector(".buttonContainer3");
const copyButton1 = document.querySelector(".copyButton1");
const copyButton2 = document.querySelector(".copyButton2");
const copyButton3 = document.querySelector(".copyButton3");
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const threshold = 4;
const colorModes = ["hex", "rgb", "hsl"];
let currentModeIndex = 0;
let currentMode = colorModes[currentModeIndex];
const schemeModes = [
    "monochrome",
    "complement",
];
let currentSchemeIndex = 0;
let currentSchemeMode = schemeModes[currentSchemeIndex];
let color;
let testColor;
let titleColor;
let copyColor1;
let copyColor2;
let copyColor3;
let hoverColor;
let normalColor;
async function getRandomColor() {
    try {
        const response = await fetch("https://x-colors.yurace.pro/api/random");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        testColor = data.hex.split("#")[1];
    }
    catch (error) {
        console.error("Error: ", error);
    }
}
async function loadAPI(testColor) {
    try {
        const response = await fetch(`https://www.thecolorapi.com/scheme?&mode=${currentSchemeMode}&hex=${testColor}&count=3`);
        const data = await response.json();
        const colors = data.colors.map((color) => color[currentMode].value);
        const [color1, color2, color3] = colors;
        // const color4 = data.colors[3][currentMode].value;
        titleColor = data.colors[1].name.value;
        bigTitleContainer.innerHTML = titleColor;
        document.body.style.background = `linear-gradient(1turn,${color1}, ${color2}, ${color3})`;
        // document.body.style.background = color2
        document.body.classList.remove("hidden");
        buttonToggleMode.innerHTML = `${currentMode.toUpperCase()}`;
        buttonToggleScheme.innerHTML = `${currentSchemeMode.toUpperCase()}`;
        setColors(color1, color2, color3);
        titleContainer1.addEventListener("mouseover", () => {
            title1.innerHTML = color1;
            title1.classList.add("visible");
            copyButton1.classList.add("copyButton-visible");
        });
        titleContainer1.addEventListener("mouseout", () => {
            title1.innerHTML = "";
            title1.classList.remove("visible");
            copyButton1.classList.remove("copyButton-visible");
        });
        titleContainer2.addEventListener("mouseover", () => {
            title2.innerHTML = color2;
            title2.classList.add("visible");
            copyButton2.classList.add("copyButton-visible");
        });
        titleContainer2.addEventListener("mouseout", () => {
            title2.innerHTML = "";
            title2.classList.remove("visible");
            copyButton2.classList.remove("copyButton-visible");
        });
        titleContainer3.addEventListener("mouseover", () => {
            title3.innerHTML = color3;
            title3.classList.add("visible");
            copyButton3.classList.add("copyButton-visible");
        });
        titleContainer3.addEventListener("mouseout", () => {
            title3.innerHTML = "";
            title3.classList.remove("visible");
            copyButton3.classList.remove("copyButton-visible");
        });
        cardFooter.style.backgroundColor = color3;
        cardHeader.style.backgroundColor = color3;
        setTextColor(data.colors[1].contrast.value);
        setBackgroundButtons(color3);
        hoverColor = color2;
        normalColor = color3;
        //this might be needed in case one color is much darker
        // titleContainer1.style.color = data.colors[0].contrast.value;  
        // titleContainer2.style.color = data.colors[1].contrast.value;
        // titleContainer3.style.color = data.colors[2].contrast.value;
    }
    catch (error) {
        console.error("Error:", error);
    }
}
function setTextColor(hex) {
    bigTitleContainer.style.color = hex;
    button1.style.color = hex;
    buttonToggleMode.style.color = hex;
    buttonReload.style.color = hex;
    buttonToggleScheme.style.color = hex;
    titleContainer1.style.color = hex;
    titleContainer2.style.color = hex;
    titleContainer3.style.color = hex;
    copyButton1.style.color = hex;
    copyButton2.style.color = hex;
    copyButton3.style.color = hex;
}
function setBackgroundButtons(backgroundColor) {
    buttonContainer1.style.backgroundColor = backgroundColor;
    buttonContainer2.style.backgroundColor = backgroundColor;
    buttonContainer3.style.backgroundColor = backgroundColor;
}
function setColors(color1, color2, color3) {
    copyColor1 = color1;
    copyColor2 = color2;
    copyColor3 = color3;
    card.style.backgroundColor = color2;
    colorSection1.style.backgroundColor = color1;
    colorSection2.style.backgroundColor = color2;
    colorSection3.style.backgroundColor = color3;
    copyButton1.style.backgroundColor = color1;
    copyButton2.style.backgroundColor = color2;
    copyButton3.style.backgroundColor = color3;
    button1.style.backgroundColor = color2;
}
function copyToClipboard(color) {
    navigator.clipboard.writeText(color).then(() => {
        console.log(`Copied ${color} to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
function handleHover(e) {
    const { clientX, clientY, currentTarget } = e;
    const target = currentTarget;
    const { clientWidth, clientHeight } = target;
    const offsetLeft = target.getBoundingClientRect().left;
    const offsetTop = target.getBoundingClientRect().top;
    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;
    const rotateX = (horizontal * threshold - threshold / 2).toFixed(2);
    const rotateY = (threshold / 2 - vertical * threshold).toFixed(2);
    cardContainer.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.015, 1.015, 1.015)`;
}
function resetStyles() {
    cardContainer.style.transform = `perspective(450px) rotateX(0deg) rotateY(0deg)`;
}
function loadEventListeners() {
    cardContainer.addEventListener("mouseenter", () => {
        cardBounds = cardContainer.getBoundingClientRect();
        cardContainer.addEventListener("mousemove", handleHover);
    });
    cardContainer.addEventListener("mouseleave", () => {
        cardContainer.removeEventListener("mousemove", handleHover);
        resetStyles();
    });
    buttonReload.addEventListener("click", () => {
        getRandomColor().then(() => {
            loadAPI(testColor);
        });
    });
    buttonToggleMode.addEventListener("click", () => {
        currentModeIndex = (currentModeIndex + 1) % colorModes.length;
        currentMode = colorModes[currentModeIndex];
        loadAPI(testColor);
    });
    buttonToggleScheme.addEventListener("click", () => {
        currentSchemeIndex = (currentSchemeIndex + 1) % schemeModes.length;
        currentSchemeMode = schemeModes[currentSchemeIndex];
        console.log(`Scheme mode switched to: ${currentSchemeMode}`);
        loadAPI(testColor);
    });
    buttonContainer3.addEventListener("mouseenter", () => {
        buttonReload.classList.add(":hovered");
        buttonContainer3.style.backgroundColor = hoverColor;
    });
    buttonContainer3.addEventListener("mouseleave", () => {
        buttonReload.classList.remove(":hovered");
        buttonContainer3.style.backgroundColor = normalColor;
    });
    buttonContainer1.addEventListener("mouseenter", () => {
        buttonToggleMode.classList.add(":hovered");
        buttonContainer1.style.backgroundColor = hoverColor;
    });
    buttonContainer1.addEventListener("mouseleave", () => {
        buttonToggleMode.classList.remove(":hovered");
        buttonContainer1.style.backgroundColor = normalColor;
    });
    buttonContainer2.addEventListener("mouseenter", () => {
        buttonToggleScheme.classList.add(":hovered");
        buttonContainer2.style.backgroundColor = hoverColor;
    });
    buttonContainer2.addEventListener("mouseleave", () => {
        buttonToggleScheme.classList.remove(":hovered");
        buttonContainer2.style.backgroundColor = normalColor;
    });
    // copyButton1.addEventListener("click", () => {
    //     copyToClipboard(copyColor1);
    // });
    // copyButton2.addEventListener("click", () => {
    //     copyToClipboard(copyColor2);
    // });
    // copyButton3.addEventListener("click", () => {
    //     copyToClipboard(copyColor3);
    // }); 
    document.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("copyButton1")) {
            copyToClipboard(copyColor1);
        }
        else if (target.classList.contains("copyButton2")) {
            copyToClipboard(copyColor2);
        }
        else if (target.classList.contains("copyButton3")) {
            copyToClipboard(copyColor3);
        }
    });
    copyButton1.addEventListener("mouseenter", () => {
        copyButton1.classList.add(":hover");
        copyButton1.style.backgroundColor = hoverColor;
    });
    copyButton1.addEventListener("mouseleave", () => {
        copyButton1.classList.remove(":hover");
        copyButton1.style.backgroundColor = copyColor1;
    });
    copyButton2.addEventListener("mouseenter", () => {
        copyButton2.classList.add(":hover");
        copyButton2.style.backgroundColor = copyColor3;
    });
    copyButton2.addEventListener("mouseleave", () => {
        copyButton2.classList.remove(":hover");
        copyButton2.style.backgroundColor = copyColor2;
    });
    copyButton3.addEventListener("mouseenter", () => {
        copyButton3.classList.add(":hover");
        copyButton3.style.backgroundColor = hoverColor;
    });
    copyButton3.addEventListener("mouseleave", () => {
        copyButton3.classList.remove(":hover");
        copyButton3.style.backgroundColor = copyColor3;
    });
}
document.addEventListener("DOMContentLoaded", async () => {
    document.body.classList.add("hidden");
    await getRandomColor();
    await loadAPI(testColor);
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => loadingScreen.remove(), 500);
    }
    loadEventListeners();
});
