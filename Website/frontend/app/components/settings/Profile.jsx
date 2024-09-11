"use client";
import {  useRef, useState, useCallback } from "react";
import { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import { UserContext } from "../../contexts/UserContext";
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
export default function Profile() {
  const { userInfo } = useContext(UserContext);
  const userid = userInfo.id;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState({ fullname: "", username: "" });
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setIsUploading(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFullNameChange = useCallback((event) => {
    setFullname(event.target.value);
  } , []);

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleImageSubmit = async () => {
    
    const formData = new FormData();
    formData.append("image", fileInputRef.current.files[0]);
    
    try {
        const response = await fetch(`${API_ADDRESS}/Dashboard_home/update_image`, {
            method: "POST",
            credentials: 'include',
            body: formData,
        });
        setIsUploading(false);
        window.location.reload();

    } catch (error) {
        setIsUploading(false);
    }
};


  const handleFullNameSubmit = async () => {
    const fullnameRegex = /^[a-zA-Z\s]*$/;
    if (!fullnameRegex.test(fullname) || fullname === "")
      {
        setMessage({ fullname: "Invalid Fullname" });
        return;
      }
      try {
        const response = await fetch(`${API_ADDRESS}/Dashboard_home/update_fullname`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullname }),
        });
        if (response.ok) {
        setIsUploading(true);
        setMessage({ fullname: "" });
      }
      else {
        const errorData = await response.json();
        setMessage({ fullname: errorData.message || "Failed to change fullname" });
      }
    } catch (error) {
      setIsUploading(false);
      setMessage({ fullname: "Failed to change fullname" });
    }
  };

  const handleUsernameSubmit = async () => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!username || !usernameRegex.test(username) || username.length > 15)
      {
        setMessage({ username: "Invalid Username" });
        return;
      }
      try {
        const response = await fetch(`${API_ADDRESS}/Dashboard_home/update_username`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          setIsUploading(true); 
          setMessage({ username: "" });
      }
      else {
        const errorData = await response.json();
        setMessage({ username: errorData.message || "Failed to change username" });
      }
    } catch (error) {
      setIsUploading(false);
      setMessage({ username: "Username already exists" });
    }
  };

  return (
    <div className="w-full h-full col-start-1 row-start-1 relative flex flex-col items-center justify-center">
      <h1 className="w-full text-center text-xs sm:text-sm lg:text-lg font-bold text-white bg-black p-2 lg:p-4">
        Profile
      </h1>
      <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-20 p-2 md:p-8 lg:p-16 relative">
        <form onSubmit={(event) => event.preventDefault()}  className="w-full max-w-md h-full  relative flex flex-col items-center justify-center">
          <div className="w-full h-[40%] relative">
            <ProfilePicture
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              selectedImage={selectedImage}
              user={userInfo}
            />
          </div>

          <div className="flex  md:gap-16 flex-col w-full  sm:mt-8 h-[50%] relative">
            <div className="flex gap-2 flex-col w-full">
              <label
                htmlFor="inputname"
                className="block text-white font-semibold text-xs sm:text-sm mt-2 sm:mt-5"
              >
                FullName
              </label>
              <div className="flex flex-col sm:flex-row sm:gap-2 sm:justify-between">
                <input
                  type="text"
                  placeholder={userInfo.fullName}
                  name="fullname"
                  value={fullname}
                  onChange={handleFullNameChange}
                  className="bg-black bg-opacity-60 border-none outline-none p-2 sm:p-2.5 w-full sm:w-auto shadow-inner shadow-black/30 opacity-50 font-sans font-bold text-gray-50 text-xs sm:text-sm flex-grow"
                />
                <button
                  onClick={handleFullNameSubmit}
                  className="focus:bg-gray-800 text-white px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 w-full sm:w-32 mt-2 sm:mt-0 rounded-md bg-black bg-opacity-60 shadow-inner shadow-black/30 opacity-50 text-xs sm:text-sm"
                >
                  Change
                </button>
              </div>
                {message.fullname && (
                  <p className="text-red-500 text-sm mt-1 font-sans">
                    {message.fullname}
                  </p>
                )}

              <label
                htmlFor="inputname"
                className="block text-white font-semibold text-xs sm:text-sm mt-3 sm:mt-5"
              >
                Username
              </label>
              <div className="flex flex-col sm:flex-row sm:gap-2 sm:justify-between">
                <input
                  type="text"
                  placeholder={userInfo.username}
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="bg-black bg-opacity-60 border-none outline-none p-2 sm:p-2.5 w-full sm:w-auto shadow-inner shadow-black/30 opacity-50 font-sans font-bold text-gray-50 text-xs sm:text-sm flex-grow"
                />
                <button
                  onClick={handleUsernameSubmit}
                  className="focus:bg-gray-800 text-white px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 w-full sm:w-32 mt-2 sm:mt-0 rounded-md bg-black bg-opacity-60 shadow-inner shadow-black/30 opacity-50 text-xs sm:text-sm"
                >
                  Change
                </button>
              </div>
                {message.username && (
                  <p className="text-red-500 text-sm mt-1 font-sans">
                    {message.username}
                  </p>
                )}
            </div>
          </div>
            <div className="justify-center items-end flex gap-2 mt-3 sm:mt-5 h-[48px]  relative">
              <button
                type="submit"
                className={`bg-opacity-50 hover:bg-opacity-100  text-white px-4 py-2  sm:h-12 w-full sm:w-64 focus:bg-opacity-75 text-xs sm:text-sm ${!isUploading ? "cursor-not-allowed bg-[#6c6c6c] " : "cursor-pointer bg-aqua-pong hover:text-black"}`}
                disabled={!isUploading}
                onClick={() => handleImageSubmit()}>
                Save
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}
