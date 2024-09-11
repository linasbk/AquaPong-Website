"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
function SetPassword() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [Message, setMessages] = useState({ success: "", error: "" });

  const SetPassword = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    try {
      const response = await fetch(
        `${API_ADDRESS}/Sign_up/set-password`,
        {
          method: "POST",
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );
      if (response.ok) {
        setMessages({ success: "Password set successfully" });
        setTimeout(() => {
          router.push("/settingsPage");
        }, 3000);
      } else {
        const data = await response.json();
        setMessages({ error: data.error });
      }
    } catch (error) {
      setMessages({ error: "An unexpected error occurred. Please try again." });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-blur-md bg-black z-[10001] flex-col gap-2">
        <form onSubmit={SetPassword} className="p-10 rounded-lg z-500 flex">
          <div className="relative flex-grow">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="New password"
              className="rounded-tl-2xl text-gray-500 bg-gray-700 bg-opacity-35 p-2 pr-10 w-full"
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEye : faEyeSlash}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              size="1x"
              color="#666"
              onClick={togglePasswordVisibility}
            />
          </div>
          <button
            type="submit"
            className="bg-[#3ea1ad] text-white px-4 py-2 rounded-br-2xl"
          >
            ADD
          </button>
        </form>
        {Message.error && (
          <p className="text-red-500 text-sm mt-1 font-sans">{Message.error}</p>
        )}
        {Message.success && (
          <p className="text-aqua-pong text-sm mt-1 ">
            {Message.success}
          </p>
        )}
      </div>
    </div>
  );
}

export default SetPassword;