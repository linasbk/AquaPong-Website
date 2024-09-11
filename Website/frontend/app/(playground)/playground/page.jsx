"use client";
import { useEffect, useRef, useState } from "react";
import PlayerHeader from "../../components/game/playersHeader";
import { webSocketContext, ThemeContext } from "../allContext";
import DrawCanvas from "../../components/game/gameZone";
import { GameParams } from "./themes";
import { useAuth } from "../../contexts/UserContext";
import axios from 'axios';
import MatchMaking from "../../components/matchmaking/matchmaking";
import { useRouter } from 'next/navigation';
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const ws_url = process.env.NEXT_PUBLIC_WS_URL;
function set_user_status(user_id) {
  try {
    axios.post(`${API_ADDRESS}/notification/change_user_status`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
    console.error(error);
  }
}

function PlayGround() {
  const { userInfo } = useAuth();
  set_user_status(userInfo.id)
  const [ready, setReady] = useState(false);
  const [val, setValue] = useState(null);
  const [game, setGame] = useState(null);
  const [finsihed,setFinished] = useState({ "status": "running" ,"stage":""});
  const [startGame, setStartGame] = useState(false);
  const [gameTheme, setGameTheme] = useState(null);
  const router = useRouter();

  let websock = useRef(null);

  const sendMessage = () => {
    if (websock.current && websock.current.readyState === WebSocket.OPEN) {
      websock.current.send(JSON.stringify(userInfo));
    } else {
      console.error(
        "WebSocket is not open. Ready state: ",
        websock.current?.readyState
      );
    }
  };

  useEffect(() => {
    if (userInfo !== null) {
      // *** WebSocket ***
      const socket = new WebSocket(`${ws_url}/matchmaking/`);

      socket.onopen = () => {
        setReady(true);
        setFinished({ "status": "running" ,"stage":""});
        sendMessage();
      };
      socket.onclose = () => {
        console.log("WebSocket closed from gameLuancher");
        setReady(false)
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setValue(data.type);
        if (data.type === 'match_found') {
          setGame(data.game);
          setTimeout(() => {
            setStartGame(true);
          }, 1000);
        }
      };

      websock.current = socket;

      return () => socket.close();
    }
  }, [userInfo]);
  useEffect(() => {
    GameParams().then(theme => {
      setGameTheme(theme);
    });
  }, [gameTheme]);

  // useEffect(() => {
  //   if (finsihed.status == 'finished') {
  //     router.push('/gamePage');
  //   }
  // }, [finsihed.status]);

  const ret = [val, game, userInfo,setFinished,finsihed];
  if (ready && startGame && val === 'match_found' && game !== null && finsihed.status) {
    return (
      <>
        <ThemeContext.Provider value={gameTheme}>
          <webSocketContext.Provider value={ret}>
            <div className={`${gameTheme.background}`}></div>
            <div className="w-full h-full absolute flex flex-col">
              <div className="w-full h-52 flex justify-evenly items-center flex-wrap overflow-hidden relative">
                <PlayerHeader gameTheme={gameTheme}/>
              </div>
              <div className="flex flex-grow items-center justify-center">
                 <DrawCanvas />
              </div>
            </div>
          </webSocketContext.Provider>
        </ThemeContext.Provider>
      </>
    );
  } else if (gameTheme !== null && finsihed.status == 'running') { 
    return (<MatchMaking data={gameTheme} usersInfo={game} />);
  }
}

export default PlayGround;