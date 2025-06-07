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
const button2 = document.querySelector(".button2") as HTMLElement


let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 5;

let color : string
let testColor : string
let titleColor : string

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

async function loadAPI() {

    try {
        const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${testColor}&count=3`);
        const data = await response.json();


        const color1 = data.colors[0].hex.value;
        const color2 = data.colors[1].hex.value;
        const color3 = data.colors[2].hex.value;

        titleColor = data.colors[1].name.value;

        // const gradientName = await generateGradientName(testColor);
        // bigTitleContainer.innerHTML = gradientName;

        bigTitleContainer.innerHTML = titleColor;

        document.body.style.background = `linear-gradient(1turn,${color1}, ${color2}, ${color3})`;

        document.body.classList.remove("hidden");


        button1.style.backgroundColor = color3;
        button2.style.backgroundColor = color3;

        card.style.backgroundColor = color2;

        colorSection1.style.backgroundColor = color1;
        colorSection2.style.backgroundColor= color2;
        colorSection3.style.backgroundColor= color3;

        titleContainer1.addEventListener("mouseover", () => {
            title1.innerHTML = color1
            title1.classList.add("visible");
        });

        titleContainer1.addEventListener("mouseout", () => {
            title1.innerHTML = "";
            title1.classList.remove("visible");
        });

        titleContainer2.addEventListener("mouseover", () => {
            title2.innerHTML = color2
            title2.classList.add("visible");
        });

        titleContainer2.addEventListener("mouseout", () => {
            title2.innerHTML = "";
            title2.classList.remove("visible");
        });

        titleContainer3.addEventListener("mouseover", () => {
            title3.innerHTML = color3
            title3.classList.add("visible");
        });

        titleContainer3.addEventListener("mouseout", () => {
            title3.innerHTML = "";
            title3.classList.remove("visible");
        });


        cardFooter.style.backgroundColor = color3;
        cardHeader.style.backgroundColor = color3;

        setTextColor(color3);

    } catch (error) {
        console.error("Error:", error);
    }
}

//chatgpt is being dumb, rate limits
// async function generateGradientName(colorHex: string): Promise<string> {
//   const prompt = `Generate a fitting and creative name for a gradient based on the color ${colorHex}.`;

//   try {
//     const response = await fetch('https://vercel-openai-api-phi.vercel.app/api/openai', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ prompt }),
//     });

//     if (!response.ok) {
//       throw new Error(`OpenAI API error: ${response.status}`);
//     }

//     const data = await response.json();

//     const gradientName = data.choices?.[0]?.message?.content || 'Unnamed Gradient';

//     console.log("Generated Gradient Name:", gradientName);

//     return gradientName;
//   } catch (error) {
//     console.error("Error generating gradient name:", error);
//     return "#"+colorHex; // fallback if its all gone to shit
//   }
// }


function setTextColor(hex: string){
        const rgbColor3 = hexToRgb(hex);
        const luminance = rgbToLuminance(rgbColor3);

        if (luminance < 0.5) {
            bigTitleContainer.style.color = "#FFFFFF";
            button1.style.color = "#FFFFFF";
            button2.style.color = "#FFFFFF";
            titleContainer1.style.color = "#FFFFFF";
            titleContainer2.style.color = "#FFFFFF";
            titleContainer3.style.color = "#FFFFFF";
            
        } else {
            bigTitleContainer.style.color = "#000000"; 
            button1.style.color = "#000000";
            button2.style.color = "#000000";
            titleContainer1.style.color = "#000000";
            titleContainer2.style.color = "#000000";
            titleContainer3.style.color = "#000000";
        }
}



function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return {r,g,b};
}

function rgbToLuminance({r,g,b}: { r: number; g: number; b: number }): number {
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    return 0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;
}



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
    const rotateX = (horizontal * threshold - threshold / 2).toFixed(2);
    const rotateY = (threshold / 2 - vertical * threshold).toFixed(2);

    cardContainer.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
}

function resetStyles() {
    cardContainer.style.transform = `perspective(450px) rotateX(0deg) rotateY(0deg)`;
}

document.addEventListener("DOMContentLoaded", async () => {
    
    document.body.classList.add("hidden"); 

    await getRandomColor(); 
    await loadAPI(); 

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => loadingScreen.remove(), 500); // remove from DOM after fade
    }

});
