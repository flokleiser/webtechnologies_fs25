const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const questionContainer = document.querySelector("[data-js='question']");
const answerContainer = document.querySelector("[data-js='answer']");

const easyButton = document.querySelector("#easy") as HTMLButtonElement;
const mediumButton = document.querySelector("#medium") as HTMLButtonElement;
const hardButton = document.querySelector("#hard") as HTMLButtonElement;

const card = document.querySelector(".card") as HTMLElement;
let cardBounds = card.getBoundingClientRect() as DOMRect;

let difficulty = "hard"; 

// if (!titleContainer || !imgContainer || !questionContainer || !card || !bigTitleContainer) {
//     throw new Error("Required DOM elements not found");
// }

if (!easyButton || !mediumButton || !hardButton) {
    throw new Error("Required button elements not found");
}

function setDifficulty(newDifficulty: string) {
    difficulty = newDifficulty;
}

//api stuff

function loadAPI() {

    if (!titleContainer || !imgContainer || !questionContainer || !card || !bigTitleContainer || !answerContainer) {
        throw new Error("Required DOM elements not found");
    }

    // fetch("https://opentdb.com/api.php?amount=1&difficulty=hard&multiple")
    fetch("https://opentdb.com/api.php?amount=1&difficulty="+difficulty+"&multiple")
        .then((response) => response.json())
        .then((data) => {

            bigTitleContainer.innerHTML = "Trivia: " + difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

            const success = data.response_code === 0;
            if (!success) {
                titleContainer.innerHTML = "API timed out :("
            }

            const test = data.results[0];

            titleContainer.innerHTML = "Category: " + test.category;
            questionContainer.innerHTML = test.question;

            answerContainer.innerHTML = test.correct_answer + "<br>" + test.incorrect_answers.join("<br>");

            console.log(test.difficulty)
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

function rotateCard(e:MouseEvent) {
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
    card.style.transform = "";
    card.style.background = "";
});

document.addEventListener("DOMContentLoaded", () => {
    loadAPI();
});