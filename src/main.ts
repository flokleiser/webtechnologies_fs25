const bigTitleContainer = document.querySelector("[data-js='big-title']");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const questionContainer = document.querySelector("[data-js='question']");
const answerContainer = document.querySelector("[data-js='answer']");

const THRESHOLD = 5;

const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;


function loadAPI() {
    if (
        !titleContainer ||
        !imgContainer ||
        !questionContainer ||
        !card ||
        !bigTitleContainer ||
        !answerContainer
    ) {
        throw new Error("some dom element is missing");
    }

    fetch("https://x-colors.yurace.pro/api/random")
        .then((response) => response.json())
        .then((data) => {


            const testData = data
            console.log(testData);

            const color = testData.hex;

            document.body.style.backgroundColor = color;
            
            bigTitleContainer.innerHTML = testData.hex;

            // titleContainer.innerHTML = testData.date;

            // const img = document.createElement("img");
            // img.src = testData.hdurl;
            // imgContainer.appendChild(img);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

}

// card rotation stuff

cardContainer.addEventListener("mouseenter", () => {
    cardBounds = cardContainer.getBoundingClientRect();
    cardContainer.addEventListener("mousemove", handleHover);
});

cardContainer.addEventListener("mouseleave", () => {
    cardContainer.removeEventListener("mousemove", handleHover);
    resetStyles();
});

function handleHover(e: MouseEvent) {
    const { clientX, clientY, currentTarget } = e;
    const target = currentTarget as HTMLElement;
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

document.addEventListener("DOMContentLoaded", () => {
    loadAPI();
});
