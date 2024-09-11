"use client";

import Link from 'next/link';
import styles from './avatar.module.css';
import Image from 'next/image';
import { IoSettings } from "react-icons/io5";
import { useContext , useEffect, useState} from 'react';
import { UserContext } from '../../contexts/UserContext';
import { usePathname } from "next/navigation";
import PropTypes from 'prop-types';



let API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

function Avatar({ width, height, ...params})
{
  const { userInfo } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const currentPath = usePathname();
  
  async function fetchUser() {
    try {
      const response = await fetch(`${API_ADDRESS}/Dashboard_home/getimage`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetching userInfo failed:", error);
      return null;
    }
  }
  
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUser();
      setUserData(data);
    };
    
    loadData();
  }, [userInfo]);
  const isActive = (route) => route === currentPath ? styles.active : "display: none;";
  
  return (
    <div className={styles.avatar} {...params}>
        <div className={styles.imageName}>
            {userData && userData.image_url ? (
              <Image
              loading="eager" 
                src={`${API_ADDRESS}/${userData.image_url}`}
                alt="avatar"
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 33vw"
                fill
                />
              ) : (
                <Image
                loading="eager" 
                src="/profile2.png"
                alt="avatar"
                fill // New attribute
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 33vw"
            />
            )}
        </div>
      <Link href={`/settingsPage/`} passHref>
        <div className={`${styles.profileSetting} ${isActive('/settingsPage')}`}>
          <IoSettings />
        </div>
      </Link>
    </div>
  );
}

Avatar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,

};

export default Avatar;