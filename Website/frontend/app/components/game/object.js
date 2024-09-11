import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
export function createPaddle(gameSize, color, position) {
  const paddleGeo = new THREE.CylinderGeometry(
    gameSize.width / 200,
    gameSize.width / 200,
    gameSize.width / 20,
    gameSize.width/2,
    gameSize.width/2,
  );
  const paddleMat = new THREE.MeshPhysicalMaterial({ color: color,
    metalness: 1,
    roughness: 0.7,
    reflectivity: 0.4
  });
  const paddle = new THREE.Mesh(paddleGeo, paddleMat);
  paddle.position.y = position;
  paddle.position.z = 3;
  paddle.rotation.z = -1.57;
  return paddle;
}

export function createBall(gameSize, color) {
  var ballMateria = new THREE.MeshPhysicalMaterial({ color: color,
   });
  
  var ballGeo = new THREE.SphereGeometry(
    gameSize.width / 200,
    gameSize.height /10,
    gameSize.height /10
  );
  
  var ball = new THREE.Mesh(ballGeo, ballMateria);
  ball.position.z = 3;
  return ball;
}


export function createLight(){

  const color = 0xffffff;
  const intensity = 5;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(10, 0, 100);
  return light
}


export function createTable(gameSize,color){
  var groundGeo = new THREE.BoxGeometry(
    Math.floor(gameSize.width)/3,
    Math.floor(gameSize.height)/2,
    0.2,
    100,
    100,
    100,
  );
  
  const groundMat = new THREE.MeshPhysicalMaterial({color: color,
    // metalness: 1,
    // roughness: 0.7,
    // reflectivity: 0.4,
    wireframe: true
  });
  groundMat.recieveShadow = true;
  const ground = new THREE.Mesh(groundGeo,groundMat);

  return ground
}



export function createNet(gameSize,color){

  const borders = new THREE.Group();
  var borederGeo = [
    new THREE.BoxGeometry(0.5,Math.floor(gameSize.width/3),0.5,10,10,10,),
    new THREE.BoxGeometry(0.5,Math.floor(gameSize.width/3),0.5,10,10,10,),
    new THREE.BoxGeometry(0.5,Math.floor(gameSize.width/3),0.5,10,10,10,),
    new THREE.BoxGeometry(Math.floor(gameSize.height/2)+0.5,0.5,0.5,10,10,10,),
    new THREE.BoxGeometry(Math.floor(gameSize.height/2)+0.5,0.5,0.5,10,10,10,)
  ];
  const netMat = new THREE.MeshPhysicalMaterial({color: color,
    metalness: 1,
    roughness: 0.7,
    reflectivity: 0.4
  })
  const position = [
    {x:0,y:0,z:0},
    {x:0,y:-(gameSize.height/4),z:0},
    {x:0,y:gameSize.height/4,z:0},
    {x:-(gameSize.width/6),y:0,z:0},
    {x:gameSize.width/6,y:0,z:0}
  ];
  const rotation = [
    1.57,
    1.57,
    1.57,
    1.57,
    1.57,
    1.57,
  ]
  
  borederGeo.forEach((geo,index) => {
    const border = new THREE.Mesh(geo,netMat);
    border.position.set(position[index].x,position[index].y,position[index].z);
    border.rotation.z = rotation[index];
    borders.add(border);
  });
  return borders
}

// ** Right Paddel

// const gltfLoader = new GLTFLoader();
// const url = "http://localhost:3000/gameElement/Paddel1.glb";
// gltfLoader.load(url, (gltf) => {
//   const rPaddel = gltf.scene;
//   scene.add(rPaddel);
//   rPaddel.position.set(0, 0, 0);
// });

// // ** leftPaddel

// const leftPadleLoader = new GLTFLoader();
// const lefturl = "http://localhost:3000/gameElement/Paddel1.glb";
// leftPadleLoader.load(lefturl, (gltf) => {
// const lPaddel = gltf.scene;
//   scene.add(lPaddel);
//   lPaddel.position.set(0, 0, 0);
// });

// // ** let table;

// const tableLoader = new GLTFLoader();
// const tableurl = "http://localhost:3000/gameElement/table.glb";
// gltfLoader.load(tableurl, (gltf) => {
//  const table = gltf.scene;
//   scene.add(table);
//   table.position.set(0, 0, 0);
// });
