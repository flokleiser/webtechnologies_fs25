"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const questionContainer = document.querySelector("[data-js='question']");
const answerContainer = document.querySelector("[data-js='answer']");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
const flipButton = document.querySelector("#flip");
const card = document.querySelector(".card");
let cardBounds = card.getBoundingClientRect();
let difficulty = "hard";
let isFlipped = false;
if (!easyButton || !mediumButton || !hardButton || !flipButton) {
    throw new Error("Required button elements not found");
}
function setDifficulty(newDifficulty) {
    difficulty = newDifficulty;
}
//api stuff
function loadAPI() {
    if (!titleContainer || !imgContainer || !questionContainer || !card || !bigTitleContainer || !answerContainer) {
        throw new Error("Required DOM elements not found");
    }
    fetch("https://opentdb.com/api.php?amount=1&difficulty=" + difficulty + "&multiple")
        .then((response) => response.json())
        .then((data) => {
        bigTitleContainer.innerHTML = "Trivia: " + difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        const success = data.response_code === 0;
        if (!success) {
            titleContainer.innerHTML = "API timed out :(";
        }
        const test = data.results[0];
        titleContainer.innerHTML = "Category: " + test.category;
        questionContainer.innerHTML = test.question;
        answerContainer.innerHTML = test.correct_answer + "<br>" + test.incorrect_answers.join("<br>");
        console.log(test.difficulty);
    })
        .catch((error) => {
        console.error("Error:", error);
    });
}
// button stuff
easyButton.addEventListener("click", () => {
    setDifficulty("easy");
    loadAPI();
});
mediumButton.addEventListener("click", () => {
    setDifficulty("medium");
    loadAPI();
});
hardButton.addEventListener("click", () => {
    setDifficulty("hard");
    loadAPI();
});
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
function rotateCardFlipped(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - cardBounds.x;
    const topY = mouseY - cardBounds.y;
    const center = {
        x: leftX - cardBounds.width / 2,
        y: topY - cardBounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
    // card.style.transform = `
    //     scale3d(1.02, 1.02, 1.02)
    //     rotate3d(
    //     ${center.y / 100},
    //     ${-center.x / 100},
    //     0,
    //     ${Math.log(distance) * 1.5}deg
    //     )
    // `;
    card.style.transform = `
            scale3d(1.02, 1.02, 1.02)
            rotateY(180deg)
        `;
}
flipButton.addEventListener("click", () => {
    isFlipped = !isFlipped;
    console.log("Flipped: " + isFlipped);
    card.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
});
card.addEventListener("mouseenter", () => {
    cardBounds = card.getBoundingClientRect();
    if (!isFlipped) {
        document.addEventListener("mousemove", rotateCard);
    }
    else {
        document.addEventListener("mousemove", rotateCardFlipped);
    }
});
card.addEventListener("mouseleave", () => {
    if (!isFlipped) {
        document.removeEventListener("mousemove", rotateCard);
    }
    else {
        document.removeEventListener("mousemove", rotateCardFlipped);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    loadAPI();
});
