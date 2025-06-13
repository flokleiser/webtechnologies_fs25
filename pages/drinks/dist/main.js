"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
const buttonReload = document.querySelector(".buttonReload");
const cardImage = document.querySelector(".main-image");
// const cardImageSmall = document.querySelector(".main-imageSmall") as HTMLImageElement;
const button1 = document.querySelector(".button1");
const button2 = document.querySelector(".button2");
const ingredientsSection = document.querySelector(".ingredients-section");
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const threshold = 3;
function getIngredientThumbnail(ingredientName) {
    return `https://www.thecocktaildb.com/images/ingredients/${ingredientName}.png`;
}
async function displayIngredients(ingredients) {
    ingredientsSection.innerHTML = "";
    const containerWidth = 390;
    const gap = 8;
    const totalGapWidth = (ingredients.length - 1) * gap;
    const availableWidth = containerWidth - totalGapWidth;
    let boxWidth = Math.floor(availableWidth / ingredients.length);
    const minWidth = 50;
    const maxWidth = 120;
    boxWidth = Math.max(minWidth, Math.min(maxWidth, boxWidth));
    for (const ingredient of ingredients) {
        const ingredientBox = createIngredientBox(ingredient);
        ingredientBox.style.width = `${boxWidth}px`;
        ingredientBox.style.flexShrink = "0";
        ingredientsSection.appendChild(ingredientBox);
    }
}
async function loadAPI() {
    try {
        let drink;
        let attempts = 0;
        const maxAttempts = 10;
        do {
            const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php"
            // "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=13128"
            );
            const data = await response.json();
            drink = data.drinks[0];
            const ingredientCount = countIngredients(drink);
            if (ingredientCount <= 6) {
                break;
            }
            attempts++;
            console.log(`Drink: ${drink.idDrink}, Ingredients: ${ingredientCount}`);
        } while (attempts < maxAttempts);
        if (attempts >= maxAttempts) {
            console.warn("too many ingredients still:", drink);
        }
        bigTitleContainer.textContent = drink.strDrink;
        console.log(drink.idDrink);
        cardImage.classList.remove("loaded");
        cardImage.src = drink.strDrinkThumb;
        cardImage.onload = () => {
            cardImage.classList.add("loaded");
        };
        const img = new Image();
        img.src = drink.strDrinkThumb;
        img.onload = () => {
            document.body.style.setProperty("--background-image", `url(${drink.strDrinkThumb})`);
        };
        const ingredients = extractIngredients(drink);
        document.body.classList.remove("hidden");
        await displayIngredients(ingredients);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
function countIngredients(drink) {
    let count = 0;
    let i = 1;
    while (drink[`strIngredient${i}`] !== null &&
        drink[`strIngredient${i}`] !== undefined) {
        const ingredientName = drink[`strIngredient${i}`];
        if (ingredientName && ingredientName.trim()) {
            count++;
        }
        i++;
    }
    return count;
}
function extractIngredients(drink) {
    const ingredients = [];
    let i = 1;
    while (drink[`strIngredient${i}`] !== null &&
        drink[`strIngredient${i}`] !== undefined) {
        const ingredientName = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredientName && ingredientName.trim()) {
            const ingredient = {
                name: ingredientName.trim(),
                measure: measure ? measure.trim() : undefined,
            };
            ingredients.push(ingredient);
        }
        i++;
    }
    return ingredients;
}
function localizeIngredientMeasures(measure) {
    function parseFraction(fraction) {
        try {
            const parts = fraction.trim().split(" ");
            if (parts.length > 1) {
                const [wholeNumber, fractionNumber] = parts;
                const [number, denominator] = fractionNumber
                    .split("/")
                    .map(Number);
                return parseFloat(wholeNumber) + number / denominator;
            }
            else if (parts[0].includes("/")) {
                const [number, denominator] = parts[0].split("/").map(Number);
                return number / denominator;
            }
            return parseFloat(parts[0]);
        }
        catch {
            return NaN;
        }
    }
    const unitConversions = {
        oz: 29.5735,
        tsp: 4.92892,
        tblsp: 14.7868,
        cup: 240,
        cups: 240,
        gal: 3785.41,
        mloz: 1,
        mltsp: 1,
        lb: 453.592,
    };
    const pattern = /^([\d\s\/.]+)\s*([a-zA-Z]+)/;
    const match = measure.trim().match(pattern);
    if (!match)
        return measure;
    const [, rawValue, unitRaw] = match;
    const value = parseFraction(rawValue);
    const unit = unitRaw.toLowerCase();
    if (isNaN(value) || !(unit in unitConversions))
        return measure;
    const convertedValue = Math.round(value * unitConversions[unit]);
    const newUnit = ["lb"].includes(unit) ? "g" : "ml";
    const restOfString = measure.substring(match[0].length).trim();
    const convertedPart = `${convertedValue} ${newUnit}`;
    return restOfString ? `${convertedPart} ${restOfString}` : convertedPart;
}
function createIngredientBox(ingredient) {
    const ingredientBox = document.createElement("div");
    ingredientBox.className = "ingredient-box";
    const ingredientImage = document.createElement("img");
    ingredientImage.className = "ingredient-image";
    ingredientImage.src = getIngredientThumbnail(ingredient.name);
    ingredientImage.alt = ingredient.name;
    ingredientImage.loading = "lazy";
    const ingredientName = document.createElement("div");
    ingredientName.className = "ingredient-name";
    ingredientName.textContent = ingredient.name;
    const ingredientMeasure = document.createElement("div");
    ingredientMeasure.className = "ingredient-measure";
    ingredientMeasure.textContent = ingredient.measure || "";
    // ingredientMeasure.textContent = localizeIngredientMeasures(
    //     ingredient.measure || ""
    // );
    ingredientBox.appendChild(ingredientImage);
    ingredientBox.appendChild(ingredientName);
    if (ingredient.measure) {
        ingredientBox.appendChild(ingredientMeasure);
    }
    return ingredientBox;
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
function handleCardHover(e) {
    const { clientX, clientY, currentTarget } = e;
    const target = currentTarget;
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
    document.body.classList.add("hidden");
    await loadAPI();
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => loadingScreen.remove(), 500);
    }
    loadEventListeners();
});
