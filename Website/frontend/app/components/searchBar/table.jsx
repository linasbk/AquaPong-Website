"use client";
import { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import { UserContext } from "../../contexts/UserContext";
import styles from "./table.module.css";
import ReactDOM from 'react-dom';
import axios from "axios";
import Link from "next/link";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

async function addFriend(userId, notificationUserID) {
  try {
      await axios.post(`${API_ADDRESS}/notification/add_friend/${notificationUserID}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
      console.error("Add Friend Error:", error.response ? error.response.data : error.message);
  }
}

async function removefreind(userId, notificationUserID) {
  try {
      await axios.post(`${API_ADDRESS}/notification/remove_friend/${notificationUserID}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
      console.error("Block Friend Error:", error.response ? error.response.data : error.message);
  }
}


export default function Table({ query, onClose , setSearchTerm, updateSearchParams, search }) {
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const [addFriendImages, setAddFriendImages] = useState({});
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_ADDRESS}/Dashboard_home/search/${query}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        const jsonData = await response.json();
        if (jsonData && jsonData.search) {
          setData(jsonData.search);
          const friendImages = {};
          jsonData.search.forEach(item => {
            friendImages[item.username] = item.friends;
          });
          setAddFriendImages(friendImages);
        }
      } catch (error) {
        console.log("failed to fetch data");
      }
    };
    fetchData();
  }, [query, userId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        search.current && !search.current.contains(event.target) &&
        tableRef.current && !tableRef.current.contains(event.target)
      ) {
        setSearchTerm('');
        updateSearchParams('');
        onClose(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, setSearchTerm, updateSearchParams]);
  
  return ReactDOM.createPortal(
    <div className={styles.table} style={{ height: (data.length * 85) }} ref={tableRef}>
      {data.map((item) => (
        <div key={item.username} className="flex bg-[rgba(0,255,255,0.3)] justify-evenly items-center relative h-[80px] w-[100%]">
          <div className="flex justify-center w-[33%]">
            <div className="h-[50px] w-[50px] border-solid border-white bg-search-bg-hover flex justify-center items-center rounded-[50%] overflow-hidden">
              <Link href={`/profilePage/${item.username}`}>
                <Image src={`${API_ADDRESS}/${item.image}`} alt={"profile"} width={50} height={50}  />
              </Link>
            </div>
          </div>
          <span className="text-left flex justify-center w-[33%] text-white">{item.username}</span>
          <div className="flex items-center justify-center w-[33%] ">
            <Image
              className="cursor-pointer"
              src={
                item.friends === 1 ? "/removefriend.svg" :
                item.friends === 2 ? "/requestfriend.svg" :
                "/addfriend.svg"
              }
              alt="friend action"
              width={30}
              height={30}
              onClick={async () => {
                try {
                  if (item.friends === 1) {
                    await removefreind(userInfo.id, item.id);
                  } else if (item.friends === 0) {
                    await addFriend(userInfo.id, item.id);
                  } else {
                    await addFriend(userInfo.id, item.id);
                  }
                } catch (error) {
                  console.error("Error handling friend action:", error);
                }
                onClose(false);
              }}
            />
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
}

