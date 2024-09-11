"use client"

import { useState, useEffect, useContext , useRef} from 'react';
import Link from 'next/link';
import {ScrollShadow} from "@nextui-org/react";
import  './chat_assets/style.css'; 
import FAvatar from '../components/friendsAvatar/fAvatar'
import InputEmoji from "react-input-emoji";
import { IoSend } from "react-icons/io5";
import {Context} from '../contexts/UserContext';  
import {UserContext} from '../contexts/UserContext';
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
var my_Token ;
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const ws_url = process.env.NEXT_PUBLIC_WS_URL;
const formatTime = (timestamp) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(timestamp).toLocaleTimeString('en-US', options);
  };

  const getImageUrl = (imagePath) => {
    if (imagePath && imagePath != 'lol') {
      if (imagePath.startsWith('/media/media/')) {
        imagePath = imagePath.substring(6);
    }
      return `${API_ADDRESS}/${imagePath}`;
    } else if (imagePath == 'lol') {
      return 'http://i.pinimg.com/736x/6e/37/4f/6e374fd5eb3d81dc0e50643d2710a906.jpg';
    }
    else {
      return 'http://cdn-icons-png.flaticon.com/512/5220/5220262.png';
    }
  };

// TimeAgo.addDefaultLocale(en)
// TimeAgo.addLocale(ru)
  
function App() {
  
  return (
      <Context>
        <Globalchat/>
      </Context>
  );
}


App()
var  conversation;
export default function Globalchat()
{   

    const { userInfo } = useContext(UserContext);
          my_Token = userInfo?.username;
          const [messages, setMessages] = useState([]);
          useEffect(() => {
            const ws = new WebSocket(`${ws_url}/global_chat/`);

            ws.onopen = () => {
              ws.send(JSON.stringify({ my_username: userInfo?.username, Channel: "lol" }));
            };

            ws.onmessage = (event) => {
              const data = JSON.parse(event.data);
              setMessages(data);
            };

            return () => {
              ws.close();
            };
          }, []);
        

          return (
            <div className="shadow-3xl flex flex-col justify-between h-[100%] w-[100%]">
              <Title />
              <div className="flex-1 overflow-hidden h-[100%] w-[100%]">
                <Conversation messages={messages} myToken={userInfo?.username} />
              </div>
              <div className="flex justify-center">
                <Bottom_input/>
              </div>
            </div>
          );
        }

function Title()
{
    return(
        <div  className="flex justify-center ">
            <Link  href="" className="font-bold  text-[#ffffff] text-2xl md:text-lg lg:text-xl xl:text-xl">
                    GLOBAL
                <span className=" text-[#66FCF1] text-2xl sm:text-sm md:text-md  lg:text-xl xl:text-xl ml-3">CHAT</span>
            </Link>
        </div>
    )
}



function Conversation({messages,myToken})
{
          return (
            <div className='flex justify-center h-full'>
              <ul className="pl-2 w-full">
                <ScrollShadow hideScrollBar size={30} id="scroll" className='h-full w-full overflow-auto'>
                  {messages.map((message) => (
                    <MessageItem key={message.id} message={message} myToken={my_Token} />
                  ))}
                </ScrollShadow>
              </ul>
            </div>
          );
  }


function MessageItem({ message, myToken }) {
    if(message?.sender?.username === myToken)
     return   (<R_message message={message} />)     
        
   else
     return<L_message message={message} /> 
 }
 
 
  

 function L_message({ message }) {

   return (
<li className="flex  justify-start pb-1">
<div className=" flex  items-start">
<FAvatar
              id={message.sender.userID}
              name={message?.sender?.username}
              image={getImageUrl(message.sender.profile_image)}
              width={50}
              height={50}
              status={message.sender.status}
              userr={message.sender}
            />
  </div>


 <div className=" flex flex-col max-w-[70%]">

  <div className=" flex justify-start  mt-2 ml-1">
    <p className="break-words  text-[#ffffff] pb-1 text-[12px]">{message?.sender?.username}</p>
  </div>


   <div className={`bg-[#272727]  flex  flex-col 
     rounded-r-lg rounded-bl-lg min-w-14  max-w-[100%] ml-2`}>
     <p className=" text-white text-justify break-all max-w-[97%] p-1">{message.content}</p>

       <ReactTimeAgo id="time" className='text-xs  text-[#777777d1] self-start mt-1 ml-1' date={message.timestamp} locale="en-US" timeStyle="twitter-first-minute"/>

   </div>

 </div>
 </li>
   );
 }
 
 
 
function R_message({message})
 {

  return(
 <li className="flex  justify-end pb-1 ">    
 <div className=" flex flex-col justify-end max-w-[70%]">

  <div className=" flex justify-end  mt-2 mr-1 ">
    <p className=" text-[#ffffff] pb-1 text-[12px]">{message?.sender?.username}</p>
  </div>
   <div className={`bg-[#3B7F7A]  flex  flex-col self-end 
   rounded-l-lg rounded-br-lg  min-w-14  max-w-[100%] mr-2`}>

     <p className="break-all text-[#050606]  text-justify ml-2 max-w-[97%] p-1">{message.content}</p>
     {message.timestamp && (                                          
        <ReactTimeAgo id="time" className='text-xs  text-[#d8d8d8d1] self-end mt-1 mr-1' date={message.timestamp} locale="en-US" timeStyle="twitter-first-minute"/>
     )}
   </div>




 </div>
   <div className=" flex justify-end items-start">
   <FAvatar
              id={message.sender.userID}
              name={message?.sender?.username}
              image={getImageUrl(message.sender.profile_image)}
              width={50}
              height={50}
              status={message.sender.status}
              userr={message.sender}
            />
   </div>
 </li>
     )
 }

 function Bottom_input()
 {
    const [text, setText] = useState(""); 
    const [ws_for_globalchat, setws_for_globalchat] = useState(""); 

    const ws = useRef(null);

    useEffect(() => {
      ws.current = new WebSocket(`${ws_url}/global_chat/`);
  
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }, [ws_url]); 
  
    const send_message = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const trimmedText = text.trim();
        if (trimmedText !== "") {
          ws.current.send(JSON.stringify({ my_username: my_Token, Content: text }));
          setText(''); 
        }
      }
    };
  

    
    return(
        <div className='flex flex-row items-center justify-center  w-[96%] rounded-b-lg '>
            <div className=" flex justify-center items-center max-h-[10%] w-[100%]">
                <InputEmoji 
                value={text} 
                onChange={setText}
                onEnter={send_message}
                cleanOnEnter 
                background="#3C3C3C"
                borderColor	="#282828"
                color="#f5f3f3"
                placeholder="Type your  message  here"
                />
            </div>

            <div className='flex justify-center  items-center'>
            <div className='flex justify-center  items-center'>
            <IoSend className='fill-[#66FCF1] min-h-7 min-w-7 h-7 w-7  mr-2 self-center hover:cursor-pointer hover:scale-110' id='imoji' onClick={send_message}/>
            </div>
            </div>
        </div>
    )
}