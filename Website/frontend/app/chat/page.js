"use client"

import React, { useState, useEffect,useContext, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import filee from './chat_assets/file.png';
import { ScrollShadow } from "@nextui-org/react";
import './chat_assets/style.css';
import chat_icon from './chat_assets/chat.png'
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import FAvatar from '../components/friendsAvatar/fAvatar'
import Fmodal from '../components/freindModal/fmodal'
import InputEmoji from "react-input-emoji";
import { Context } from '../contexts/UserContext';
import { UserContext } from '../contexts/UserContext';
import { VscReactions } from "react-icons/vsc";
import Picker from 'emoji-picker-react';
import { Emoji } from 'emoji-picker-react';
import axios from 'axios';
import { BiCheckDouble } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";
import { getImageUrl } from "./components/Chat.jsx"
import { formatTime } from "./components/Chat.jsx"
import { TiDeleteOutline } from "react-icons/ti";
import Lottie from 'lottie-react';
import chat_wait from './chat_assets/pOj2GAHP8p.json'
import { useRouter } from 'next/navigation';
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
import TimeAgo from 'javascript-time-ago'

function App() {
  TimeAgo.addDefaultLocale(en)
  TimeAgo.addLocale(ru)
  return (
    <Context>
      <Mainchat />
      <FAvatar />
      <Fmodal />
    </Context>
  );
}

App()



var my_Token;
const ws_url = process.env.NEXT_PUBLIC_WS_URL;
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

const LottieAnimation = () => {
  return <Lottie animationData={chat_wait} loop={true} />;
};


let newSocket = null
let prv_message_ws = null

export default function Mainchat() {

  const { userInfo } = useContext(UserContext);
  useEffect(() => {

    prv_message_ws = new WebSocket(`${ws_url}/private_update/`);
    newSocket = new WebSocket(`${ws_url}/UserI/`);
    prv_message_ws = new WebSocket(`${ws_url}/private_update/`);
    newSocket = new WebSocket(`${ws_url}/UserI/`);
    my_Token = userInfo.id;

    newSocket.onopen = () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN)
        newSocket.send(JSON.stringify({ my_username: userInfo.username }));
    };

    newSocket.onerror = (error) => {
    };

    newSocket.onclose = () => {
    };

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);




  const [sideusers, setsideusers] = useState("col-span-3")



  return (
    <div className="  grid grid-cols-3 mx-auto gap-2  h-[100%] w-[100%]">

      <Users />
      <div className={`${sideusers} xr:col-span-2`}>
        <Chat />
      </div>

    </div>

  );
}



//tl3et ws lfo9 hit cola mra ktbdl chihaja flcomponent kamla hadchi kykhli next t3yt trndre combenet kamla ml lwl whadchi ky dir connection bzaaf




var hid
function Users() {
  const [usersData, setUserData] = useState([]);
  const { current_user, set_current_user } = useContext(UserContext);
  const [clickedId, setclickedId] = useState(" ");
  if (newSocket)
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const userExists = data.some(user => user.user);
      if (userExists) {
        setUserData(data);
      }
    };


  useEffect(() => {
    usersData.map((user) => {
      if (current_user && current_user.user && user?.user?.userID === current_user?.user?.userID) {
        if (JSON.stringify(user) !== JSON.stringify(current_user)) {
            set_current_user(user);
            
        }
      }
    })
  }, [usersData]);




  if (current_user && current_user?.user?.username === "lol")
    hid = "block"
  else
    hid = "hidden"

  useEffect(() => {
    setclickedId(current_user?.user?.userID)
  }, [current_user]);


  return (
    <div className={`${hid} p-2 col-span-3 xr:block  xr:col-span-1  w-[100%] h-[100%] bg-profile-bg `}>

      <div className="flex flex-col h-full relative ">
        <div className="w-full h-[80px] items-center flex bg-black justify-center">
          <Link href="" className="font-bold  text-[#66FCF1] text-2xl  md:text-lg lg:text-xl xl:text-xl">
            AQUA
            <span className=" text-[#fcfcfc] text-2xl  md:text-lg lg:text-xl xl:text-xl "> CHAT</span>
          </Link>
        </div>
        <div className="w-[100%] h-[100%] items-center flex justify-center relative  ">
          <ScrollShadow size={10} id="scrol" className='h-full w-full '>
            {usersData.map((user) => {
              if (user?.user?.userID)
                return (

                  <div key={user.id} className="flex flex-row bg-aqua-pong bg-opacity-40 p-2 rounded-lg w-full text-black mt-2  hover:bg-aqua-pong hover:cursor-pointer hover:text-black" onClick={() => (set_current_user(user))}>
                    <FAvatar
                      id={user.user.userID}
                      name={user.user.username}
                      image={getImageUrl(user.user.profile_image)}
                      width={50}
                      height={50}
                      status={user.user.status}
                      userr={user.user}
                    />

                    <div className=" flex flex-col w-[100%] self-center">
                      <Link href=" " className=" font-semibold text-blue-gray-900 grow   mbreak-words truncate ml-1">{user.user.username}</Link>
                      {(user.typing && (user?.friends?.status || !user?.friends)) && <span id="typed-out" className=' ml-1'><span className=' ml-1'>typing</span>....</span>}

                    </div>
                    <div className=" flex flex-col">
                    <ReactTimeAgo className='text-xs mr-1 ' date={user.interaction_time} locale="en-US" timeStyle="twitter-minute-now"/>
                      {current_user?.user?.userID != user.user.userID && user.unread_messages > 0 ? (
                        <h1 id="time" className="flex items-center justify-center text-[#2c2c2c] h-5 w-5 rounded-full bg-[#66FCF1] mt-1 ml-1">
                          {user.unread_messages}
                        </h1>
                      ) : null}
                    </div>

                    <hr className={clickedId === user.user.userID ? "  border-none bg-[#66FCF1] w-3 h-14" : "border-none bg-[#4f4d4d00] w-3 h-14"} />
                  </div>


                );
            })}
          </ScrollShadow>
        </div>
      </div>
    </div>
  );
}


