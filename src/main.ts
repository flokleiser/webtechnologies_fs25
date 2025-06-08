const bigTitleContainer = document.querySelector("[data-js='big-title']") as HTMLElement;
const titleContainer1 = document.querySelector("[data-js='colorname1']") as HTMLElement;
const titleContainer2 = document.querySelector("[data-js='colorname2']") as HTMLElement;
const titleContainer3 = document.querySelector("[data-js='colorname3']") as HTMLElement;
const title1= document.querySelector("[data-js='title1']") as HTMLElement;
const title2= document.querySelector("[data-js='title2']") as HTMLElement;
const title3= document.querySelector("[data-js='title3']") as HTMLElement;
const imgContainer = document.querySelector("[data-js='photo']") as HTMLElement;
const colorSection1= document.querySelector("[data-js='colorname1']") as HTMLElement;
const colorSection2= document.querySelector("[data-js='colorname2']") as HTMLElement;
const colorSection3= document.querySelector("[data-js='colorname3']") as HTMLElement;
const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
const cardHeader = document.querySelector(".cardHeader") as HTMLElement;
const cardFooter = document.querySelector(".cardFooter") as HTMLElement;
const button1 = document.querySelector(".button1") as HTMLElement
const buttonToggleMode = document.querySelector(".buttonToggleMode") as HTMLElement;
const buttonReload = document.querySelector(".buttonReload") as HTMLElement;
const buttonToggleScheme = document.querySelector(".buttonToggleScheme") as HTMLElement;

const buttonContainer1 = document.querySelector(".buttonContainer1") as HTMLElement;
const buttonContainer2 = document.querySelector(".buttonContainer2") as HTMLElement;
const buttonContainer3 = document.querySelector(".buttonContainer3") as HTMLElement;

const copyButton1 = document.querySelector(".copyButton1") as HTMLElement;
const copyButton2 = document.querySelector(".copyButton2") as HTMLElement;
const copyButton3 = document.querySelector(".copyButton3") as HTMLElement;


let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 4;

const colorModes = ["hex", "rgb", "hsl"];
let currentModeIndex = 0;
let currentMode = colorModes[currentModeIndex];

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

        const color1 = data.colors[0][currentMode].value
        const color2 = data.colors[1][currentMode].value;
        const color3 = data.colors[2][currentMode].value;



        titleColor = data.colors[1].name.value;

        // const gradientName = await generateGradientName(testColor);
        // bigTitleContainer.innerHTML = gradientName;

        bigTitleContainer.innerHTML = titleColor;

        document.body.style.background = `linear-gradient(1turn,${color1}, ${color2}, ${color3})`;
        // document.body.style.background = color2

        document.body.classList.remove("hidden");

        buttonToggleMode.innerHTML = `${currentMode.toUpperCase()}`;
        buttonToggleScheme.innerHTML = `${currentSchemeMode.toUpperCase()}`;

        copyColor1 = color1
        copyColor2 = color2
        copyColor3 = color3


        button1.style.backgroundColor = color3;
        buttonReload.style.backgroundColor = color3;
        // buttonReload.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
        buttonToggleMode.style.backgroundColor = color3;
        buttonToggleScheme.style.backgroundColor = color3;

        buttonContainer1.style.backgroundColor = color3;
        buttonContainer2.style.backgroundColor = color3;
        buttonContainer3.style.backgroundColor = color3;

        card.style.backgroundColor = color2;

        colorSection1.style.backgroundColor = color1;
        colorSection2.style.backgroundColor= color2;
        colorSection3.style.backgroundColor= color3;

        copyButton1.style.backgroundColor = color1;
        copyButton2.style.backgroundColor = color2;
        copyButton3.style.backgroundColor = color3;

        titleContainer1.addEventListener("mouseover", () => {
            title1.innerHTML = color1 
            title1.classList.add("visible");
            copyButton1.classList.add("copyButton-visible");
        });

        titleContainer1.addEventListener("mouseout", () => {
            title1.innerHTML = "";
            title1.classList.remove("visible");
            copyButton1.classList.remove("copyButton-visible");
        });

        titleContainer2.addEventListener("mouseover", () => {
            title2.innerHTML = color2 
            title2.classList.add("visible");
            copyButton2.classList.add("copyButton-visible");
        });

        titleContainer2.addEventListener("mouseout", () => {
            title2.innerHTML = "";
            title2.classList.remove("visible");
            copyButton2.classList.remove("copyButton-visible");
        });

        titleContainer3.addEventListener("mouseover", () => {
            title3.innerHTML = color3 
            title3.classList.add("visible");
            copyButton3.classList.add("copyButton-visible");
        });

        titleContainer3.addEventListener("mouseout", () => {
            title3.innerHTML = "";
            title3.classList.remove("visible");
            copyButton3.classList.remove("copyButton-visible");
        });

        cardFooter.style.backgroundColor = color3;
        cardHeader.style.backgroundColor = color3;

        setTextColor(data.colors[1].contrast.value)

        //this might be needed in case one color is much darker
        // titleContainer1.style.color = data.colors[0].contrast.value;  
        // titleContainer2.style.color = data.colors[1].contrast.value;
        // titleContainer3.style.color = data.colors[2].contrast.value;

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

        titleContainer1.style.color = hex;  
        titleContainer2.style.color = hex;
        titleContainer3.style.color = hex;
        copyButton1.style.color = hex;
        copyButton2.style.color = hex;
        copyButton3.style.color = hex;
}

function copyToClipboard(color: string) {
    navigator.clipboard.writeText(color).then(() => {
        console.log(`Copied ${color} to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

cardContainer.addEventListener("mouseenter", () => {
    cardBounds = cardContainer.getBoundingClientRect();
    cardContainer.addEventListener("mousemove", handleHover);
});

cardContainer.addEventListener("mouseleave", () => {
    cardContainer.removeEventListener("mousemove", handleHover);
    resetStyles();
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

buttonContainer3.addEventListener("mouseenter", () => {
    buttonReload.classList.add(":hovered")
})

buttonContainer3.addEventListener("mouseleave", () => {
    buttonReload.classList.remove(":hovered")
})

copyButton1.addEventListener("click", () => {
    copyToClipboard(copyColor1);
});

copyButton2.addEventListener("click", () => {
    copyToClipboard(copyColor2);
});

copyButton3.addEventListener("click", () => {
    copyToClipboard(copyColor3);
}); 


function handleHover(e: MouseEvent) {
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

function resetStyles() {
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

});
