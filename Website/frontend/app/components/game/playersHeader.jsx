"use client";
import GamePhoto from "./gamePhoto";
import { useState, useEffect, useContext } from "react";
import { webSocketContext } from "../../(playground)/allContext";
const ws_url = process.env.NEXT_PUBLIC_WS_URL;
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
export default function PlayerHeader({gameTheme}) {
  async function getUrl(path) {
    try {
      const url = `${API_ADDRESS}${path}`;
      const response = await fetch(url, { method: "HEAD" ,
        withCredentials: true,
      });
      if (response.ok) {
        return url;
      }
    } catch (error) {
      return null;
    }
  }

  const [val, game, user] = useContext(webSocketContext);
  const [localplayer, setLocalPlayer] = useState(null);
  const [guestPlayer, setGuestPlayer] = useState(null);
  const [second_score, setSecond] = useState(0);
  const [first_score, setFirst] = useState(0);
  const [localPhoto, setlocalPhoto] = useState(null);
  const [guestPhoto, setGuestPhoto] = useState(null);

  useEffect(() => {
    getUrl(game.first_image).then((url) =>
      setlocalPhoto(url || "/gameElement/left.png")
    );
    getUrl(game.second_image).then((url) =>
      setGuestPhoto(url || "/gameElement/right.png")
    );
    setLocalPlayer(game.first_player);
    setGuestPlayer(game.second_player);
    const socket = new WebSocket(`${ws_url}/GameScore/`);
    socket.onopen = () => {
      if (game) {
        socket.send(
          JSON.stringify({
            type: "game_score",
            data: game.gameID,
          })
        );
        console.log("connected");
      }
    };
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "game_score") {
        setFirst(data.message.fplayer_score);
        setSecond(data.message.scplayer_score);
      }
    };
    socket.onclose = () =>{
      console.log("closed socket");
    }
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
    {localPhoto && guestPhoto && localplayer && guestPlayer && (
      <div className="relative flex w-full h-full justify-evenly items-center">

          <GamePhoto
            src={localPhoto}
            name={localplayer}
            direction={"flex-row"}
            gameTheme={gameTheme}
            flip="scale-x-[-1]"
          />
        <div className="flex sm:flex-row flex-col flex-wrap items-center justify-evenly w-[20%] h-full">
          <span className="text-white sm:text-4xl text-base ">{first_score}</span>
          <span className="text-white sm:text-4xl text-base ">:</span>
          <span className="text-white sm:text-4xl text-base ">{second_score}</span>
        </div>
          <GamePhoto
            src={guestPhoto}
            name={guestPlayer}
            direction={"flex-row-reverse"}
            gameTheme={gameTheme}
            flip={""}
          />
      </div>
      )}
      </>
  );
}
