"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const GenderSelect = ({ placeholder, error }) => (
  <div className="w-full form__field--gender">
    <select name="Gender" required  className="w-full  p-[1.2rem] 
    ">
      <option value="Female">Female</option>
      <option value="Male">Male</option>
    </select>
    {error && <p className="text-red-500 text-sm mt-1 font-sans">{error}</p>}
  </div>
);
const FormInput = ({ type, placeholder, value, onChange, error }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderInput = () => {
    const isPassword = type === "password" || type === "createPassword";
    const inputType = isPassword && isPasswordVisible ? "text" : (type === "createPassword" ? "password" : type);

    return (
      <>
        <input
          type={inputType}
          name={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full form__field border-2 border-my-grey rounded-tl-3xl rounded-br-3xl ${ isPassword ? "form__field--password" : ""}
          ${type === "Username" ? "form__field--username" : "" }`}
          placeholder={placeholder}
          required
        />
        {isPassword && (
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEye : faEyeSlash}
            className="absolute top-[4em] md:top-[3.5em] transform -translate-y-2/3 right-8 xs:right-[15%] cursor-pointer"
            size="1s"
            color="#666"
            onClick={togglePasswordVisibility}
          />
        )}
      </>
    );
  };

  return (
    <div className="w-full relative m-auto pt-6 pb-0 pl-3 pr-3 max-w-[25rem]">
      {type === "gender" ? (
        <GenderSelect placeholder={placeholder} error={error} />
      ) : (
        renderInput()
      )}
      <label htmlFor={placeholder} className="form__label">
        {type !== "gender" && placeholder}
      </label>
      {error && <p className="text-red-500 text-sm mt-1 font-sans">{error}</p>}
    </div>
  );
};

export default FormInput;