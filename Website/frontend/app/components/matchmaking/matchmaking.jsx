"use client";
import ReactDOM from "react-dom";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Link from "next/link";
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

function MatchMaking({ data, usersInfo }) {

	const { userInfo } = useAuth();
	const [opponentImage, setOpponentImage] = useState(null);
	const [opponentName, setOpponentName] = useState("wee");
	const color =
		data.name === "Aqua"
			? "#5BC8C0"
			: data.name === "DarkAqua"
				? "#793AFF"
				: "#FFAE00";
	// const loadingAnimation = data.name === "Aqua" ? "Aqua" : "DarkAqua";
	let loadingAnimation = "https://lottie.host/abf82fa5-717f-4961-8450-6d84fc3a4327/vdTc0Ga3Jv.json";
	if (data.name === "DarkAqua") {
		loadingAnimation = "https://lottie.host/40493c03-8d70-47bf-9985-05161beb8f54/EaWOyAMZx3.json";
	}
	else if (data.name === "Aqua") {
		loadingAnimation = "https://lottie.host/3624e31d-18f8-4894-91e4-76dd27671345/rEJBUzNNhv.json";
	}
	const background = data.bgName;

	useEffect(() => {
		if (usersInfo) {
			if (usersInfo.first_player !== userInfo.username) {
				setOpponentImage(usersInfo.first_image);
				setOpponentName(usersInfo.first_player);
			} else if (usersInfo.second_player !== userInfo.username) {
				setOpponentImage(usersInfo.second_image);
				setOpponentName(usersInfo.second_player);
			}
		}
	}, [usersInfo, userInfo]);

	return ReactDOM.createPortal(
		<div className="fixed inset-0 flex justify-center flex-col items-center z-[1000]">
			<div
				className="relative"
				style={{
					backgroundImage: `url(${background})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "blur(10px)",
					WebkitFilter: "blur(10px)", // For Safari support
					zIndex: -1,
				}}
			/>
			<div
				className="flex h-[65%] w-[80%]"
				style={{
					background: `linear-gradient(rgba(135,60,255,1),rgba(135,60,255,0) 0%), linear-gradient(-70deg, ${color} 50%, #050505 0%)`,
				}}
			>
				<div className="w-1/2 flex flex-col gap-2 text-white justify-center items-center">
					<div
						className="flex flex-col items-center border-white border-4 lg:w-56 lg:h-56 md:w-48 md:h-48 w-28 h-28 rounded-full overflow-hidden"
						style={{
							border: `5px solid ${color}`,
							boxShadow: `0 0 10px ${color}`,
						}}
					>
						<Image
							src={`${API_ADDRESS}/${userInfo.image}`}
							className="w-full h-full object-cover"
							alt="avatar"
							width={200}
							height={200}
						/>
					</div>
					<div
						className="text-sm md:text-3xl lg:text-5xl"
						style={{
							color: color,
							textShadow: `0 0 10px ${color}`,
						}}
					>
						{userInfo.username}
					</div>
				</div>
				<div className="w-1/2 flex flex-col gap-2 justify-center items-center">
					{!opponentImage ? (
						<>
							<div
								className="flex flex-col items-center justify-center bg-black lg:w-56 lg:h-56 md:w-48 md:h-48 w-28 h-28 rounded-full overflow-hidden"
								style={{ border: `5px solid black`, boxShadow: `0 0 10px black` }}
							>
								<Player
									autoplay
									loop
									src={loadingAnimation}
									style={{ height: "50vh", width: "50vw" }}
								>
									<Controls
										visible={false}
										buttons={["play", "repeat", "frame", "debug"]}
									/>
								</Player>
							</div>
							<div
								className="text-sm md:text-3xl lg:text-5xl animate-pulse text-black drop-shadow-[5px_5px_5px_rgba(0,0,0,0.5)]"
							>
								{"Waiting..."}
							</div>
						</>

					) : (
						<>
							<div
								className="flex flex-col items-center border-white border-4 lg:w-56 lg:h-56 md:w-48 md:h-48 w-28 h-28 rounded-full overflow-hidden"
								style={{
									border: `5px solid black`,
									boxShadow: `0 0 10px black`,
								}}
							>
								<Image
									src={`${API_ADDRESS}/${opponentImage}`}
									className="w-full h-full object-cover"
									alt="avatar"
									width={200}
									height={200}
								/>
							</div>
							<div
								className="text-sm md:text-3xl lg:text-5xl"
								style={{
									color: "black",
									textShadow: `0 0 10px black`,
								}}
							>
								{opponentName}
							</div>
						</>
					)}
				</div>
				<div className="absolute inset-0  flex items-center justify-center pointer-events-none">
					<span className="text-2xl md:text-5xl space-x-1 lg:ml-5 xl:text-8xl font-bold md:space-x-2">
						<span className="relative">
							<span
								className="relative drop-shadow-[5px_5px_5px_rgba(255,255,255,0.3)]"
								style={{
									color: color,
								}}
							>
								V
							</span>
						</span>
						<span className="relative">
							<span
								className="relative text-[#000000] drop-shadow-[5px_5px_5px_rgba(0,0,0,0.5)]"
								style={{
									WebkitTextStroke: `1px ${color}`,
								}}
							>
								S
							</span>
						</span>
					</span>
				</div>
			</div>
			{!opponentImage && <Link href="/gamePage">
				<div
					className={`flex absolute right-[50%] translate-x-[50%] items-center justify-center w-40 h-12  hover:opacity-50 rounded-lg cursor-pointer mt-5`}
					style={{ background: color }}
				>
					<span className="text-lg font-bold">Cancel</span>
				</div>
			</Link>}
		</div>,
		document.body
	);
}

export default MatchMaking;
