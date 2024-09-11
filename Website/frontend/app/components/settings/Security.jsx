"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import TwoFactorAuth from "./TwoFactorAuth";
import DeleteAccount from "./DeleteAccount";
import { UserContext, useAuth } from "../../contexts/UserContext";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Security() {
  const { userInfo } = useContext(UserContext);
  const { setIsAuthenticated } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [message, setMessage] = useState({ error: "", success: "" });
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showPasswordPopUp = useRef(null);
  const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

  const handleOldPassword = async (event) => {
    event.preventDefault();
    const oldPassword = event.target.password.value;
    setShowPasswordPrompt(false);
    handleChangePassword(oldPassword);
  };

  const handlePasswordCheck = (event) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ error: "Password must be at least 8 characters long" });
      return;
    }
    setShowPasswordPrompt(true);
  };

  const handleChangePassword = async (oldPassword) => {
    if (newPassword.length < 8) {
      setMessage({ error: "Password must be at least 8 characters long" });
      return;
    }
    try {
      const response = await fetch(
        `${API_ADDRESS}/Sign_up/change-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, oldPassword }),
        }
      );
      if (response.ok) {
        setMessage({ success: "Password changed successfully" });
        setNewPassword("");
      } else {
        const errorData = await response.json();
        setMessage({ error: errorData.message || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ error: "An unexpected error occurred. Please try again." });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPasswordPrompt &&
        !showPasswordPopUp.current.contains(event.target)
      ) {
        setShowPasswordPrompt(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPasswordPrompt]);
  useEffect(() => {
    if (message.success) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [message.success]);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="w-full text-center text-xs sm:text-sm lg:text-lg font-bold text-white bg-black p-2 lg:p-4">
        Security
      </h1>
      <div className="w-full h-auto flex items-center justify-center gap-4 bg-black bg-opacity-20 p-2 pt-16 pl-5 pr-5 md:p-16 flex-grow">
        <div name="twoFactorAuth" className="flex gap-1 flex-col w-full">
          <div className="flex items-center flex-col">
            <h3 className="text-white text-sm font-bold">
              Two Factor Authentication
            </h3>
          </div>
          <TwoFactorAuth userInfo={userInfo} />
          <div className="w-full ">
            <div className="flex gap-5 md:gap-10 flex-col w-full mt-4 sm:mt-8">
              <div className="flex gap-2 flex-col w-full">
                {showPasswordPrompt && (
                  <div className="fixed inset-0 z-[1001] bg-black bg-opacity-50 flex flex-col g-2 items-center justify-center backdrop-blur-sm">
                    <form
                      onSubmit={handleOldPassword}
                      className="rounded-lg  p-4  flex flex-col gap-2 bg-opacity-50 w-[90%]  sm:w-[400px]"
                      ref={showPasswordPopUp}
                    >
                      <div className="relative flex flex-row w-full flex-wrap">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder="Old password"
                          className="rounded-tl-2xl text-gray-500 bg-gray-700 bg-opacity-35 h-10 p-2 focus:outline-none focus:outline-aqua-pong focus:outline w-full"
                        />
                        <FontAwesomeIcon
                          icon={isPasswordVisible ? faEye : faEyeSlash}
                          className="absolute top-[0.8em] right-8 xs:right-[1rem] cursor-pointer"
                          size="1s"
                          color="#666"
                          onClick={togglePasswordVisibility}
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[rgba(0,255,255,0.5)] text-white px-4 py-2 rounded-br-2xl hover:bg-[rgba(0,255,255,0.7)] hover:text-black"
                      >
                        Change
                      </button>
                    </form>
                  </div>
                )}
                <label
                  htmlFor="newPassword"
                  className="block text-white font-semibold text-xs sm:text-sm mt-2 sm:mt-5"
                >
                  Password
                </label>
                <div className="flex flex-col sm:flex-row sm:gap-2 sm:justify-between">
                  <div className="relative flex-grow bg-black bg-opacity-30 shadow-black/30">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="newPassword"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className=" bg-black bg-opacity-30  border-none outline-none p-2 sm:p-2.5 w-full sm:w-auto shadow-inner  opacity-50 font-sans font-bold text-gray-50 text-xs sm:text-sm"
                    />
                    <FontAwesomeIcon
                      icon={isPasswordVisible ? faEye : faEyeSlash}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      size="sm"
                      color="#666"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  <button
                    onClick={handlePasswordCheck}
                    className="focus:bg-gray-800 text-white px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 w-full sm:w-32 mt-2 sm:mt-0 rounded-md bg-black bg-opacity-60 shadow-inner shadow-black/30 opacity-50 text-xs sm:text-sm"
                  >
                    Change
                  </button>
                </div>
                {message.error && (
                  <p className="text-red-500 text-sm mt-1 font-sans">
                    {message.error}
                  </p>
                )}
                {message.success && (
                  <p className="text-[#66FCF1] text-sm mt-1 font-sans">
                    {message.success}
                  </p>
                )}
              </div>
              <DeleteAccount setIsAuthenticated={setIsAuthenticated} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}