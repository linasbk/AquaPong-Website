
"use client";
import { useEffect, useRef } from "react";
import styles from "./logoutPopup.module.css";
import Button from "../button/button";
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../contexts/UserContext";

export default function LogoutPopup({ setShowPopup }) {
  const openModal = useRef(null);
  const router = useRouter();
  const { logout } = useAuth();

  async function deleteCookieAndRedirect() {
    await logout();
    router.push("/landingPage");
  }


  function onClose() {
    setShowPopup(false);
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (openModal.current && !openModal.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openModal, setShowPopup]);

  return ReactDOM.createPortal(
    <div className={styles.popUpContainer}>
      <div className={styles.LogoutPopUp} ref={openModal}>
        <h1>Are you sure you want to logout?</h1>
        <div className={styles.buttons}>
          <Button style='bg-red-500' value="Yes" onClick={deleteCookieAndRedirect}/>
          <Button onClick={onClose} value="No"/>
        </div>
      </div>
    </div>,
    document.body
  );
}