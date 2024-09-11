import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { user } from "@nextui-org/react";

let API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const ProfilePicture = ({ fileInputRef, handleImageUpload, selectedImage, user }) => {
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div name="changeAvatar" className="flex items-center justify-center gap-2 flex-col w-full">
      <h3 className="text-white text-xs sm:text-sm font-bold">{user.username}'s Avatar</h3>
      <div className="relative text-center">
        <div className="w-32 h-32 md:w-52 md:h-52 object-cover bg-gray-800 bg-opacity-70 justify-center items-center flex overflow-hidden border-blue-gray-500 border-[8px] rounded-tl-2xl rounded-br-2xl">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt="Avatar"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={`${API_ADDRESS}/${user.image}`}
              alt="Avatar"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute bottom-0 right-0 text-white p-1 sm:p-2 w-full backdrop-blur-sm border-black border-[1px] justify-center items-center flex rounded-br-2xl">
          <input
            type="file"
            accept="image/*"
            className="relative cursor-pointer"
            ref={fileInputRef}
            onChange={handleImageUpload}
            name="image"
            hidden
          />
          <FontAwesomeIcon
            icon={faCamera}
            size="1x"
            color="#5AD5D0"
            className="relative cursor-pointer text-xs sm:text-sm"
            onClick={handleCameraClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;