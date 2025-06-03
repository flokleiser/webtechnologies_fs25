import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const camera = new THREE.OrthographicCamera()

scene.background = new THREE.Color( 0xffffff);
scene.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth/1.25, window.innerHeight/1.25 );
renderer.setSize( window.innerWidth/1.25, window.innerHeight/1.25 );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement);
controls.maxAzimuthAngle = Math.PI / 2; 
controls.enableZoom= false;

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x000000} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
controls.update();

function animate() {
	// cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
    controls.update();

	renderer.render( scene, camera );

}