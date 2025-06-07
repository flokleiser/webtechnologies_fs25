const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");

const card = document.querySelector(".card") as HTMLElement;
let cardBounds = card.getBoundingClientRect() as DOMRect;

if (!titleContainer || !imgContainer) {
    throw new Error("Required DOM elements not found");
}

if (!card) {
    throw new Error("Card missing");
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
        scale3d(1.03, 1.03, 1.03)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
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
