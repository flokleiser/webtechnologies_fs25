const bigTitleContainer = document.querySelector("[data-js='big-title']") as HTMLElement;
const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
const cardHeader = document.querySelector(".cardHeader") as HTMLElement;
const cardFooter = document.querySelector(".cardFooter") as HTMLElement;
const buttonReload = document.querySelector(".buttonReload") as HTMLElement;
const cardImage = document.querySelector(".main-image") as HTMLImageElement;

const button1 = document.querySelector(".button1") as HTMLElement

const ingredientsSection= document.querySelector(".ingredients-section") as HTMLElement;

let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 3;

interface Ingredient {
    name: string;
    measure?: string;
    imageUrl?: string;
}

function getIngredientThumbnail(ingredientName: string): string {
    return `https://www.thecocktaildb.com/images/ingredients/${ingredientName}.png`;
}

async function displayIngredients(ingredients: Ingredient[]) {
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

        const ingredients: Ingredient[] = [];
        let i = 1;

        while (drink[`strIngredient${i}`] !== null && drink[`strIngredient${i}`] !== undefined) {
            const ingredientName = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            
            if (ingredientName && ingredientName.trim()) {
                const ingredient: Ingredient = {
                    name: ingredientName.trim(),
                    measure: measure ? measure.trim() : undefined
                };
                
                ingredients.push(ingredient);
            }
            i++;
        }

        
        await displayIngredients(ingredients);

    } catch (error) {
        console.error("Error:", error);
    }
}

function createIngredientBox(ingredient: Ingredient): HTMLElement {
    const ingredientBox = document.createElement('div');
    ingredientBox.className = 'ingredient-box';

    const ingredientImage = document.createElement('img');
    ingredientImage.className = 'ingredient-image';
    ingredientImage.src = getIngredientThumbnail(ingredient.name);
    ingredientImage.alt = ingredient.name;
    ingredientImage.loading = 'lazy';
    
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

    cardContainer.style.transform = `translate(-50%, -50%) perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.015, 1.015, 1.015)`;
}

function resetCardStyle() {
    cardContainer.style.transform = `translate(-50%, -50%) perspective(450px) rotateX(0deg) rotateY(0deg)`;
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadAPI(); 
    loadEventListeners()
});
