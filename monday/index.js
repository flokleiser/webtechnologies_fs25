let testElement = document.getElementById('testElement')
let otherTestElement = document.getElementById('otherTestElement')

let clicked = false


testElement.addEventListener('click', function() { 
    clicked = !clicked;
    if (clicked) {
        testElement.style.borderRadius= '25%'
        console.log('hovered');
    }
    else {
        testElement.style.borderRadius= '0%'
    }
},);


otherTestElement.addEventListener('hover', function() { 
    testElement.style.backgroundColor= 'red';
    console.log('hovered');
},);