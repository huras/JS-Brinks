var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,800 / 600, 0.1, 1000);

camera.position.z = 3;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(800,600);
// renderer.setSize(window.innerWidth,window.innerHeight);

div1 = document.getElementById("placeholder1");
div1.appendChild(renderer.domElement);

window.addEventListener('resize', function(){
   var width = window.innerWidth; 
   var height = window.innerHeight; 
   renderer.setSize(width,height);
   camera.aspect = width/height;
   camera.updateProjectionMatrix();
});

let keyManager = new Keymanager();

import { OrbitControls } from './three.js-dev/examples/jsm/controls/OrbitControls.js';
var controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 20;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;


var geometry = new THREE.BoxGeometry(1,1,1);
var cubeMaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./wood2.jpg'), side: THREE.DoubleSide}), //right
    // new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./wood2.jpg'), side: THREE.DoubleSide}), //left
    // new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./wood2.jpg'), side: THREE.DoubleSide}), //top
    // new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./wood2.jpg'), side: THREE.DoubleSide}), //bottom
    // new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./wood2.jpg'), side: THREE.DoubleSide}), //front
    // new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./wood2.jpg'), side: THREE.DoubleSide}), //back
]

// var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
var material = new THREE.MeshFaceMaterial(cubeMaterials);
var cube = new THREE.Mesh( geometry, material);
scene.add(cube);

// game loginc
let update = function() {
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
}

// draw scene
var render = function () {
    renderer.render(scene, camera);
};

// run game loop (update, render, repeat)
var GameLoop = function(){
    requestAnimationFrame(GameLoop);
    
    update();
    render();
}

GameLoop();