function addFriend(userId, notificationUserID) {
  try {
   axios.post(`${API_ADDRESS}/notification/add_friend/${notificationUserID}`,
    {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
}


function send_prv_req(userId, notificationUserID)
 {
  try {
   axios.post(`${API_ADDRESS}/notification/invite_prv_game/${notificationUserID}`,
    {
      withCredentials: true,
    }
    );
  } catch (error) {
    console.error(error);
  }
  return(
    <Link ></Link>
  )
}


function blockFriend(userId, notificationUserID) {
  try {
    axios.post(`${API_ADDRESS}/notification/blocker_friend/${notificationUserID}`,
    {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
}


function unblockFriend(userId, notificationUserID) {
  try {
    axios.post(`${API_ADDRESS}/notification/deblocker_friend/${notificationUserID}`,
    {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
}


function Kebab() {
  const { userInfo, current_user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleBlockUnblock = useCallback(() => {
    if (current_user.friends && current_user.friends.status) {
      blockFriend(userInfo.id, current_user?.user?.userID);
    } else {
      unblockFriend(userInfo.id, current_user?.user?.userID);
    }
    setIsOpen(false);
  }, [current_user]);

  const handleAddFriend = useCallback(() => {
    addFriend(userInfo.id, current_user?.user?.userID);
    setIsOpen(false);
  }, [current_user]);

  if (current_user.friends && !current_user.friends.status && current_user.friends.blocked_by !== userInfo.id) {
    return null;
  }
  else if (current_user?.user?.userID === userInfo.id) {

    return (<p className="text-cyan-50 self-center  pr-2">you</p>)
  }

  return (
    <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button className="w-7 h-7 self-center relative">
          <BiDotsVerticalRounded className="text-cyan-50 text-2xl absolute z-10" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="">
        <div className="flex flex-col w-28">
          {current_user.friends ? (
            <>
            <Button
              className="text-xs mt-1 bg-[#66FCF1] rounded-lg"
              onClick={handleBlockUnblock}
            >
              <span id="kebab" className="text-[#000000] z-10">
                {current_user.friends.status ? 'block' : 'unblock'}
              </span>
            </Button>
            {
            
              current_user.friends.status && current_user.user.status === "online" && 
            <Button
            className="text-xs mt-3 bg-[#66FCF1] rounded-lg"
            onClick={()=>{send_prv_req(userInfo.id, current_user?.user?.userID),setIsOpen(false);}}
          >
            <span id="kebab" className="text-[#000000] z-10">play</span>
          </Button>
            }
          </>
          ) : (
            <>
            <Button
              className="text-xs mt-3 bg-[#66FCF1] rounded-lg"
              onClick={handleAddFriend}
            >
              <span id="kebab" className="text-[#000000] z-10">add</span>
            </Button>
            <>   
            {current_user.user.status === "online" && <Button
            className="text-xs mt-3 bg-[#66FCF1] rounded-lg"
            onClick={()=>{send_prv_req(userInfo.id, current_user?.user?.userID),setIsOpen(false);}}
              >
              <span id="kebab" className="text-[#000000] z-10">play</span>
              </Button>
            }
            </>
         
          </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}



function Chat(data) {
  const { current_user, set_current_user } = useContext(UserContext);
  const [wsReady, setWsReady] = useState(false);
  const conversationRef = useRef(null);

  useEffect(() => {
    conversationRef.current = new WebSocket(`${ws_url}/private_get/`);

    conversationRef.current.onopen = () => {
      setWsReady(true);
    };

    return () => {
      if (conversationRef.current) {
        conversationRef.current.close();
      }
    };
  }, []);

  var hid = current_user?.user?.username === "lol" ? "hidden" : "block";

  if (current_user?.user?.username === "lol") {
    return (
      <div className={`${hid} xr:flex justify-center items-center xr:col-span-2 h-full w-full bg-profile-bg`}>
        <div >
        <LottieAnimation />
          {/* <Image src={chat_icon} alt="icon" className="w-20 h-20" /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100%] bg-profile-bg p-2 w-full relative shadow-pf ">
      <Top_bar />
      <div className='flex flex-col w-full flex-grow relative'>
        {wsReady && <Conversation conversation={conversationRef.current} />}
      </div>
      <Bottom_input />
    </div>
  );
}

const getStatus = (status) => {
  if (status === "online")
    return (<span className="text-aqua-pong font-semibold box-shadow-md self-end ml-1  ">online</span>)
  else if (status === "offline")
    return (<span className="text-gray-500 box-shadow-md font-semibold flex self-end ml-1  after:content-['zzz'] after:animate-pulse
    after:text-xs after:text-aqua-pong ">offline</span>)
  else if (status === "ingame")
    return (<span className="text-aqua-pong font-semibold box-shadow-md animate-pulse self-end ml-1  ">inGame</span>)
}

function Top_bar() {
  const { current_user, set_current_user } = useContext(UserContext);

  return (
    <div className="flex w-full h-[75px] relative justify-between bg-aqua-pong bg-opacity-40 flex-wrap text-black p-2 rounded-t-lg">
      <div className="flex flex-row ">
        <button className="xr:hidden relative group " onClick={() => {
          setTimeout(() => {
            set_current_user({
              id: 0,
              user: {
                image: 'lol',
                username: "lol",
              },
              interaction_time: new Date().toISOString(),
            });
          }, 320);
        }}>
          <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[30px] h-[30px] transform transition-all bg-[#15151500] ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
            <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden group-focus:-translate-x-1.5 group-focus:rotate-180">
              <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:rotate-[42deg] group-focus:w-2/3 delay-150"></div>
              <div className="bg-white h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10"></div>
              <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:-rotate-[42deg] group-focus:w-2/3 delay-150"></div>
            </div>
          </div>
        </button>
      </div>
      <div className="flex flex-grow  justify-start items-center">
        <FAvatar
          id={current_user?.user?.userID}
          name={current_user?.user?.username}
          image={getImageUrl(current_user?.user?.profile_image)}
          width={50}
          height={50}
          status={current_user?.user?.status}
          userr={current_user?.user}
        />
        <span className='flex flex-col items-start  justify-center'>
          <Link href="" className=" font-semibold text-blue-gray-900	 self-center ml-1">{current_user?.user?.username}</Link>
          <span className='ml-1'>{getStatus(current_user?.user?.status)}</span>
        </span>
      </div>
      <div className="flex h-full  relative  justify-end" >
        <Kebab />
      </div>
    </div>
  )
}



function Conversation({ conversation }) {
  const { userInfo } = useContext(UserContext);
  const { current_user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversation) return;

    const sendInitialData = () => {
      conversation.send(JSON.stringify({
        user_username: current_user?.user?.username,
        my_username: userInfo.username
      }));
    };

    if (conversation.readyState === WebSocket.OPEN) {
      sendInitialData();
    } else {
      conversation.addEventListener('open', sendInitialData);
    }

    conversation.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(data);
    };

    conversation.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    conversation.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      conversation.removeEventListener('open', sendInitialData);
    };
  }, [conversation, current_user, userInfo]);

  return (
    <div className="h-[100%] w-[100%] xr:h-[100%] xr:w-[100%] relative">
      <ul >
        <ScrollShadow hideScrollBar size={20} id="scroll" className="h-[100%] pt-2 w-[100%] overflow-auto absolute">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} myToken={my_Token} />
          ))}
        </ScrollShadow>
      </ul>
    </div>
  );
}


function MessageItem({ message, myToken }) {
  if (message.sender.userID === myToken)
    return <R_message message={message} />
  else
    return <L_message message={message} />
}



function L_message({ message }) {
  const [blur, setBlur] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [vu, setEvu] = useState("");
  const { current_user } = useContext(UserContext);
  const { userInfo } = useContext(UserContext);
  const toggleEmojis = () => { 
    if (current_user?.friends != null && current_user?.friends.status === false)
          {
            setShowEmojis(false);
            return
          }
    setShowEmojis(!showEmojis);
    setTimeout(() => {
      setShowEmojis(false);
    }, 20000);
  };
  function vu_message() {
    if (prv_message_ws && prv_message_ws.readyState === WebSocket.OPEN)
      prv_message_ws.send(JSON.stringify({ vu: "1", id: message.id, user_username: current_user?.user?.username, my_username: userInfo.username, Content: "", id: message.id }));
    setEvu(message.id)
  }
  if (vu != message.id)
    vu_message();

  const handleEmojiClick = (emoji) => {
    if (current_user?.friends != null && current_user?.friends.status === false)
      {
        setShowEmojis(false);
        return
      }
    if (prv_message_ws && prv_message_ws.readyState === WebSocket.OPEN)
      prv_message_ws.send(JSON.stringify({ vu: "1", Imoji: emoji.unified, id: message.id, user_username: current_user?.user?.username, my_username: userInfo.username, Content: "", id: message.id }));
    setShowEmojis(false);
  };


  function toggleBlur() {
    setBlur(blur === "blur-sm" ? "" : "blur-sm");
  }

  return (
    <li className="flex  flex-row items-center justify-start pb-1 pt-1" key={message.id}>
      <div className={` flex flex-col p-2 rounded-r-lg 
    rounded-bl-lg   max-w-[50%]`}>
<div className="bg-[#272727] flex flex-col text-white p-2 rounded-r-lg rounded-bl-lg justify-between overflow-hidden">
  {message.image && (
    <Image
      className={`${blur} rounded-r-lg shadow-lg shadow-[#3f4141] rounded-bl-lg cursor-pointer max-w-full h-auto`}
      src={getImageUrl(message.image)}
      alt="Image"
      onDoubleClick={toggleBlur}
    />
  )}
  <a className="break-all overflow-wrap-anywhere">
    <span className="inline-block overflow-hidden text-ellipsis">
      {message.content}
    </span>
  </a>
</div>
        <div className="flex justify-between"> 

        <a id="time" className="text-[#777777d1] self-start  text-xs mr-2">
            {formatTime(message.timestamp)}
        </a>
        <Emoji unified={message.imoji} size="15" />
        </div>
      </div>

      <div className="flex  text-white opacity-20 transition-opacity duration-300 hover:opacity-100 text-2xl">
        {!showEmojis && (
          <VscReactions
            className="    "
            onClick={toggleEmojis}
          />
        )}
        {showEmojis && (
          <div className=" flex flex-row rounded shadow-lg p-2 justify-between">
            <Picker Theme="dark" reactionsDefaultOpen={true} onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </li>

  );
}



function R_message({ message }) {
  const [blur, setBlur] = useState("");

  function toggleBlur() {
    setBlur(blur === "blur-sm" ? "" : "blur-sm");
  }

  return (
    <li className="flex justify-end pb-1 pt-1 " key={message.id}>
      <div className={`flex flex-col
  rounded-l-lg rounded-br-lg   max-w-[50%]`}>

<div className="bg-[#66FCF1] flex flex-col  p-2 rounded-l-lg rounded-br-lg h-auto w-auto overflow-hidden">
  {message.image && (
    <Image
      className={`${blur} rounded-l-lg rounded-br-lg cursor-pointer h-auto max-w-full`}
      src={getImageUrl(message.image)}
      alt="Image"
      onDoubleClick={toggleBlur}
    />
  )}
  <a className="text-[#050606] break-all overflow-wrap-anywhere">
    <span className="inline-block overflow-hidden text-ellipsis">
      {message.content}
    </span>
  </a>
</div>

<div className=" flex flex-row w-[100%]  ">
          <Emoji unified={message.imoji} size="15" />
        

          {message.timestamp && (
            <div className='flex flex-row    justify-end w-[100%]'>
             
              {  
          
                message.vu
                  ?
                  <BiCheckDouble className="text-[#589ef8d1] fill-[#0b6df7] ml-1" />
                  :
                  <BiCheck className="text-[#918e8ed1]  ml-1" />
              }
              <a id="time" className="text-[#918e8ed1]   ml-1">
                {formatTime(message.timestamp)}
              </a>
            </div>

          )}
        </div>
        
      </div>
    </li>
  )
}


//kola message ykon 3ndo obj dyallo

let u_c_ws = new WebSocket(`${ws_url}/u_or_c/`);

function Bottom_input() {

  const { userInfo } = useContext(UserContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { current_user } = useContext(UserContext);
  const [user, setuser] = useState("");
  const [key, setKey] = useState(0);

   
  function setdata_update_users(t) {
    if (current_user.friends != null && current_user.friends.status === false)
      return (<div></div>)
    if (current_user?.user?.username != "lol") {
      if (t === 0 && u_c_ws.readyState === WebSocket.OPEN)
        u_c_ws.send(JSON.stringify({ user_username: current_user?.user?.username, my_username: userInfo.username }));
      else if (current_user?.user?.username != "lol" && t != 0 && u_c_ws.readyState === WebSocket.OPEN)
        u_c_ws.send(JSON.stringify({ user_username: current_user?.user?.username, my_username: userInfo.username, Unread_messages: "unread_messages", typing: text.length }));
    }
  };


  const handleFileChange = (ee) => {
    const selectedFile = ee.target.files[0];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];
    if (selectedFile && !validImageTypes.includes(selectedFile.type)) {

      alert('Please upload a valid image file.');
      return;
    }
    if (selectedFile.size > 2048576) {
      alert("File is too big! Please select a file smaller than 2MB.");
      ee.target.value = ""; 
    } else {
      setFile(selectedFile);
      ee.target.value = '';
      setKey(key+1)
    }
  };

  if (current_user?.user?.username != user) {
    setFile("")
    setText("")
    setuser(current_user?.user?.username)
  }

  setdata_update_users(1);

  function send_message() {


    if (current_user.friends != null && current_user.friends.status === false)
      return (<div></div>)

    const trimmedText = text.trim();
    if (!file && trimmedText !== "") {
      setdata_update_users(0);
      if (prv_message_ws && prv_message_ws.readyState === WebSocket.OPEN)
        prv_message_ws.send(JSON.stringify({ user_username: current_user?.user?.username, my_username: userInfo.username, Content: text }));
    } else if (file) {
      setdata_update_users(0);
      if (prv_message_ws && prv_message_ws.readyState === WebSocket.OPEN) {
        prv_message_ws.send(JSON.stringify({ user_username: current_user?.user?.username, my_username: userInfo.username, Content: text, File: "File" }));
        prv_message_ws.send(file);
      }
      setFile("");
    }

    setText("")

  }



  return (
    <div className="flex flex-col  w-full  relative  h-auto  ">
      <div className="flex items-center justify-center ">
        {current_user.friends && current_user.friends.status === false && (current_user.friends.blocked_by === userInfo.id ?
          (<p className='text-[#989898] text-center'>You blocked this user</p>) :
          (<p className='text-[#989898] text-center'>this user blocked you</p>))}
      </div>

      <div className="flex justify-center  items-center bg-[#282828] rounded-b-lg  ">
        <div className="flex justify-center  items-center relative">
        
          <label htmlFor="fileInput" className="flex flex-row w-full h-full relative">
            {file ? (     
                        <img src={URL.createObjectURL(file)} alt="Selected File" className="shadow-xl rounded shadow-[#282828]  self-center w-10 h-10 min-w-10 min-h-10 justify-self-center  ml-3 " />
            ) : (
              <Image src={filee} htmlFor="fileInput" alt="rixdd" className="hover:scale-110 hover:cursor-pointer w-7 h-7 min-w-7 min-h-7 self-center  ml-3 " />
            )}
          </label>
            {file && <TiDeleteOutline 
              className='absolute z-40 w-7 text-aqua-pong h-7 opacity-0 hover:opacity-100 right-[0.40rem] bottom-[0.30rem] rounded-full hover:cursor-pointer'
              onClick={() => {setFile(null)}}
            />}
          
          <input
            id="fileInput"
            type="file"
            key={key}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className=" grow flex justify-center items-center  max-w-[90%]">
          <InputEmoji
            onClick={(e) => {
              e.stopPropagation();
            }}
            value={text}
            onChange={setText}
            onEnter={send_message}
            cleanOnEnter
            background="#3C3C3C"
            borderColor="#282828"
            color="#f5f3f3"
            placeholder={`Message @${current_user.user.username}`}
          />
        </div>
        <div className='flex justify-center  items-center'>
          <IoSend className='fill-[#66FCF1]  h-7 w-7  mr-2 self-center hover:scale-110 hover:cursor-pointer' id='imoji' onClick={send_message} />
        </div>

      </div>
    </div>
  );

}