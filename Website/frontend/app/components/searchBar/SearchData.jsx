"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

export default function Table({ query }) {
  const [data, setData] = useState([]);
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

  const addFriend = async (username) => {
    const notificationUserID = data.find(item => item.username === username)?.id;
    if (!addFriendImages[username]) {
      // Sending friend request
      try {
        const response = await fetch(`${API_ADDRESS}/notification/add_friend/${notificationUserID}`, {
          method: 'POST',
          credentials: 'include',
        });
        const result = await response.json();
        if (result.success) {
          setAddFriendImages(prevState => ({
            ...prevState,
            [username]: 'requested',
          }));
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Removing friend
      try {
        const response = await fetch(`${API_ADDRESS}/notification/remove_friend/${notificationUserID}`, {
          method: 'POST',
          credentials: 'include',
        });
        const result = await response.json();
        if (result.success) {
          setAddFriendImages(prevState => ({
            ...prevState,
            [username]: 'removed',
          }));
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="text-white w-full">
      <div className="w-full">
        <div className="text-center">
          {data.map((item) => (
            <div key={item.username} className="flex bg-search-bg mb-3 p-2 pl-8 pr-8 text-xs bg-opacity-[0.19]">
              <div className="w-1/6 h-14 mr-5 border-[1px] border-solid border-white bg-search-bg-hover flex justify-center items-center rounded-br-xl rounded-tl-xl overflow-hidden">
                <img src={`${API_ADDRESS}/${item.image}`} alt={"profile"} width={50} height={50} />
              </div>
              <div className="w-4/6 text-left flex items-center">{item.username}</div>
              <div className="w-1/6 flex items-center justify-end">
                <Image
                  src={
                    addFriendImages[item.username] === true
                    
                      ? "/removefriend.svg"
                      : addFriendImages[item.username] === 'requested'
                      ? "/requestfriend.svg"
                      : "/addfriend.svg"
                  }
                  alt="friend action"
                  width={30}
                  height={30}
                  onClick={() => addFriend(item.username)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}