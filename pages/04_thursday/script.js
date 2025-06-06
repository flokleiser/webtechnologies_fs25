let h1element = document.getElementById('console').innerHTML = 'Hello, world!';

if (!h1element) {
    throw new Error('Element with id "console" not found');
}


console.log('hello world')