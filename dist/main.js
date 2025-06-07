"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
const button1 = document.querySelector(".button1");
const button2 = document.querySelector(".button2");
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const threshold = 5;
let color;
let testColor;
let titleColor;
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
async function loadAPI() {
    if (!titleContainer ||
        !imgContainer ||
        !card ||
        !bigTitleContainer) {
        throw new Error("Some DOM element is missing");
    }
    try {
        const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${testColor}&count=3`);
        const data = await response.json();
        console.log(response);
        const color1 = data.colors[0].hex.value;
        const color2 = data.colors[1].hex.value;
        const color3 = data.colors[2].hex.value;
        titleColor = data.colors[0].name.value;
        bigTitleContainer.innerHTML = titleColor;
        // document.body.style.backgroundColor = color1;
        document.body.style.background = `linear-gradient(1turn,${color1}, ${color2}, ${color3})`;
        button1.style.backgroundColor = color3;
        button2.style.backgroundColor = color3;
        card.style.backgroundColor = color2;
        cardFooter.style.backgroundColor = color3;
        cardHeader.style.backgroundColor = color3;
        const rgbColor3 = hexToRgb(color3);
        const luminance = rgbToLuminance(rgbColor3);
        if (luminance < 0.5) {
            bigTitleContainer.style.color = "#FFFFFF";
            button1.style.color = "#FFFFFF";
            button2.style.color = "#FFFFFF";
        }
        else {
            bigTitleContainer.style.color = "#000000";
            button1.style.color = "#000000";
            button2.style.color = "#000000";
        }
        const img = document.createElement("img");
        img.src = data.image.bare;
        imgContainer.appendChild(img);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
//todo: openai api for a cool gradient name(?)
// async function generateGradientName(testColor: string): Promise<string> {
//     const prompt = `Generate a fitting and creative name for a gradient based on the color ${testColor}.`;
//     try {
//         const response = await fetch("https://api.openai.com/v1/completions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer your_openai_api_key`, 
//             },
//             body: JSON.stringify({
//                 model: "text-davinci-003",
//                 prompt: prompt,
//                 max_tokens: 50,
//                 temperature: 0.7,
//             }),
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         const gradientName = data.choices[0].text.trim();
//         console.log("Generated Gradient Name:", gradientName);
//         return gradientName;
//     } catch (error) {
//         console.error("Error generating gradient name:", error);
//         // return "Unnamed Gradient"; 
//         return testColor;
//     }
// }
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
function rgbToLuminance({ r, g, b }) {
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;
    return 0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;
}
cardContainer.addEventListener("mouseenter", () => {
    cardBounds = cardContainer.getBoundingClientRect();
    cardContainer.addEventListener("mousemove", handleHover);
});
cardContainer.addEventListener("mouseleave", () => {
    cardContainer.removeEventListener("mousemove", handleHover);
    resetStyles();
});
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
    cardContainer.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
}
function resetStyles() {
    cardContainer.style.transform = `perspective(450px) rotateX(0deg) rotateY(0deg)`;
}
document.addEventListener("DOMContentLoaded", async () => {
    await getRandomColor();
    await loadAPI();
});
