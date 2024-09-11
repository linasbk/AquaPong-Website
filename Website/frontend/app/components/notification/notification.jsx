"use client";

import { useEffect, useState, useRef, useContext } from "react";
import "./notification.css";
import { useRouter } from "next/navigation";
import { IoMdNotifications } from "react-icons/io";
import { UserContext } from "../../contexts/UserContext";
import { FaUserFriends } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import ReactDOM from "react-dom";
import GameAlert from "../gameAlert/gameAlert";

const ws_url = process.env.NEXT_PUBLIC_WS_URL;
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const AcceptOrDecline = (friend, userID, a, type) => {
    const accept = `${API_ADDRESS}/notification/accpter_friend_invitaion/${userID}/${type}`;
    const decline = `${API_ADDRESS}/notification/refuse_friend/${userID}/${type}`;
        if (a) {
            fetch(accept, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: friend }),
            })
        }
        else if (!a) {
            fetch(decline, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: friend }),
            })
        }
}

function Row({ friend, id ,userID, type}) {
    const router = useRouter();

    return (
        <div className="row" key={id}>
            <div className="icon">
                {type === "add_friend" ? <FaUserFriends /> : <TiGroup />}
            </div>

            <div
                className="user hover:text-aqua-pong"
                onClick={() => router.push(`/profilePage/${friend}`)}
            >
                {friend}
            </div>
            <div className="status">
                <button onClick={() => AcceptOrDecline(friend, userID, true,type)} className='accept text-black bg-aqua-pong h-[50%] w-[100%] hover:scale-105'>Accept</button>
                <button onClick={() => AcceptOrDecline(friend, userID, false,type)} className='decline bg-[#696969] h-[50%] w-[100%] hover:scale-105'>Decline</button>
            </div>
        </div>
    );
}

const Notification = () => {
    const notif = useRef(null);
    const { userInfo, current_user, set_current_user } = useContext(UserContext);
    const userId = userInfo?.id;
    function Dialog() {
        return ReactDOM.createPortal(
            <div className="dialog" ref={notif}>
                {friendsRequests &&
                    friendsRequests.map((request, index) => {
                        if (!request.status) {
                            return (
                                <Row
                                    id={request.notificationUserID.userID}
                                    friend={request.userID.username}
                                    userID={request.userID.userID}
                                    type={request.message}
                                    key={index}
                                />
                            );
                        }
                        return null;
                    })}
            </div>,
            document.body
        );
    }

    const [friendsRequests, setFriendsRequests] = useState([]);
    const [dialogs, setDialog] = useState(false);
    const [notification, setNotification] = useState(0);
    const [GameRequest, setGameRequest] = useState([]);

    const handleRequests = (data, router) => {
        const accept_join_group = data.filter(
            (request) => request.message === "accept_join_group"
        );
        if (accept_join_group.length > 0) { 
            if (window.location.href.includes("clanPage")) {
                window.location.reload(); 
            }
        }
        const accep_game_req = data.find(
            (request) => request.message === "accept_game_req"
        );
        if (accep_game_req) {
            set_current_user({
                id: 0,
                user: accep_game_req.userID,
                friends: null,
                typing: false,
                interaction_time: new Date().toISOString(),
            });
            router.push("/privateGame/");
        }
        const playPrvGameRequest = data.filter(
            (request) => request.message === "play_prv_game"
        );
        const otherRequests = data.filter(
            (request) => request.message !== "play_prv_game" && request.message !== "accept_join_group"
        );
        if (playPrvGameRequest) {
            setGameRequest(playPrvGameRequest);
        }
        setFriendsRequests(otherRequests);
        setNotification(otherRequests.length);
    };
    const router = useRouter();
    useEffect(() => {
        const freindsRdata = new WebSocket(`${ws_url}/ws/notifications/`);
        freindsRdata.onopen = () => {
            freindsRdata.send(JSON.stringify({ userid: userId }));
        };
        freindsRdata.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleRequests(data,router);
        };
        freindsRdata.onerror = (error) => {
            console.error("error:", error);
        };
        return () => {
            freindsRdata.close();
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notif.current && !notif.current.contains(event.target)) {
                setDialog(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dialogs]);
    return (
        <div
            className={`nContainer ${notification !== 0 ? "nAnimation" : ""}`}
            onClick={() => {
                setDialog(!dialogs);
            }}
        >
            <div className="nIcon">
                {notification === 0 ? (
                    <IoMdNotifications />
                ) : (
                    <IoMdNotifications className="fill-[rgba(255,0,0,0.8)]" />
                )}
            </div>
            <div className="text-black text-xs">
                {notification === 0 ? "" : notification}
            </div>
            {dialogs && <Dialog />}
            <GameAlert
                setDialog={setDialog}
                GameRequestt={GameRequest}
                userInfo={userInfo}
                current_user={current_user}
                set_current_user={set_current_user}
                useRouter={useRouter}
            />
        </div>
    );
};

//√play_prv_game
export default Notification;
