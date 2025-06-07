"use strict";
console.log("...fetching a random cocktail 🍹");
const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
if (!titleContainer || !imgContainer) {
    throw new Error("Required DOM elements not found");
}
fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
    // Process the fetched data here
    // select the first (and only drink of the results)
    const drink = data.drinks[0];
    // check in console
    console.log("drink: ", drink);
    // display title in title container
    titleContainer.innerHTML = drink.strDrink;
    // display drink image to the screen
    // first create an img tag on the fly
    const img = document.createElement("img");
    img.src = drink.strDrinkThumb;
    img.alt = drink.strDrink;
    imgContainer.appendChild(img);
})
    .catch((error) => {
    console.error("Error:", error);
});
