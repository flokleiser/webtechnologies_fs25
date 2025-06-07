// let button = document.querySelector(".button");
let button = document.querySelector(".swap-button");
let currentDisplay = document.querySelector(".current-display");
let overlay = document.querySelector(".compare-image");
let html = document.querySelector("#html");

let overlayToggled = false;

if (!button) {
    throw new Error("button missing")
}


button.addEventListener("click", () => {
    if (!overlay || !button || !currentDisplay || !html) {
        throw new Error("overlay/button missing")
    }

    overlayToggled = !overlayToggled;
    if (overlayToggled) {
        button.classList.add("active");
        currentDisplay.classList.add("active");
        overlay.classList.add("active");
        html.classList.add("active");
        currentDisplay.innerHTML = "Current: Figma"
    } else {
        currentDisplay.classList.remove("active");
        button.classList.remove("active");
        overlay.classList.remove("active");
        html.classList.remove("active");
        currentDisplay.innerHTML = "Current: HTML"
    }
});
