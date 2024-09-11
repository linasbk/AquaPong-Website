"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import TournamentWaiting from "../../components/matchmaking/tournamentWaiting";
import { webSocketContext, ThemeContext } from "../allContext";
import PlayerHeader from "../../components/game/playersHeader";
import DrawCanvas from "../../components/game/gameZone";
import { GameParams } from "../playground/themes";
import axios from 'axios';
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

export default function Tournament() {
	set_user_status();

	let websock = useRef();
	const { userInfo } = useAuth();
	const [game, setGame] = useState();
	const [ready, setReady] = useState(false);
	const [val, setVal] = useState("");
	const [finish, setFinished] = useState({ "status": "running" ,"stage":""});
	const [gameTournament, setGameTournament] = useState(null);
	const [gameTheme, setGameTheme] = useState(null);
	const router = useRouter();

	const sendMessage = () => {
		if (websock.current && websock.current.readyState === WebSocket.OPEN) {
			websock.current.send(
				JSON.stringify({
					type: "join_or_create_tournament",
					data: {
						username:  userInfo.username,
						id: userInfo.id,
					},
				})
			);
		} else {
			console.error(
				"WebSocket is not open. Ready state: ",
				websock.current?.readyState
			);
		}
	};

	useEffect(() => {
		const socket = new WebSocket(`${ws_url}/MultiAqua/`);

		if (finish.status == "running" && finish.stage == "") {
			socket.onclose = () => {
				setReady(false);
				socket.close();
			};

			websock.current = socket;

			socket.onopen = () => {
				if (userInfo && userInfo.username && userInfo.id) {
					setReady(true);
					sendMessage();
				}
			};

			socket.onmessage = (e) => {
				const data = JSON.parse(e.data);

				if (data.type == "match_found" && userInfo) {
					setGame(data.game);
					setVal(data.type)
					setFinished({ "status": "running", "stage": "demi_final" });

				}
				else if (data.type == "final" && userInfo) {
						setGame(data.tour.final);
						setVal("match_found");
						setFinished({ "status": "running", "stage": "final" });
					}
					else if (data.type == 'eliminated') {
						socket.close();
						return router.push('/gamePage');
				}
				else if (data.type == "waiting_for_tour") {
						setGameTournament(data.tour);
				}
			}
		}	
		else if (finish.status == 'finished' && (finish.stage == 'final' || finish.stage == 'demi_final') ) {

			if (websock.current && websock.current.readyState === WebSocket.OPEN) {
			websock.current.send(
					JSON.stringify({
						type: "finished",
						data: { game: game.gameID, userID: userInfo.id },
					})
				);
			};
			if (finish.stage == 'final') {
				router.push('/gamePage');
			}
		}
	}, [finish.status]);

	const ret = [val, game, userInfo, setFinished,finish];
	useEffect(() => {
		GameParams().then(theme => {
			setGameTheme(theme);
		});
		return () => {
			self.close();
		}
	}, []);

	if (gameTheme &&  ready && val== "match_found" && game !== null && finish.status == "running") {
		return (
			<>
				<ThemeContext.Provider value={gameTheme}>
					<webSocketContext.Provider value={ret}>
						<div className={`${gameTheme.background}`}></div>
						<div className="w-full h-full absolute flex flex-col">
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
	} else if (gameTournament) {
		return <TournamentWaiting gameTournament={gameTournament} websock={websock} userInfo={userInfo} />;
	}
}

