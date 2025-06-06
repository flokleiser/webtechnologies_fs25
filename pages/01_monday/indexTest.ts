const test_card = document.querySelector(".card") as HTMLElement;
let test_bounds: DOMRect;

function rotateToMouse(e: MouseEvent) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - test_bounds.x;
    const topY = mouseY - test_bounds.y;
    const center = {
        x: leftX - test_bounds.width / 2,
        y: topY - test_bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);


if (!test_card) {
    console.error("Card element not found");
    throw new Error("Card element not found");
}

    test_card.style.transform = `
    scale3d(1.03, 1.03, 1.03)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `;
}

test_card.addEventListener("mouseenter", () => {
    test_bounds = test_card.getBoundingClientRect();
    document.addEventListener("mousemove", rotateToMouse);
});

test_card.addEventListener("mouseleave", () => {
    document.removeEventListener("mousemove", rotateToMouse);
    test_card.style.transform = "";
    test_card.style.background = "";
});
