"use client";
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import filee from '../chat_assets/file.png';

import { ScrollShadow } from "@nextui-org/react";
import '../chat_assets/style.css';
import chat_icon from '../chat_assets/chat.png'
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import FAvatar from '../../components/friendsAvatar/fAvatar'
import Fmodal from '../../components/freindModal/fmodal'
import InputEmoji from "react-input-emoji";
import users from '../chat_assets/users.png'
import { Input } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import { Context } from '../../contexts/UserContext';
import { UserContext } from '../../contexts/UserContext';
import { VscReactions } from "react-icons/vsc";
import Picker from 'emoji-picker-react';
import { Emoji, EmojiStyle } from 'emoji-picker-react';
import axios from 'axios';
import { BiCheckDouble } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const API_ADDRESS_WS = process.env.NEXT_PUBLIC_WS_URL;

export const getImageUrl = (imagePath) => {
    if (imagePath && imagePath != 'lol') {
      if (imagePath.startsWith('/media/media/')) {
        imagePath = imagePath.substring(6);
      }
      return `${API_ADDRESS}${imagePath}`;
    } else if (imagePath == 'lol') {
      return 'https://i.pinimg.com/736x/6e/37/4f/6e374fd5eb3d81dc0e50643d2710a906.jpg';
    }
    else {
      return 'https://cdn-icons-png.flaticon.com/512/5220/5220262.png';
    }
  };

  export const formatTime = (timestamp) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(timestamp).toLocaleTimeString('en-US', options);
  };
