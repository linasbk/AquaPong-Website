"use client";
import { Draw } from "./draw.jsx";
import { first_render } from "./draw.jsx";

import React, { useRef, useEffect, useContext, useState } from "react";
import {
  ThemeContext,
  webSocketContext,
} from "../../(playground)/allContext.js";
import  WinOrLose  from "../../components/WinOrLose/WinOrLose";
import { Cambay } from "next/font/google/index.js";

let WS_URL = process.env.NEXT_PUBLIC_WS_URL

const DrawCanvas = () => {
  const theme = useContext(ThemeContext);
  const [val, info, user,setFinished,finish] = useContext(webSocketContext);
  const gamesock = useRef(null);
  const canvasRef = useRef(null);
  const [winOrLose, setWinOrLose] = useState(null);


  useEffect(() => {
    let socket;
    let reconnectTimeoutId;

    const connect = () => {
      socket = new WebSocket(
        `${WS_URL}/gameLunch/${info.gameID}/`
      );
      socket.onopen = () => {
        if(user.id && info.gameID && user.username){
          socket.send(
            JSON.stringify({
              type: "game_initialization",
              data: { id: user.id, game: info.gameID, name: user.username },
            })
          );
      }
      };
      socket.onclose = () => {
        setTimeout(() => {
          setFinished({ "status": "finished" ,"stage":finish.stage});
        }, 1000);
      };

      socket.onerror = (e) => {
        console.log("error from gameLunch");
      };
      gamesock.current = socket;
    };

    connect();

    return () => {
      console.log("Closing WebSocket connection...");
      socket.close();
    };
  }, [info]);



  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const parent = canvas.parentElement;
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        canvas.width = parentWidth * 0.8;
        canvas.height = parentHeight * 0.8;
        if(gamesock.current){
          Draw(canvas, theme.primaryColor, theme.secondColor, gamesock, user.id,setWinOrLose);
        }
      }
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gamesock.current]);


  return (
    <>
    <canvas
      ref={canvasRef}
      className="block"
    />
    {winOrLose && <WinOrLose winOrLose={winOrLose}/>}
    </>
  );
};

export default DrawCanvas;
