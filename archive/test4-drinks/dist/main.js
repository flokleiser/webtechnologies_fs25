"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
const buttonReload = document.querySelector(".buttonReload");
const cardImage = document.querySelector(".main-image");
const button1 = document.querySelector(".button1");
const ingredientsSection = document.querySelector(".ingredients-section");
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const threshold = 3;
const key = window.env.UNSPLASH_ACCESS_KEY;
const testName = "mac";
console.log('this might not work on gh pages because api key');
// async function fetchSomeImage(){
//     try {
//         const response = await fetch(`https://api.unsplash.com/search/photos?query=${testName}&per_page=1`, {
//             headers: {
//                 'Authorization': `Client-ID ${key}`
//             }
//         });
//         const data = await response.json();
//         if (data.results && data.results.length > 0) {
//             return data.results[0].urls.small;
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }
async function fetchIngredientImage(ingredientName) {
    try {
        const ingredientSeed = ingredientName.toLowerCase().replace(/\s+/g, '');
        // return `https://picsum.photos/seed/${ingredientSeed}/150/150`;
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${ingredientSeed}&per_page=1`, {
            headers: {
                'Authorization': `Client-ID ${key}`
            }
        });
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.small;
        }
        else {
            console.warn(`No image found for ingredient: ${ingredientName}`);
            return '';
        }
    }
    catch (error) {
        console.error(`Error fetching image for ${ingredientName}:`, error);
        return '';
    }
}
async function displayIngredients(ingredients) {
    ingredientsSection.innerHTML = '';
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
        ingredientBox.style.flexShrink = '0';
        ingredientsSection.appendChild(ingredientBox);
    }
}
async function loadAPI() {
    try {
        const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const data = await response.json();
        const drink = data.drinks[0];
        bigTitleContainer.textContent = drink.strDrink;
        cardImage.src = drink.strDrinkThumb;
        const ingredients = [];
        let i = 1;
        // await fetchSomeImage();
        // cardImage.src = await fetchSomeImage() 
        while (drink[`strIngredient${i}`] !== null && drink[`strIngredient${i}`] !== undefined) {
            const ingredientName = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredientName && ingredientName.trim()) {
                const ingredient = {
                    name: ingredientName.trim(),
                    measure: measure ? measure.trim() : undefined
                };
                ingredient.imageUrl = await fetchIngredientImage(ingredient.name);
                ingredients.push(ingredient);
            }
            i++;
        }
        console.log('Ingredients:', ingredients);
        await displayIngredients(ingredients);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
function createIngredientBox(ingredient) {
    const ingredientBox = document.createElement('div');
    ingredientBox.className = 'ingredient-box';
    const ingredientImage = document.createElement('img');
    ingredientImage.className = 'ingredient-image';
    // ingredientImage.src = ingredient.imageUrl || '';
    ingredientImage.src = ingredient.imageUrl || 'https://placehold.co/150';
    ingredientImage.alt = ingredient.name;
    ingredientImage.loading = 'lazy';
    // ingredientImage.loading = 'eager';
    const ingredientName = document.createElement('div');
    ingredientName.className = 'ingredient-name';
    ingredientName.textContent = ingredient.name;
    const ingredientMeasure = document.createElement('div');
    ingredientMeasure.className = 'ingredient-measure';
    ingredientMeasure.textContent = ingredient.measure || '';
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
        resetFooterState();
    });
    buttonReload.addEventListener("click", () => {
        loadAPI();
    });
    cardFooter.addEventListener("mouseenter", () => {
        expandFooter();
    });
    cardFooter.addEventListener("mouseleave", () => {
        resetFooterState();
    });
    buttonReload.addEventListener("click", () => {
        loadAPI();
    });
}
function expandFooter() {
    cardFooter.style.width = "500px";
    cardFooter.style.transition = "width 250ms ease, box-shadow 250ms ease, transform 250ms ease";
}
function resetFooterState() {
    cardFooter.style.width = "430px";
    cardFooter.style.transition = "width 250ms ease, box-shadow 250ms ease, transform 250ms ease";
    ingredientsSection.style.width = "100%";
    ingredientsSection.style.transition = "width 300ms ease";
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
    cardContainer.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.015, 1.015, 1.015)`;
}
function resetCardStyle() {
    cardContainer.style.transform = `perspective(450px) rotateX(0deg) rotateY(0deg)`;
}
document.addEventListener("DOMContentLoaded", async () => {
    await loadAPI();
    loadEventListeners();
});
