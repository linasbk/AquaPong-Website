import React from "react";

const UserInfoForm = ({ userInfo, setUserInfo }) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <div className="flex gap-16 flex-col w-full">
      <div className="flex gap-2 flex-col w-full">
        <label htmlFor="inputname" className="block text-white font-semibold text-sm mt-5">
          FullName
        </label>
        <div className="flex md:flex-row md:gap-2 md:justify-between">
          <input
            type="text"
            placeholder={userInfo.fullname}
            name="fullname"
            value={userInfo.fullname}
            onChange={handleInputChange}
            className="bg-black bg-opacity-60 border-none outline-none p-2.5 pr-16 shadow-inner shadow-black/30 opacity-50 font-sans font-bold text-gray-50 flex-grow"
            />
          <button
          onClick={handleInputChange}
          className="focus:bg-gray-800 text-white px-4 py-2 h-12 w-32 rounded-md bg-black bg-opacity-60 shadow-inner shadow-black/30 opacity-50">
            Change
          </button>
       </div>

        <label htmlFor="username" className="block text-white font-semibold text-sm mt-5">
          Username
        </label>
        <div className="flex flex-row gap-2 justify-between">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={userInfo.username}
            onChange={handleInputChange}
            className="bg-black bg-opacity-60 border-none outline-none p-2.5 pr-16 shadow-inner shadow-black/30 opacity-50 font-sans font-bold text-gray-50 flex-grow"
          />
           <button
            onClick={handleInputChange}
            className="focus:bg-gray-800 text-white px-4 py-2 h-12 w-32 rounded-md bg-black bg-opacity-60 shadow-inner shadow-black/30 opacity-50">
            Change
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;