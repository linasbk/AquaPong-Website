

import WinORLose from "../../components/WinOrLose/WinOrLose"

import {
    createBall,
    createPaddle,
    createLight,
    createTable,
    createNet,
    creatText,
  } from "./object.js";
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import * as CANNON from "cannon-es";
import { resolve } from "path";
  
  export function getUnit(camera) {
    const distance = camera.position.z; // assuming the camera is looking towards the origin
    const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical FOV to radians
    const height = 2 * Math.tan(vFOV / 2) * distance; // visible height
    const width = height * camera.aspect; // visible width based on the aspect ratio
    return { width, height };
  }
  

  
  export function Draw(canvas,primaryColor, secondColor,gamesock,user_id,setWinOrLose) {


    function debounce(func,wait){
      let Timedebounce;

      return function debounceFunc(){
        const later = (...args) => {
          clearTimeout(Timedebounce)
          func(...args)
        };
        clearTimeout(Timedebounce);
        Timedebounce = setTimeout(later,wait)
      }
    }
    function send(type, data) {
      return new Promise((resolve, reject) => {
          if (!gamesock.current) {
              reject('WebSocket is not initialized.');
          }
          else if (gamesock.current.readyState === WebSocket.OPEN) {
              gamesock.current.send(JSON.stringify({
                  'type': type,
                  'data': data
              }));
              resolve();
          } else {
              gamesock.current.addEventListener('open', () => {
                  gamesock.current.send(JSON.stringify({
                      'type': type,
                      'data': data
                  }));
                  resolve();
                gamesock.current.removeEventListener('open', () => {});
              });
              gamesock.current.addEventListener('error', (event) => {
                  reject('WebSocket error: ' + event);
              });
          }
      });
  }

    function recive() {
      if(gamesock.current && gamesock.current.readyState == WebSocket.OPEN){
        
          gamesock.current.onmessage = (event) =>{
            const data = JSON.parse(event.data);
            if(data.type == 'game_update'){
              const sball = data.message;
              ball.position.y = sball.y;
              ball.position.x = sball.x;
            }
            else if(data.type == 'player_move'){
              const paddle = data.message;
              if(paddle.x + paddleHeight/2 > - groundWidth/2 && paddle.x - paddleHeight/2 < groundWidth/2)
                  rpaddle.position.x = paddle.x;
            }
            else if (data.type == "game result"){
              setWinOrLose(data.message);
            }
            else if (data.type == 'resize'){
              const players = data.message
              if (players[0].id == user_id){
                if(players[0].x != NaN && players[1].x != NaN){
                      lpaddle.position.x = players[0].x;
                      rpaddle.position.x = players[1].x;
                }
              }
              else{
                if(players[0].x != NaN && players[1].x != NaN){
                  lpaddle.position.x = players[1].x;
                  rpaddle.position.x = players[0].x;
                }
              }
            }
            else if(data.type == 'recieve_game_start'){
              first_render();
          }
      }
    }
  }
    // *****************************CREAT_GAME_OBJECT
  
    // ** render
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.physicallyCorrectLights = true;
  
    // ** camera
    const fov = 75;
    const aspect = canvas.width / canvas.height; // the canvas default
    const near = 0.01;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.lookAt(0, 0, 0);
    camera.position.set(0,0,60);
  
    // ** gameSize
    let gameSize = getUnit(camera);
    new OrbitControls(camera, renderer.domElement);
  
    // ** scene
    const scene = new THREE.Scene();
  
    // ** light
    const light = createLight();
  
    // *** ball
    const ball = createBall(gameSize, 0xffffff);
  
    // ** Ground
    const ground = createTable(gameSize, primaryColor);
  
    // ** leftPaddle
    const lpaddle = createPaddle(
      gameSize,
      primaryColor,
      -(ground.geometry.parameters.height / 2)
    );
  
    // ** rightPaddle
    const rpaddle = createPaddle(
      gameSize,
      secondColor,
      ground.geometry.parameters.height / 2
    );
    const net = createNet(gameSize,'#ffffff');


    // ** Sizes
  
    let groundWidth = ground.geometry.parameters.width;
    let groundHeight = ground.geometry.parameters.height;
    let paddleHeight = lpaddle.geometry.parameters.height;
  
    // ** gameRender
    function renderGame() {
      scene.remove.apply(scene, scene.children);
      scene.add(light);
      scene.add(ground);
      scene.add(ball);
      scene.add(rpaddle);
      scene.add(lpaddle);
      scene.add(net);
    }
    renderGame();
    function first_render(){
      resizeLogic();
      try {
        send("set_dimension",{'width':groundWidth,'height':groundHeight,'ball_raduis':ball.geometry.parameters.radius});
      } catch (error) {
        console.log("error whe try to sent set_dimension")
      }
    }
    first_render();
    
    
    const resizeDebounce = debounce(() =>{
      window.removeEventListener("resize",resizeDebounce);
      window.removeEventListener("keydown",pressHandler);
      window.removeEventListener("keypress",releaseHandler);
      resizeLogic();
      try {
        send("resize",{'width':groundWidth,'height':groundHeight,'ball_raduis':ball.geometry.parameters.radius});
      } catch (error) {
        console.log("error when try to sent resize")
      }
    },50);

    function resizeLogic() {

      var width = canvas.width;
      var height = canvas.height;
      scene.remove.apply(scene, scene.children);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      gameSize = getUnit(camera);
      groundWidth = Math.floor(gameSize.width/3);
      groundHeight = Math.floor(gameSize.height/2);
      paddleHeight = lpaddle.geometry.parameters.height;
      renderGame();
    }

    
    // ** resize
    window.addEventListener("resize",resizeDebounce);
    
    
  
    // ***************************************************************GAMEPLAY****************** //
  
    // ** Keys Listeners
  
    let paddelSpeed = 0.5;
    let paddelDirX = 1;
    let leftPressed = false;
    let rightPressed = false;
    
    function pressHandler(e) {
      if (e.key === "ArrowLeft") {
          leftPressed = true;
          paddelDirX = -1;
      } else if (e.key === "ArrowRight") {
          rightPressed = true;
          paddelDirX = 1;
      }
  }
  
  function releaseHandler(e) {
      if (e.key === "ArrowLeft") {
          leftPressed = false;
          paddelDirX = rightPressed ? 1 : 0;
      } else if (e.key === "ArrowRight") {
          rightPressed = false;
          paddelDirX = leftPressed ? -1 : 0;
      }
  }
    window.addEventListener('keydown',pressHandler)
    window.addEventListener('keyup',releaseHandler)
  
    function PaddleMove() {
     if(rightPressed && (lpaddle.position.x + (paddleHeight/2)) < groundWidth/2)
      {
        lpaddle.position.x += paddelSpeed  * paddelDirX;
        try {
          send('paddle_move',{'x':lpaddle.position.x,'dire':paddelDirX})
        } catch (error) {
            console.log("error when try to send paddel_move")
        }
      }
      if(leftPressed && (lpaddle.position.x  - (paddleHeight/2)) > -(groundWidth/2))
        {
          lpaddle.position.x += paddelSpeed * paddelDirX;
          try {
            send('paddle_move',{'x':lpaddle.position.x,'dire':paddelDirX})
          } catch (error) {
              console.log("error when try to send paddel_move")
          }
      }
  const world = new CANNON.World({
    gravity : new CANNON.Vec3(0,0,-9.82),
  });
}


    // *** final Physics **//
  
    function render() {
      recive()
      PaddleMove();
      scene.rotation.x = -1;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }