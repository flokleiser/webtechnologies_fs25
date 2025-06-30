"use strict";
const bigTitleContainer = document.querySelector("[data-js='big-title']");
const card = document.querySelector(".card");
const cardContainer = document.querySelector(".cardContainer");
const cardHeader = document.querySelector(".cardHeader");
const cardFooter = document.querySelector(".cardFooter");
const buttonToggleMode = document.querySelector(".buttonToggleMode");
const buttonReload = document.querySelector(".buttonReload");
const buttonToggleScheme = document.querySelector(".buttonToggleScheme");
const buttonSettings = document.querySelector(".buttonSettings");
const button1 = document.querySelector(".button1");
const button2 = document.querySelector(".button2");
const button3 = document.querySelector(".button3");
const buttonSelect = document.querySelector(".buttonSelect");
const departureContainer = document.querySelector(".departureContainer");
const departure1 = document.querySelector(".departure1");
const departure2 = document.querySelector(".departure2");
const departure3 = document.querySelector(".departure3");
let settingsOpen = false;
let paletteOpen = false;
let cardBounds = card.getBoundingClientRect();
let cardContainerBounds = cardContainer.getBoundingClientRect();
const threshold = 3;
let color;
let testColor;
let titleColor;
let contrastColor;
let transparentColor;
let hoverColor;
let otherHoverColor;
let normalColor;
let currentColors = [];
const stationSelect = document.getElementById('stationSelect');
const destinationSelect = document.getElementById('destinationSelect');
let stationSuggestions = [];
let currentActiveDropdown = null;
const commonStations = [
    "Rathaus", "Toni-Areal", "Hauptbahnhof", "Bellevue", "Paradeplatz",
    "Oerlikon", "Stadelhofen", "Altstetten", "Wiedikon", "Hardbrücke",
    "Milchbuck", "Bahnhof Enge", "ETH/Universitätsspital", "Röntgenplatz",
    "Schaffhauserplatz", "Limmatplatz", "Central", "Hirschenplatz"
];
if (!stationSelect || !destinationSelect) {
    console.error("Station inputs not found");
}
function getCurrentStationName() {
    const value = stationSelect.value.trim();
    return value ? `Zürich, ${value}` : 'Zürich, Toni-Areal';
}
function getCurrentDestination() {
    const value = destinationSelect.value.trim();
    return value ? `Zürich, ${value}` : 'Zürich, Rathaus';
}
function reload() {
    loadAPI();
}
async function loadAPI() {
    try {
        const stationName = getCurrentStationName();
        const destination = getCurrentDestination();
        const response = await fetch(`https://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(stationName)}&limit=10`);
        const data = await response.json();
        displayConnections(data.stationboard, destination);
        contrastColor = "#ffffff";
        transparentColor = "#ffffff20";
        bigTitleContainer.innerHTML = "openTransport";
        document.body.classList.remove("hidden");
        setColors("#333333", "#1A1A1A", "#222222", contrastColor);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
function displayConnections(connections, destination) {
    const filteredConnections = connections.filter(connection => connection.passList && connection.passList.some((stop) => stop.station.name === destination));
    [departure1, departure2, departure3].forEach(button => {
        if (button) {
            button.innerHTML = `<span style="font-size:30px">--:--</span>`;
        }
    });
    if (filteredConnections.length === 0) {
        console.log(`No connections found to ${destination}.`);
        return;
    }
    filteredConnections.slice(0, 3).forEach((connection, index) => {
        const departureTime = new Date(connection.stop.departure).toLocaleTimeString("de-CH", { hour: '2-digit', minute: '2-digit' });
        const departureButton = document.querySelector(`.departure${index + 1}`);
        if (departureButton) {
            departureButton.innerHTML = `<span style="font-size:30px">${departureTime}</span>`;
        }
    });
}
function switchDestination() {
    const newStation = getCurrentStationName();
    const newDestination = getCurrentDestination();
    fetch(`https://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(newStation)}&limit=10`)
        .then(response => response.json())
        .then(data => {
        displayConnections(data.stationboard, newDestination);
    })
        .catch(error => {
        console.error("Error:", error);
    });
}
function setColors(color1, color2, color3, contrastColor) {
    currentColors = [color1, color2, color3];
    hoverColor = "#ffffff";
    otherHoverColor = "#ffffff";
    normalColor = color3;
    card.style.backgroundColor = color2;
    button1.style.backgroundColor = transparentColor;
    button2.style.backgroundColor = transparentColor;
    button3.style.backgroundColor = transparentColor;
    // buttonSelect.style.backgroundColor = transparentColor;
    document.body.style.background = "#333333";
    cardFooter.style.backgroundColor = color3;
    cardHeader.style.backgroundColor = color3;
    bigTitleContainer.style.color = contrastColor;
    buttonReload.style.color = contrastColor;
    button1.style.color = contrastColor;
    button2.style.color = contrastColor;
    button3.style.color = contrastColor;
    // buttonSelect.style.color = contrastColor;
    departure1.style.color = contrastColor;
    departure2.style.color = contrastColor;
    departure3.style.color = contrastColor;
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
    let inputDebounceTimer;
    stationSelect.addEventListener('input', () => {
        clearTimeout(inputDebounceTimer);
        inputDebounceTimer = setTimeout(() => {
            switchDestination();
        }, 500);
    });
    destinationSelect.addEventListener('input', () => {
        clearTimeout(inputDebounceTimer);
        inputDebounceTimer = setTimeout(() => {
            switchDestination();
        }, 500);
    });
}
let debounceTimer;
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
        setTimeout(() => loadingScreen.remove(), 100);
    }
    loadEventListeners();
});
