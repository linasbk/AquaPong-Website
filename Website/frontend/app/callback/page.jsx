"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import FormInput from "../components/sign/FormInput";
import "../(firstSide)/(auth)/signIn/signin.css"
import ButtonStart from "../components/sign/ButtonStart";
import Loading from "../components/loading/loading";
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const Callback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSuccessfulLogin = (data) => {
    if (data.user_status === "created") {
      router.push("/setPassword");
    } else {
      router.push("/homePage");
    }
  };
  const processCode = async (code, otp, username) => {
    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/callback?code=${code}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.status === 200) {
        if (data.otp_required) {
          setUsername(data.username);
          setShowOTP(true);
        }
        else {
          handleSuccessfulLogin(data);
        }
      }
      else {
        setError("An error occurred during login. Please try again.");
        router.push("/Error?statusCode=" + error.status);
      }
    }
    catch (error) {
      console.error("Error occurred during callback:", error);
      router.push("/Error?statusCode=" + error.status);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      processCode(code);
    }
    if (searchParams.get("error")) {
      router.push("/Error?statusCode=403");
    }
  }, [searchParams]);

  const handle2FASubmit = async (event) => {
    event.preventDefault();
    try {
      const code = searchParams.get("code");
      const response = await fetch(`${API_ADDRESS}/Sign_up/callback?code=${code}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, username }),
      });
      const data = await response.json();
      if (response.status === 200) {
        if (data.user_status === "created") {
          router.push("/setPassword");
        } else {
          router.push("/homePage");
        }
      }
      else {
        setError(data.error);
      }

    }
    catch (error) {
      console.error("Error occurred during callback:", error);
      router.push("/Error?statusCode=" + error.status);
    }
  }


  if (showOTP) {
    return (
      <div className="flex justify-center items-center w-full h-screen relative">
        <div className="absolute inset-0 bg-cover bg-no-repeat filter blur-md" style={{ backgroundImage: "url('./landingPage.png')" }}></div>
        <div className="flex justify-center items-center w-full h-screen">
          <div className="bg-bgfm text-center p-8 rounded shadow-md w-[30rem] bg-opacity-75 relative">
            <h2 className="text-2xl text-white mb-4 text-center">Enter 2FA Code</h2>
            <form onSubmit={handle2FASubmit}>
              <FormInput
                type="text"
                name="otp"
                placeholder="Enter 2FA code"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-1 font-sans ">{error}</p>}
              <ButtonStart text="Verify" />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const CallbackPage = () => (
  <Suspense fallback={<Loading />}>
    <Callback />
  </Suspense>
);

export default CallbackPage;