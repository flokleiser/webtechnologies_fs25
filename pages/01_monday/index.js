// let testElement = document.getElementById('testElement')
// let otherTestElement = document.getElementById('otherTestElement')

// let clicked = false

// testElement.addEventListener('click', function() {
//     clicked = !clicked;
//     if (clicked) {
//         testElement.style.borderRadius= '25%'
//         console.log('hovered');
//     }
//     else {
//         testElement.style.borderRadius= '0%'
//     }
// },);

// otherTestElement.addEventListener('hover', function() {
//     testElement.style.backgroundColor= 'red';
//     console.log('hovered');
// },);

const card = document.querySelector(".card");
let bounds;

if (!card) {
    console.error("Card element not found");
    throw new Error("Card element not found");
}

function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
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
    bounds = card.getBoundingClientRect();
    document.addEventListener("mousemove", rotateToMouse);
});

card.addEventListener("mouseleave", () => {
    document.removeEventListener("mousemove", rotateToMouse);
    card.style.transform = "";
    card.style.background = "";
});
