const bigTitleContainer = document.querySelector("[data-js='big-title']") as HTMLElement;
const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
const cardHeader = document.querySelector(".cardHeader") as HTMLElement;
const cardFooter = document.querySelector(".cardFooter") as HTMLElement;
const buttonReload = document.querySelector(".buttonReload") as HTMLElement;
const cardImage = document.querySelector(".main-image") as HTMLImageElement;

const button1 = document.querySelector(".button1") as HTMLElement

const ingredientsSection= document.querySelector(".ingredience-section") as HTMLElement;

let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 3;

if (!cardImage) {
    throw new Error("Image container not found");
}

async function loadAPI() {
    try {

    const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    const data = await response.json();
    const drink = data.drinks[0];

    bigTitleContainer.textContent = drink.strDrink;

    // cardImage.src = drink.strDrinkThumb;

    const ingredientsArray: string[] = [];
    let i = 1;

    while (drink[`strIngredient${i}`] !== null) {
        const ingredient = drink[`strIngredient${i}`];
        if (ingredient) {
            ingredientsArray.push(ingredient.trim());
        }
        i++;
    }

    console.log(ingredientsArray);

    } catch (error) {
        console.error("Error:", error);
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
        loadAPI();
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

    cardContainer.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.015, 1.015, 1.015)`;
}

function resetCardStyle() {
    cardContainer.style.transform = `perspective(450px) rotateX(0deg) rotateY(0deg)`;
}


document.addEventListener("DOMContentLoaded", async () => {


    // document.body.classList.add("hidden"); 

    await loadAPI(); 
    loadEventListeners()

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => loadingScreen.remove(), 500);
    }

});
