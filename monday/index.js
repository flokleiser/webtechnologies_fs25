let testElement = document.getElementById('test-element');

if (!testElement) {
    console.log('no testelement')
}

testElement.addEventListener('click', function() { 
    testElement.style.backgroundColor = 'blue';
    console.log('test')
},);