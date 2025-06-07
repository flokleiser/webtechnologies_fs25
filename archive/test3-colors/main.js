"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const questionContainer = document.querySelector("[data-js='question']");
const answerContainer = document.querySelector("[data-js='answer']");
const THRESHOLD = 5;
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
let color;
let testColor;
// function getRandomColor() {
//         fetch("https://x-colors.yurace.pro/api/random")
//         .then(response => response.json())
//         .then(data => {
//           testColor = data.hex; 
//           console.log("Fetched color:", testColor);
//           loadAPI();
//         })
//         .catch(error => console.error("Error fetching color:", error));
// }
async function getRandomColor() {
    try {
        const response = await fetch("https://x-colors.yurace.pro/api/random");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        testColor = data.hex.split("#")[1];
        console.log("Fetched color:", testColor);
    }
    catch (error) {
        console.error("Error: ", error);
    }
}
// function loadAPI() {
//     if (
//         !titleContainer ||
//         !imgContainer ||
//         !questionContainer ||
//         !card ||
//         !bigTitleContainer ||
//         !answerContainer
//     ) {
//         throw new Error("some dom element is missing");
//     }
//     fetch(`https://www.thecolorapi.com/scheme?hex=${testColor}&count=3`)
//     // fetch("https://api.apiverve.com/v1/colorpalette?variation=soft&color=FF5733")
//         .then((response) => response.json())
//         .then((data) => {
//         const testData = data
//         console.log(testData);
//         const color1 = testData.colors[0].hex.value;
//         const color2 = testData.colors[1].hex.value;
//         const color3 = testData.colors[2].hex.value;
//         bigTitleContainer.innerHTML = testData.mode
//         document.body.style.backgroundColor = color1;
//         card.style.backgroundColor = color2;
//         cardFooter.style.backgroundColor = color3;
//         cardHeader.style.backgroundColor = color3;
//         const img = document.createElement("img");
//         img.src = testData.image.bare;
//         imgContainer.appendChild(img);
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });
// }
// card rotation stuff
async function loadAPI() {
    if (!titleContainer ||
        !imgContainer ||
        !questionContainer ||
        !card ||
        !bigTitleContainer ||
        !answerContainer) {
        throw new Error("Some DOM element is missing");
    }
    try {
        const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${testColor}&count=3`);
        const data = await response.json();
        console.log(response);
        const color1 = data.colors[0].hex.value;
        const color2 = data.colors[1].hex.value;
        const color3 = data.colors[2].hex.value;
        bigTitleContainer.innerHTML = data.mode;
        document.body.style.backgroundColor = color1;
        card.style.backgroundColor = color2;
        cardFooter.style.backgroundColor = color3;
        cardHeader.style.backgroundColor = color3;
        const img = document.createElement("img");
        img.src = data.image.bare;
        imgContainer.appendChild(img);
    }
    catch (error) {
        console.error("Error:", error);
    }
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
    const rotateX = (horizontal * THRESHOLD - THRESHOLD / 2).toFixed(2);
    const rotateY = (THRESHOLD / 2 - vertical * THRESHOLD).toFixed(2);
    cardContainer.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
}
function resetStyles() {
    cardContainer.style.transform = `perspective(450px) rotateX(0deg) rotateY(0deg)`;
}
// document.addEventListener("DOMContentLoaded", () => {
//     getRandomColor()
//     loadAPI();
// });
document.addEventListener("DOMContentLoaded", async () => {
    await getRandomColor();
    await loadAPI();
});
