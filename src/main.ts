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

//api stuff

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

    fetch(
        "https://api.nasa.gov/planetary/apod?api_key=INDu8QnTJwDkq6qjx2ZjLqNb0PzXqCCU0HImbh4i"
    )
        .then((response) => response.json())
        .then((data) => {
            const nasa = data[0];

            bigTitleContainer.innerHTML = data.title;

            titleContainer.innerHTML = data.date;

            const img = document.createElement("img");
            img.src = data.hdurl;
            imgContainer.appendChild(img);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// card rotation stuff

// function rotateCard(e:MouseEvent) {
//     const mouseX = e.clientX;
//     const mouseY = e.clientY;
//     const leftX = mouseX - cardContainerBounds.x;
//     const topY = mouseY - cardContainerBounds.y;
//     const center = {
//         x: leftX - cardContainerBounds.width / 2,
//         y: topY - cardContainerBounds.height / 2,
//     };
//     const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

//         // card.style.transform = `
//         cardContainer.style.transform = `
//             scale3d(1.02, 1.02, 1.02)
//             rotate3d(
//             ${center.y / 100},
//             ${-center.x / 100},
//             0,
//             ${Math.log(distance) * 1.5}deg
//             )
//         `;
// }

cardContainer.addEventListener("mouseenter", () => {
    cardBounds = cardContainer.getBoundingClientRect();
    // document.addEventListener("mousemove", rotateCard);
    cardContainer.addEventListener("mousemove", handleHover);
});

cardContainer.addEventListener("mouseleave", () => {
    // document.removeEventListener("mousemove", rotateCard);
    // cardContainer.style.transform = "";
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
    //   const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
    //   const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);
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
