const buttonContainers = [...document.querySelectorAll<HTMLElement>(".buttonContainer1, .buttonContainer2, .buttonContainer3, .buttonContainer4")];
const titleContainers = [...document.querySelectorAll<HTMLElement>("[data-js^='colorname']")];
const titles = [...document.querySelectorAll<HTMLElement>("[data-js^='title']")];
const copyButtons = [...document.querySelectorAll<HTMLElement>(".copyButton1, .copyButton2, .copyButton3")];

const bigTitleContainer = document.querySelector("[data-js='big-title']") as HTMLElement;
const card = document.querySelector(".card") as HTMLElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;
const cardHeader = document.querySelector(".cardHeader") as HTMLElement;
const cardFooter = document.querySelector(".cardFooter") as HTMLElement;
const buttonToggleMode = document.querySelector(".buttonToggleMode") as HTMLElement;
const buttonReload = document.querySelector(".buttonReload") as HTMLElement;
const buttonToggleScheme = document.querySelector(".buttonToggleScheme") as HTMLElement;
const buttonSettings = document.querySelector(".buttonSettings") as HTMLElement;

const historyBar = document.querySelector(".history-bar") as HTMLElement;
const buttonPalette = document.querySelector(".buttonPalette") as HTMLElement;
const settingsExpanded = document.querySelector(".settings-expanded") as HTMLElement;

const settingsSection = document.querySelector(".settings-section") as HTMLElement;
const paletteSection = document.querySelector(".palette-section") as HTMLElement;

const paletteHistoryExpanded = document.querySelector(".palette-history-expanded") as HTMLElement;
const paletteSwatches = [...document.querySelectorAll<HTMLElement>(".palette-swatch")];
const buttonContainerPalette = document.querySelector(".buttonContainer-palette") as HTMLElement;
const buttonContainerSettings= document.querySelector(".buttonContainer-settings") as HTMLElement;

const button1 = document.querySelector(".button1") as HTMLElement
const button2 = document.querySelector(".button2") as HTMLElement;
const button3 = document.querySelector(".button3") as HTMLElement;

let settingsOpen = false;
let paletteOpen = false;

let cardBounds = card.getBoundingClientRect() as DOMRect;
let cardContainerBounds = cardContainer.getBoundingClientRect() as DOMRect;

const threshold = 3;

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
let contrastColor : string;
let transparentColor: string

let copyColor1 : string;
let copyColor2 : string;
let copyColor3 : string;

let littlePaletteColor1 : string;
let hoverColor : string;
let otherHoverColor : string;
let normalColor : string;

let currentColors: string[] = [];

interface ColorPalette {
    colors: string[];
    mode: string;
    scheme: string;
    title: string
    contrast: string;
}

let paletteHistory: ColorPalette[] = [];
const maxHistorySize = 4;
let historyScrollPosition = 0;

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

function reload() {
    getRandomColor().then(() => {
        loadAPI(testColor)
    });
}

async function loadAPI(testColor: string) {
    try {
        const response = await fetch(`https://www.thecolorapi.com/scheme?&mode=${currentSchemeMode}&hex=${testColor}&count=3`);
        const data = await response.json();

        const colors = data.colors.map((color: { [x: string]: { value: any; }; }) => color[currentMode].value);
        const [color1, color2, color3] = colors;

        //hacky way to ensure black is not in the color scheme
        if (color1 === "#000000" || color1 === "rgb(0, 0, 0)" || color1 === "hsl(0, 0%, 0%)") {
            console.log('black')
            reload();
        }

        contrastColor = data.colors[1].contrast.value;
        transparentColor = data.colors[1].hex.value + "80";
        titleColor = data.colors[1].name.value;

        //hacky way to make title not too long
        if (titleColor.length > 13) {
            if (titleColor.includes(" ")) {
                titleColor = titleColor.split(" ")[0];
            } else {
                titleColor = titleColor.slice(0, 13);
            }
        }

        bigTitleContainer.innerHTML = titleColor;
        document.body.classList.remove("hidden");

        buttonToggleMode.innerHTML = (currentMode === "hex" ? "#HEX" : currentMode === "rgb" ? "(R,G,B)" : "(H,S,L)");
        buttonToggleScheme.innerHTML = `${currentSchemeMode.toUpperCase().slice(0,4)}`;
        setColors(color1, color2, color3, contrastColor);

        const newPalette: ColorPalette = {
            colors: [color1, color2, color3],
            mode: currentMode,
            scheme: currentSchemeMode,
            title: titleColor,
            contrast: contrastColor
        };

        addToHistory(newPalette);


    } catch (error) {
        console.error("Error:", error);
    }
}

