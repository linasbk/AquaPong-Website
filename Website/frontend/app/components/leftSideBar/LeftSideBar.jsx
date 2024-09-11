"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./LeftSideBare.module.css";
import { getNavLinks } from "./navlinks"; 
import { RiLogoutCircleLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import LogoutPopup from "../logoutPopup/logoutPopup";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';


function LeftSideBar() {
  const {userInfo} = useContext(UserContext);
  const currentPath = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const navLinks = getNavLinks(userInfo.username);

  function isActive(route)
  {
    return route === currentPath ? styles.active : "";
  }

  return (
    <>
      <div className={styles.LeftSideBar}>
        <ul className={styles.nav}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} passHref>
                <link.icon className={`${isActive(link.href)} ${styles.icons}`} />
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.signout} >
          <button onClick={() => setShowPopup(true)}>
            <RiLogoutCircleLine />
          </button>
        </div>
      </div>
        {showPopup && (
          <LogoutPopup
            setShowPopup={setShowPopup}
            onClose={() => setShowPopup(false)}
          />
        )}
    </>
);
}

export default LeftSideBar;
