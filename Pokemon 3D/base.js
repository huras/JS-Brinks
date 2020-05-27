var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 3000);

camera.position.z = 5;
var renderer = new THREE.WebGLRenderer();
// renderer.setSize(800,600);
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild( renderer.domElement );

window.addEventListener('resize', function(){
   var width = window.innerWidth; 
   var height = window.innerHeight; 
   renderer.setSize(width,height);
   camera.aspect = width/height;
   camera.updateProjectionMatrix();
});

let keyManager = new Keymanager();

// game loginc
let update = () => {

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