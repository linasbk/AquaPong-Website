"use client";
import React from "react";
import Image from "next/image";
import Intralogo from "../../assets/42logo.svg";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const TwoFactorAuth = ({ userInfo }) => {
  const [qr_code, setQrCode] = useState(userInfo.qr_code);
  const [Message, setMessages] = useState({ success: "", error: "" });
  const [isEnabled, setIsEnabled] = useState(userInfo.otp_enabled);
  const [verified, setVerified] = useState(userInfo.otp_verified);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordPrompt = useRef(null);
  const PasswordEnable = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/generate-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.user.qr_code);
        setIsEnabled(true);
        setShowPasswordPrompt(false);
      } else {
        setMessages({ error: "Incorrect password" });
      }
    } catch (error) {
      setMessages({ error: "Failed to enable OTP" });
    }
  };

  const PasswordDisable = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/disable-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setQrCode(false);
        setIsEnabled(false);
        setVerified(false);
        setShowPasswordPrompt(false);
      } else {
        setMessages({ error: "Incorrect password" });
      }
    } catch (error) {
      setMessages({ error: "Failed to disable OTP" });
    }
  };
  const [error, setError] = useState("");

  const ValidateOTP = async (otp) => {
    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });
      if (response.ok) {
        setVerified(true);
        setIsEnabled(true);
        setError("");
        setQrCode("/verifiedQrcode.png");
      } else {
        setError("Incorrect OTP");
      }
    } catch (error) {
      setError("Failed to verify OTP");
    }
  };
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!verified && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      ValidateOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    const passwordPromptClick = (e) => {
      if (
        passwordPrompt.current &&
        !passwordPrompt.current.contains(e.target)
      ) {
        setShowPasswordPrompt(false);
      }
    };
    document.addEventListener("mousedown", passwordPromptClick);
    return () => {
      document.removeEventListener("mousedown", passwordPromptClick);
    };
  }, [passwordPrompt]);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full items-center text-centerd text-xs text-white bg-black p-4 rounded-tr-2xl rounded-tl-2xl flex flex-row gap-4 justify-between">
        <h3 className="">2FA</h3>
        <div className="relative inline-block w-10 h-6">
          <div
            onClick={() => setShowPasswordPrompt(true)}
            className="cursor-pointer"
            ref={passwordPrompt}
          >
            <label className="relative inline-block w-4 h-2">
              <input
                className="sr-only opacity-0 w-0 h-0 peer"
                value="twoFactorAuth"
                checked={isEnabled}
                type="checkbox"
                readOnly
              ></input>
              <div
                className={`peer cursor-pointer  right-0 left-0 bottom-0 bg-white outline-white rounded-[2px] duration-300 after:duration-300 w-8 h-[0.95rem] shadow-md after:content-['']
                   ${
                     isEnabled
                       ? "peer-checked:after:translate-x-4 peer-checked:after:rotate-90 after:bg-[#66FCF1]"
                       : "after:bg-gray-400 after:translate-x-0 after:rotate-0"
                   }
                   after:rounded-[2px] after:absolute after:h-3 after:w-3 after:top-[0.1rem] after:left-[0.1rem] peer-hover:after:scale-105`}
              ></div>
            </label>
          </div>
        </div>
      </div>
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col g-2 items-center justify-center z-[10001] backdrop-blur-sm">
          <form
            onSubmit={isEnabled ? PasswordDisable : PasswordEnable}
            className="p-10 rounded-lg flex flex-col gap-2 bg-opacity-50"
            ref={passwordPrompt}
          >
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter password"
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
              {isEnabled ? "Disable" : "Enable"}
            </button>
          </form>
          {Message.error && (
            <p className="text-red-500 text-sm mt-1">{Message.error}</p>
          )}
        </div>
      )}
      <div
        className={`${
          !isEnabled ? "blur-md bg-black bg-opacity-10 " : "bg-black"
        }  p-5 flex flex-col items-center justify-center gap-2 bg-gray-800 bg-opacity-15`}
      >
        {(verified && (
          <Image
            src="/verifiedQr.svg"
            alt="QR Code"
            width={200}
            height={200}
            className="w-32 h-44 mt-16 mb-16"
          />
        )) || (
          <>
            <Image
              src={Intralogo}
              alt="42logo"
              width={32}
              height={32}
              className="filter sepia saturate-100 hue-rotate-0 brightness-0 invert w-8 h-8 block mx-auto"
            />
            <div
              className="relative w-52 h-52 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/twofactorborder.png')" }}
            >
              {qr_code ? (
                <Image
                  src={`${API_ADDRESS}/${qr_code}`}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
                />
              ) : (
                <Image
                  src="/noQrcode.png"
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
                />
              )}
            </div>
            <form className="max-w-sm mx-auto">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`${
                    isEnabled
                      ? "focus:border-[#66FCF1] focus:outline-none"
                      : "focus:border-[#181818]"
                  } w-8 h-8 bg-white text-center text-xl border-4 border-[#202020] rounded-md ${
                    !isEnabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    isEnabled && handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) => isEnabled && handleKeyDown(index, e)}
                  disabled={!isEnabled}
                />
              ))}
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;