function setColors(color1:string,color2:string,color3:string,contrastColor:string) {

    currentColors = [color1, color2, color3];

    hoverColor = color2;
    otherHoverColor = color3;
    normalColor = color3;

    copyColor1 = color1
    copyColor2 = color2
    copyColor3 = color3

    card.style.backgroundColor = color2;
    // button1.style.backgroundColor = color3;
    button1.style.backgroundColor = transparentColor;
    button2.style.backgroundColor = transparentColor;
    button3.style.backgroundColor = transparentColor;

    titleContainers[0].style.backgroundColor = color1;
    titleContainers[1].style.backgroundColor = color2;
    titleContainers[2].style.backgroundColor = color3;

    copyButtons[0].style.backgroundColor= color1;
    copyButtons[1].style.backgroundColor= color2;
    copyButtons[2].style.backgroundColor= color3;

    buttonContainers[0].style.backgroundColor = color3;
    buttonContainers[1].style.backgroundColor = color3;
    buttonContainers[2].style.backgroundColor = color3;

    // buttonContainers[3].style.backgroundColor = color1;
    buttonContainerSettings.style.backgroundColor = color3;
    buttonContainerPalette.style.backgroundColor = color3;

    document.body.style.background = `linear-gradient(1turn,${color1}, ${color2}, ${color3})`;

    cardFooter.style.backgroundColor = color3;
    cardHeader.style.backgroundColor = color3;

    paletteSwatches[0].style.backgroundColor = color1;
    paletteSwatches[1].style.backgroundColor = color2;
    paletteSwatches[2].style.backgroundColor = color3;

    //text
    bigTitleContainer.style.color = contrastColor;
    buttonToggleMode.style.color = contrastColor;
    buttonReload.style.color = contrastColor;
    buttonToggleScheme.style.color = contrastColor;
    buttonSettings.style.color = contrastColor;
    button1.style.color = contrastColor;
    button2.style.color = contrastColor;
    button3.style.color = contrastColor;

    titleContainers.forEach((container) => {
        container.style.color = contrastColor;
    });

    copyButtons.forEach((button) => {
        button.style.color = contrastColor;
    });

    // settingsSection.style.backgroundColor = settingsOpen ? "transparent" : color2;
    // console.log(settingsSection.style.backgroundColor);

    preserveHoverState();
}

function preserveHoverState() {
    [...buttonContainers, buttonContainerPalette].forEach((container) => {
        if (container.matches(":hover")) {
            container.style.backgroundColor = hoverColor;
        }
    });
}

