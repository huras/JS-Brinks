// import {Mesh, SpotLight, Scene, Color, PerspectiveCamera, BoxBufferGeometry, MeshBasicMaterial, WebGLRenderer} from './vendor/three/three';

let container;
let camera;
let renderer;
let scene;
let mesh;

function init() {
    container = document.querySelector('#scene-container');

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x8FBCD4);

    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(0, 0, 10);

    const geometry = new THREE.BoxBufferGeometry(2,2,2);
    const material = new THREE.MeshBasicMaterial();

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild(renderer.domElement);    
}
let x = 0, z = 0;
function animate() {
    requestAnimationFrame(animate);

    x+=0.01;
    z-=0.99;
    mesh.position.set(x, 0, z);
    renderer.render(scene, camera);
}

init();

animate();








// https://discoverthreejs.com/book/first-steps/first-scene/

