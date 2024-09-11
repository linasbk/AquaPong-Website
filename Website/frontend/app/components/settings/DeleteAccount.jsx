"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/UserContext';
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
function DeleteAccount({ setIsAuthenticated }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const passwordPromptRef = useRef(null);

  const handleDelete = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;

    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/delete-user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok) {
        await logout();
        router.push("/landingPage");
      } else {
        setError(data.message || "An error occurred during deletion");
      }
    } catch (error) {
      console.error("An error occurred during deletion:", error);
      router.push("Error?statusCode=" + error.status);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passwordPromptRef.current && !passwordPromptRef.current.contains(event.target)) {
        setShowPasswordPrompt(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="justify-center items-end flex gap-2">
      <button
        type="button"
        onClick={() => setShowPasswordPrompt(true)}
        className="bg-red-900 bg-opacity-75 text-white px-4 py-2 h-10 sm:h-12 w-full sm:w-64 focus:bg-red-500 focus:bg-opacity-75 text-xs sm:text-sm"
      >
        Delete Account
      </button>
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[1001] bg-black bg-opacity-50 flex flex-col g-2 items-center justify-center backdrop-blur-sm">
          <form
            onSubmit={handleDelete}
            className="rounded-lg p-4 flex flex-col gap-2 bg-opacity-50 w-[90%] sm:w-[400px]"
            ref={passwordPromptRef}
          >
            <div className="relative flex flex-row w-full flex-wrap">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter password to confirm"
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
              className="bg-red-900 text-white px-4 py-2 rounded-br-2xl hover:bg-red-700"
            >
              Confirm Delete
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;