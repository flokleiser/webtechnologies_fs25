let button = document.querySelector(".button");
let overlay = document.querySelector(".compare-image");

let overlayToggled = false;

if (!button) {
    throw new Error("button missing")
}


button.addEventListener("click", () => {
    if (!overlay || !button) {
        throw new Error("overlay/button missing")
    }

    overlayToggled = !overlayToggled;
    if (overlayToggled) {
        overlay.classList.add("active");
    } else {
        overlay.classList.remove("active");
    }
});
