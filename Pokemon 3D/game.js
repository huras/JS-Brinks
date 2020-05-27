function degreesToRadians(degrees){
    return degrees / 57.2958;
}
function radiansToDegrees(rads){
    return rads * 57.2958;
}

// Start engine
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 5000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// ================================================ buildWorld
const tileSize = 32;
var groundTiles;
let width = 5, height = 5;

var worldGeometry = new THREE.Geometry();
let lastIndex = 0;
let xOffset = 0 * tileSize * width / 2;
let zOffset = 0 * tileSize * height / 2;
for(let i = 0; i < height ; i++){
    for(let j = 0; j < width ; j++){
        const topLeft = new THREE.Vector3( -xOffset + -tileSize + j * tileSize, -zOffset + tileSize + i * tileSize ,0);
        const bottomLeft = new THREE.Vector3( -xOffset +-tileSize + j * tileSize, -zOffset + -tileSize + i * tileSize ,0);
        const bottomRight = new THREE.Vector3(  -xOffset + tileSize + j * tileSize, -zOffset + -tileSize + i * tileSize ,0);
        const topRight = new THREE.Vector3(  -xOffset + tileSize + j * tileSize, -zOffset + tileSize + i * tileSize ,0);

        const topLeft2 = new THREE.Vector2(  j / (width - 1), (i + 1) / (height - 1));
        const bottomLeft2 = new THREE.Vector2( j / (width - 1), i / (height - 1));
        const bottomRight2 = new THREE.Vector2( (j + 1) / (width - 1), i / (height - 1));
        const topRight2 = new THREE.Vector2( (j + 1) / (width - 1), (i + 1) / (height - 1));

        worldGeometry.vertices.push(
            topLeft,
            bottomLeft,
            bottomRight,
            topRight
        );

        // worldGeometry.faceVertexUvs[0].push([
        //     topLeft2, bottomLeft2, bottomRight2
        // ]);
        // worldGeometry.faceVertexUvs[0].push([
        //     topLeft2, topRight2, bottomRight2
        // ]);

        worldGeometry.faces.push( new THREE.Face3( lastIndex, lastIndex+1, lastIndex+2 ) );
        worldGeometry.faces.push( new THREE.Face3( lastIndex+3, lastIndex, lastIndex+2 ) );

        // worldGeometry.faceVertexUvs[0].push([
        //     topLeft2,
        //     bottomLeft2,
        //     bottomRight2,
        // ]);
        // worldGeometry.faceVertexUvs[0].push([
        //     topRight2,
        //     topLeft,
        //     bottomRight,
        // ]);
        
        lastIndex+=4;
    }
}
worldGeometry.faceVertexUvs[0].push([
    new THREE.Vector2(0, 1/46),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1/8, 0)
    ]);
worldGeometry.faceVertexUvs[0].push([
    new THREE.Vector2(1/8, 1/46),
    new THREE.Vector2(0, 1/46),
    new THREE.Vector2(1/8, 0)
  ]);
  
console.log(worldGeometry.faceVertexUvs[0]);

// worldGeometry.faceVertexUvs[0].push([
//     new THREE.Vector2(0, 0),
//     new THREE.Vector2(0, 0.1),
//     new THREE.Vector2(0.1, 0)
// ]);
// worldGeometry.faceVertexUvs[0].push([
//     new THREE.Vector2(0, 0.1),
//     new THREE.Vector2(0.1, 0.1),
//     new THREE.Vector2(0.1, 0)
// ]);

worldGeometry.uvsNeedUpdate = true;
worldGeometry.computeBoundingSphere();

function assignUVs(geometry) {

    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function(face) {

        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });

    geometry.uvsNeedUpdate = true;
}
// assignUVs(worldGeometry);

var texture2 = new THREE.TextureLoader().load('tileset-gsk.png');
// var geometry2 = new THREE.BoxBufferGeometry( 200, 200, 200 );
// var material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
// let mesh2 = new THREE.Mesh( geometry2, material2 );
// scene.add( mesh2 );

var material = new THREE.MeshBasicMaterial( { map: texture2, wireframe: false });
groundTiles = new THREE.Mesh( worldGeometry, material );
scene.add( groundTiles );
// groundTiles.rotation.x = degreesToRadians(-90);

// ================================================ Manage Input
let keyManager = new Keymanager();
console.log(keyManager);

let direactionToRotate = 0;
function readInput(){
    if(keyManager.isKeyPressed('up')){
        direactionToRotate = 1;
    } else if(keyManager.isKeyPressed('down')){
        direactionToRotate = -1;
    } else {
        direactionToRotate = 0;
    }
}
setInterval(() => {readInput();}, 12);

// ================================================ Play Scene
camera.position.x = 105;
camera.position.z = 205;
camera.position.y = 120;
var animate = function () {
    requestAnimationFrame( animate );

    // groundTiles.rotation.x += 0.01;
    // console.log(radiansToDegrees(groundTiles.rotation.y));
    groundTiles.rotation.x += 0.01 * direactionToRotate;
    
    // camera.position.z += 0.01;
    // camera.rotation.x += 0.015;

    renderer.render( scene, camera );
};
animate();

// =====================================================================

// set up the sphere vars
// var radius = 50, segments = 16, rings = 16;

// // create the sphere's material
// var sphereMaterial = new THREE.MeshLambertMaterial(
//     {
//       // a gorgeous red.
//       color: 0xCC0000
//     });
        

// // create a new mesh with sphere geometry -
// // we will cover the sphereMaterial next!
// var sphere = new THREE.Mesh(
//    new THREE.SphereGeometry(radius,
//    segments,
//    rings),

//    sphereMaterial);

// // add the sphere to the scene
// scene.add(sphere);

// create a point light
var pointLight = new THREE.PointLight( 0xFFFFFF );

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);