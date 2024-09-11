"use client";
import { useEffect, useRef, useState, useContext } from "react";
import PlayerHeader from "../../components/game/playersHeader";
import { UserContext } from '../../contexts/UserContext';
import { webSocketContext, ThemeContext } from "../allContext";
import axios from 'axios';
import { GameParams } from "../playground/themes";


import MatchMaking from "../../components/matchmaking/matchmaking";
import DrawCanvas from '../../components/game/gameZone';
import { useRouter } from 'next/navigation';

const ws_url = process.env.NEXT_PUBLIC_WS_URL;
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
function set_user_status() {
  try {
    axios.post(`${API_ADDRESS}/notification/change_user_status`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
}
export default function PrivateGame() {
  const { userInfo, current_user } = useContext(UserContext);
  let websock = useRef(null);
  set_user_status();
  const [user, setUser] = useState(null)
  const [game, setGame] = useState(null)
  const [val, setVal] = useState(null)
  const [startGame, setStartGame] = useState(false);
  const [finished, setFinished] = useState({ "status": "running" ,"stage":""});
  const [gameTheme, setGameTheme] = useState(null);
  const router = useRouter();



  const sendMessage = () => {
    if (websock.current && websock.current.readyState === WebSocket.OPEN) {
      websock.current.send(JSON.stringify({
        'type': "private_game",
        "message": { 'hostplayer': userInfo, 'inviteplayer': current_user.user }
      }));
    } else {
      console.error(
        "WebSocket is not open. Ready state: ",
        websock.current?.readyState
      );
    }
  };
  useEffect(() => {
    // if (privateIDs !== null) {
    // *** WebSocket ***
    const socket = new WebSocket(`${ws_url}/privateGame/`);

    socket.onclose = () => {
      console.log("Private Game close");
    };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type == "connected" && userInfo && current_user)
          {
            sendMessage()
        }
        else if(data.type == "created_private_game"){
          const gameobj = data.message
          setUser(JSON.parse(gameobj.user))
          setGame(JSON.parse(gameobj.game))
          setVal(gameobj.val)
          setTimeout(() => {
            setStartGame(true);
          }, 1000);
        }
        
      };
      
      websock.current = socket;
      
      return () => socket.close();
    }, []);
    const ret = [val,game,user,setFinished,finished];
    useEffect(() => {
      GameParams().then(theme => {
        setGameTheme(theme);
      });
    },[])
  if (gameTheme && (val == null || game == null || user == null || startGame == false  && finished.status == "running")) {
    return (
      <>
        (<MatchMaking data={gameTheme} usersInfo={game} />);
      </>
    );
  }
  else if (gameTheme && game !== null && user !== null && finished.status == "running") {
  return (
      <>
        <ThemeContext.Provider value={gameTheme}>
          <webSocketContext.Provider value={ret}>
            <div className={`${gameTheme.background}`}></div>
            <div className="w-full h-full absolute flex flex-col ">
              <div className="w-full h-52 flex justify-center items-center">
                <PlayerHeader gameTheme={gameTheme} />
              </div>
              <div className="flex flex-grow items-center justify-center">
                <DrawCanvas />
              </div>
            </div>
          </webSocketContext.Provider>
        </ThemeContext.Provider>
      </>
    );
}
  else if (finished.status == "finished") {
    router.push('/gamePage')
  }
}