function loadEventListeners() {
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

        // console.log(`Scheme mode switched to: ${currentSchemeMode}`);
        loadAPI(testColor);
    });

    buttonContainerPalette.addEventListener("mouseover", () => {
        buttonContainerPalette.classList.add(":hover");
        buttonContainerPalette.style.backgroundColor = hoverColor;
    });

    buttonContainerPalette.addEventListener("mouseout", () => {
        buttonContainerPalette.style.backgroundColor = normalColor;
        buttonContainerPalette.classList.remove(":hover");
    });

    buttonContainerSettings.addEventListener("mouseover", () => {
        buttonContainerSettings.classList.add(":hover");
        buttonContainerSettings.style.backgroundColor = hoverColor;
    });

    buttonContainerSettings.addEventListener("mouseout", () => {
        buttonContainerSettings.style.backgroundColor = normalColor;
        buttonContainerSettings.classList.remove(":hover");
    });

     buttonSettings.addEventListener("click", () => {
        settingsOpen = !settingsOpen;

        console.log(settingsSection.style.backgroundColor);
        
        if (settingsOpen) {
            settingsExpanded.classList.add("expanded");
            buttonContainerPalette.classList.add("shrunk");
            // settingsSection.style.backgroundColor = currentColors[0];

            if (paletteOpen) {
                paletteOpen = false;
                paletteHistoryExpanded.classList.remove("expanded");
                buttonContainerPalette.classList.add("shrunk");
                // paletteSection.style.backgroundColor = "transparent";
            }
        } else {
            settingsExpanded.classList.remove("expanded");
            buttonContainerPalette.classList.remove("shrunk");
            // settingsSection.style.backgroundColor = "transparent";
        }
        
        console.log(`Settings ${settingsOpen ? "open" : "closed"}`);
    });

    buttonPalette.addEventListener("click", () => {
        paletteOpen = !paletteOpen;
        
        if (paletteOpen) {
            updateHistoryBar();
            paletteHistoryExpanded.classList.add("expanded");
            buttonContainerSettings.classList.add("shrunk")
            // paletteSection.style.backgroundColor = currentColors[0];

            if (settingsOpen) {
                settingsOpen = false;
                settingsExpanded.classList.remove("expanded");
                buttonContainerPalette.classList.remove("shrunk");
                // settingsSection.style.backgroundColor = "transparent";
            }
        } else {
            paletteHistoryExpanded.classList.remove("expanded");
            buttonContainerSettings.classList.remove("shrunk")
            // paletteSection.style.backgroundColor = "transparent";
        }
        
        console.log(`Palette ${paletteOpen ? "open" : "closed"}`, 'History length:', paletteHistory.length);
    });

    copyButtons.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            const colorToCopy = i === 0 ? copyColor1 : i === 1 ? copyColor2 : copyColor3;
            copyToClipboard(colorToCopy);
        });
    });
}

function copyToClipboard(color: string) {
    navigator.clipboard.writeText(color).then(() => {
        console.log(`Copied ${color} to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function updateHistoryBar() {
    if (!historyBar) return;
    
    historyBar.innerHTML = '';
    
    // const displayPalettes = paletteHistory.slice(-4);
    const currentPalette = paletteHistory[paletteHistory.length - 1];
    const displayPalettes = paletteHistory.filter(palette => palette !== currentPalette).slice(-3);
    
    displayPalettes.forEach((palette, index) => {
        const actualIndex = paletteHistory.indexOf(palette);
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.setAttribute('data-index', actualIndex.toString());
        
        palette.colors.forEach(color => {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'history-swatch';
            colorSwatch.style.backgroundColor = color;
            historyItem.appendChild(colorSwatch);
        });
        
        historyItem.addEventListener('click', () => restorePalette(actualIndex));
        
        historyBar.appendChild(historyItem);
    });
}

function addToHistory(palette: ColorPalette) {
    if (paletteHistory.length > 0) {
        const lastPalette = paletteHistory[paletteHistory.length - 1];

        //this checks to not add duplicate palettes
        if (JSON.stringify(lastPalette.colors) === JSON.stringify(palette.colors)) {
            return;
        }
    }
    
    paletteHistory.push(palette);
    
    if (paletteHistory.length > maxHistorySize) {
        paletteHistory.shift();
    }
    
    updateHistoryBar();
}

function restorePalette(index: number) {
    if (index < 0 || index >= paletteHistory.length) return;
    
    const palette = paletteHistory[index];
    
    currentColors = palette.colors;
    currentMode = palette.mode;
    currentSchemeMode = palette.scheme;
    currentModeIndex = colorModes.indexOf(palette.mode);
    currentSchemeIndex = schemeModes.indexOf(palette.scheme);
    
    setColors(palette.colors[0], palette.colors[1], palette.colors[2], palette.contrast);
    
    bigTitleContainer.innerHTML = palette.title;
    buttonToggleMode.innerHTML = `${currentMode.toUpperCase()}`;
    buttonToggleScheme.innerHTML = `${currentSchemeMode.toUpperCase().slice(0,4)}`;
    
    titles.forEach((title, i) => {
        if (title.classList.contains('visible')) {
            title.innerHTML = currentColors[i];
        }
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

    cardContainer.style.transform = `translate(-50%, -50%) perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.015, 1.015, 1.015)`;
}

function resetCardStyle() {
    cardContainer.style.transform = `translate(-50%, -50%) perspective(450px) rotateX(0deg) rotateY(0deg)`;
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

    loadEventListeners()

});
