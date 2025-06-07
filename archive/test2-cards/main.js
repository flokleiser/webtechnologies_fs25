"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const questionContainer = document.querySelector("[data-js='question']");
const answerContainer = document.querySelector("[data-js='answer']");
const card = document.querySelector(".card");
let cardBounds = card.getBoundingClientRect();
//api stuff
function loadAPI() {
    if (!titleContainer || !imgContainer || !questionContainer || !card || !bigTitleContainer || !answerContainer) {
        throw new Error("some dom element is missing");
    }
    fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=1")
        .then((response) => response.json())
        .then((data) => {
        const apiCard = data.cards[0];
        bigTitleContainer.innerHTML = apiCard.value + " of " + apiCard.suit;
        // titleContainer.innerHTML = 
        // questionContainer.innerHTML =
        // answerContainer.innerHTML 
        const img = document.createElement("img");
        img.src = apiCard.image;
        // img.alt = drink.strDrink;
        imgContainer.appendChild(img);
    })
        .catch((error) => {
        console.error("Error:", error);
    });
}
// card rotation stuff
function rotateCard(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - cardBounds.x;
    const topY = mouseY - cardBounds.y;
    const center = {
        x: leftX - cardBounds.width / 2,
        y: topY - cardBounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
    card.style.transform = `
            scale3d(1.02, 1.02, 1.02)
            rotate3d(
            ${center.y / 100},
            ${-center.x / 100},
            0,
            ${Math.log(distance) * 1.5}deg
            )
        `;
}
card.addEventListener("mouseenter", () => {
    cardBounds = card.getBoundingClientRect();
    document.addEventListener("mousemove", rotateCard);
});
card.addEventListener("mouseleave", () => {
    document.removeEventListener("mousemove", rotateCard);
    card.style.transform = "scale3d(1, 1, 1) rotate3d(0, 0, 0, 0deg)";
});
document.addEventListener("DOMContentLoaded", () => {
    loadAPI();
});
