const buttonContainers = [...document.querySelectorAll<HTMLElement>(".buttonContainer1, .buttonContainer2, .buttonContainer3")];
const titleContainers = [...document.querySelectorAll<HTMLElement>("[data-js^='colorname']")];
const titles = [...document.querySelectorAll<HTMLElement>("[data-js^='title']")];
const copyButtons = [...document.querySelectorAll<HTMLElement>(".copyButton1, .copyButton2, .copyButton3")];

const bigTitleContainer = document.querySelector("[data-js='big-title']") as HTMLElement;
const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
const cardHeader = document.querySelector(".cardHeader") as HTMLElement;
const cardFooter = document.querySelector(".cardFooter") as HTMLElement;
const button1 = document.querySelector(".button1") as HTMLElement
const buttonToggleMode = document.querySelector(".buttonToggleMode") as HTMLElement;
const buttonReload = document.querySelector(".buttonReload") as HTMLElement;
const buttonToggleScheme = document.querySelector(".buttonToggleScheme") as HTMLElement;

let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 4;

const colorModes = ["hex", "rgb", "hsl"];
let currentModeIndex = 0;
let currentMode = colorModes[currentModeIndex];

let initHover = false;

const schemeModes = [
    "monochrome",
    "complement",
];
let currentSchemeIndex = 0;
let currentSchemeMode = schemeModes[currentSchemeIndex]

let color : string
let testColor : string
let titleColor : string

let copyColor1 : string;
let copyColor2 : string;
let copyColor3 : string;

let hoverColor : string;
let normalColor : string;

let currentColors: string[] = [];

async function getRandomColor() {
    try {
        const response = await fetch("https://x-colors.yurace.pro/api/random");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        testColor = data.hex.split("#")[1];

    } catch (error) {
        console.error("Error: ", error);
    }
}

async function loadAPI(testColor: string) {
    try {

        const response = await fetch(`https://www.thecolorapi.com/scheme?&mode=${currentSchemeMode}&hex=${testColor}&count=3`);
        const data = await response.json();

        const colors = data.colors.map((color: { [x: string]: { value: any; }; }) => color[currentMode].value);
        const [color1, color2, color3] = colors;

        titleColor = data.colors[1].name.value;

        bigTitleContainer.innerHTML = titleColor;

        document.body.style.background = `linear-gradient(1turn,${color1}, ${color2}, ${color3})`;

        document.body.classList.remove("hidden");

        buttonToggleMode.innerHTML = `${currentMode.toUpperCase()}`;
        buttonToggleScheme.innerHTML = `${currentSchemeMode.toUpperCase()}`;

        setColors(color1, color2, color3);
      

        cardFooter.style.backgroundColor = color3;
        cardHeader.style.backgroundColor = color3;

        setTextColor(data.colors[1].contrast.value)

        hoverColor = color2;
        normalColor = color3;


    } catch (error) {
        console.error("Error:", error);
    }
}

function setTextColor(hex: string){
        bigTitleContainer.style.color = hex;
        button1.style.color = hex;
        buttonToggleMode.style.color = hex;
        buttonReload.style.color = hex;
        buttonToggleScheme.style.color = hex;

        titleContainers.forEach((container) => {
            container.style.color = hex;
        });

        copyButtons.forEach((button) => {
            button.style.color = hex;
        });
}

function setColors(color1:string,color2:string,color3:string) {

    currentColors = [color1, color2, color3];

    copyColor1 = color1
    copyColor2 = color2
    copyColor3 = color3

    card.style.backgroundColor = color2;

    titleContainers[0].style.backgroundColor = color1;
    titleContainers[1].style.backgroundColor = color2;
    titleContainers[2].style.backgroundColor = color3;

    copyButtons[0].style.backgroundColor= color1;
    copyButtons[1].style.backgroundColor= color2;
    copyButtons[2].style.backgroundColor= color3;


    button1.style.backgroundColor = color2;

    buttonContainers.forEach((container) => {
        container.style.backgroundColor = color3;
    });

    hoverColor = color2;
    normalColor = color3;
}

function loadEventListenersOnce() {
    titleContainers.forEach((container, i) => {
        container.addEventListener("mouseover", () => {
            titles[i].innerHTML = currentColors[i];
            titles[i].classList.add("visible");
            copyButtons[i].classList.add("copyButton-visible");
        });

        container.addEventListener("mouseout", () => {
            titles[i].innerHTML = "";
            titles[i].classList.remove("visible");
            copyButtons[i].classList.remove("copyButton-visible");
        });
    });

    buttonContainers.forEach((container) => {
        container.addEventListener("mouseover", () => {
            container.classList.add(":hover");
            container.style.backgroundColor = hoverColor;
        });

        container.addEventListener("mouseout", () => {
            container.style.backgroundColor = normalColor;
            container.classList.remove(":hover");
        });

    });

    copyButtons.forEach((btn, i) => {
        btn.addEventListener("mouseenter", () => {
            btn.classList.add(":hover");
            btn.style.backgroundColor = i === 1 ? currentColors[2] : hoverColor;
        });

        btn.addEventListener("mouseleave", () => {
            btn.classList.remove(":hover");
            btn.style.backgroundColor = currentColors[i];
        });
    });

        cardContainer.addEventListener("mouseenter", () => {
        cardBounds = cardContainer.getBoundingClientRect();
        cardContainer.addEventListener("mousemove", handleCardHover);
    });

    cardContainer.addEventListener("mouseleave", () => {
        cardContainer.removeEventListener("mousemove", handleCardHover);
        resetCardStyle();
    });

    buttonReload.addEventListener("click", () => {
        getRandomColor().then(() => {
            loadAPI(testColor);
        })
    });

    buttonToggleMode.addEventListener("click", () => {
        currentModeIndex = (currentModeIndex + 1) % colorModes.length;
        currentMode = colorModes[currentModeIndex];
       
        loadAPI(testColor); 
    });

    buttonToggleScheme.addEventListener("click", () => {
        currentSchemeIndex = (currentSchemeIndex + 1) % schemeModes.length;
        currentSchemeMode = schemeModes[currentSchemeIndex];

        console.log(`Scheme mode switched to: ${currentSchemeMode}`);
        loadAPI(testColor);
    });

}

function copyToClipboard(color: string) {
    navigator.clipboard.writeText(color).then(() => {
        console.log(`Copied ${color} to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
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
    
    document.body.classList.add("hidden"); 

    await getRandomColor(); 
    await loadAPI(testColor); 

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => loadingScreen.remove(), 500);
    }

    loadEventListenersOnce()

});
