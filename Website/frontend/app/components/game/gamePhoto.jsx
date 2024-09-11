"use client";
import { ThemeContext } from "../../(playground)/allContext";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { styleText } from "util";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const getRank = (score, direction) => {
  if (score < 10) {
      return <Image src="/ranks/Iron.png" alt="rank1" width={200} height={200} />
  }
  if (score < 20) {
      return <Image src="/ranks/Bronze.png" alt="rank2" width={200} height={200}  />
  }
  if (score < 40) {
      return <Image src="/ranks/Silver.png" alt="rank3" width={200} height={200}  />
  }
  if (score < 80) {
      return <Image src="/ranks/Gold.png" alt="rank4" width={200} height={200} />
  }
  if (score <= 160) {
      return <Image src="/ranks/Platinum.png" alt="rank5" width={200} height={200} />
  }
  if (score > 160) {
      return <Image src="/ranks/Master.png" alt="rank6" width={200} height={200} />
  }
}

export default function GamePhoto({ src, name , direction, gameTheme, flip}) {
    const [userData, setUserData] = useState(null);
    const userName = name;
    useEffect(() => {
      const fetchData = async () => {
        try {
            const result = await axios(`${API_ADDRESS}/Dashboard_home/Statistic/${userName}`);
            setUserData(result.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
        fetchData();
    }, []);
    useEffect(() => {
  }, [userData]);

    return (
      <>
        {userData && (
        <div className={`relative w-[40%] h-full flex justify-center flex-wrap ${direction} items-center`}>
          <div className={`rounded-full`} 
              style={{border: `4px solid ${gameTheme.primaryColor}`}}>
            <Image
              src={src}
              alt={name}
              width={400}
              height={400}
              className={`rounded-full object-cover lg:h-[150px] h-[100px] lg:w-[150px] w-[100px] overflow-hidden  `}
              />
          </div>
          <div className="relative flex flex-col justify-evenly items-center ">
            <h3 className="text-white md:text-2xl text-sm h-[50%] ">{name}</h3>
            <div className={`flex  justify-evenly items-center h-[50%]  ${direction} ${flip}`}>
              {getRank(userData.list_backend.list_statistic.score,  direction)}
            </div>
          </div>
          </div>
        )}
      </>
    );
}
