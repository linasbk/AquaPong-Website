"use client"

import { useState, useEffect, useContext, useRef, useCallback } from 'react';

import { ScrollShadow } from "@nextui-org/react";
import './chat_assets/style.css';
import FAvatar from '../components/friendsAvatar/fAvatar'
import InputEmoji from "react-input-emoji";
import { IoSend } from "react-icons/io5";
import { UserContext } from '../contexts/UserContext';
import { AiFillPlusCircle } from "react-icons/ai";


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
    return 'https://i.pinimg.com/736x/6e/37/4f/6e374fd5eb3d81dc0e50643d2710a906.jpg';
  }
  else {
    return 'https://cdn-icons-png.flaticon.com/512/5220/5220262.png';
  }
};

export default function Groupchat({Channel_name})
{
  const { userInfo } = useContext(UserContext);
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(`${ws_url}/channel_chat/`);

    ws.current.onopen = () => {
      setIsConnected(true);
      if (userInfo) {
        ws.current.send(JSON.stringify({ my_username: userInfo.username, Channel: Channel_name }));
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userInfo]);

  return (
    <div className="flex flex-col justify-between h-[100%] w-[100%]">
      {isConnected ? (
        <>
          <div className="flex-1 overflow-hidden h-[100%] w-[100%] pt-2">
            <Conversation conversation={ws.current} />
          </div>
          <div className="flex justify-center">
            <Bottom_input conversation={ws.current} Channel_name={Channel_name} />
          </div>
        </>
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
};



function Conversation({ conversation }) {
  const [messages, setmessages] = useState([]);
  const { userInfo } = useContext(UserContext);


  conversation.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setmessages(data);

  };

  return (
    <div className='flex justify-center h-full'>
      <ul className="pl-2 w-full">
        <ScrollShadow hideScrollBar size={30} id="scroll" className='h-full font-roboto  w-full overflow-scroll'>
          {messages.map((message, index) => (
            <MessageItem key={message.id} message={message} myToken={userInfo.id} isLast={index === messages.length - 1} />
          ))}
        </ScrollShadow>
      </ul>
    </div>
  );
}




function MessageItem({ message, myToken, isLast }) {
  if (message.sender.userID === myToken)
    return (<R_message message={message} isLast={isLast} />)
  else
    return (<L_message message={message} />)
}




function L_message({ message }) {

  return (
    <li className="flex  justify-start pb-1">
      <div className=" flex  items-start">
        <FAvatar
          id={message.sender.userID}
          name={message.sender.username}
          image={getImageUrl(message.sender.profile_image)}
          width={50}
          height={50}
          status={""}
          userr={message.sender}
        />
      </div>


      <div className=" flex flex-col ">

        <div className=" flex justify-start  mt-2 ml-1">
          <p className="break-words  text-[#ffffff] pb-1 text-[12px]">{message.sender.username}</p>
        </div>


        <div className={`bg-[#272727] break-words  p-1 text-xs flex items-center flex-col text-gray-300 justify-center
     rounded-r-lg rounded-bl-lg min-w-14 max-w-[30%] xr:max-w-[70%] ml-2`}>
          <p className="break-all  text-justify ml-2 ">{message.content}</p>
          <a id="time" className="text-white opacity-60 self-start mt-1 ml-1">
            {formatTime(message.timestamp)}
          </a>
        </div>


      </div>
    </li>
  );
}


function R_message({ message, isLast }) {


  return (
    <li className="flex  justify-end pb-1 ">
      <div className=" flex flex-col justify-end ">


        <div className={`bg-aqua-pong bg-opacity-60 p-1 text-xs break-words flex  flex-col self-end text-[#050606] 
                        rounded-l-lg rounded-br-lg  min-w-14 max-w-[30%] xr:max-w-[70%] mr-2`}>

          <p className="break-all  text-justify ml-2 ">{message.content}</p>
          {message.timestamp && (
            <a id="time" className="text-white opacity-60 self-end mt-1 mr-1">
              {formatTime(message.timestamp)}
            </a>
          )}
        </div>
        <div className=" flex flex-row-reverse justify-start pr-1 m-1">
          {
            message.viewed_by.map((user, index) => (
              index <= 2 ?
                <img key={user.userID} style={{ border: 'solid 1px rgba(0,255,255,0.5)' }}
                  className="w-4 h-4 object-cover rounded-full "
                  src={getImageUrl(user.profile_image)} alt="" />
                : index == 3 && <AiFillPlusCircle key={user.userID} className='  fill-[#66FCF1]' />
            ))}

        </div>

      </div>
    </li>
  )
}






function Bottom_input({ conversation, Channel_name }) {
  const [text, setText] = useState("");
  const { userInfo } = useContext(UserContext);



  const  send_message = useCallback(() => {

    const trimmedText = text.trim();
    if (trimmedText !== "")
      conversation.send(JSON.stringify({ my_username: userInfo.username, Content: text, Channel: Channel_name }));
    setText("")
  }, [text, userInfo, conversation, Channel_name]);


  return (
    <div className='flex flex-row items-center justify-center bg-white bg-opacity-20 w-full h-[60px] p-1 rounded-b-md '>

      <div className=" grow flex justify-center items-center w-14 h-14">
        <InputEmoji
          value={text}
          onChange={setText}
          onEnter={send_message}
          cleanOnEnter
          background="#3C3C3C"
          borderColor="#282828"
          color="#f5f3f3"
          placeholder="Type your  message  here"
        />
      </div>

      <div className='flex justify-center  items-center'>
        <IoSend className='fill-[#66FCF1] min-h-4 min-w-4 h-7 w-7  mr-2 self-center hover:scale-110 hover:cursor-pointer' id='imoji' onClick={send_message} />
      </div>
    </div>
  )
}
