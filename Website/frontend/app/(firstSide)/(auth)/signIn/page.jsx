'use client';
import "./signin.css";
import Image from 'next/image';
import logo from '../../../assets/aquaPong.svg';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const FormInput = dynamic(() => import("../../../components/sign/FormInput"), { ssr: false });
const ButtonStart = dynamic(() => import("../../../components/sign/ButtonStart"), { ssr: false });
const WaveShapeAnimation = dynamic(() => import("../../../components/sign/WaveShapeAnimation"), { ssr: false });
// @ts-ignore
const SignIn = ({ switchToSignUp, switchToSignIn }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [show2FA, setShow2FA] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
  const handleSuccessfulLogin = (data) => {
    if (data.firstlogin === true) {
      router.push("/settingsPage");
    } else {
      router.push("/");
    }
  };

  const handleSignin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('Username');
    const password = formData.get('Password');
    setUsername(username);
    setPassword(password);

    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.otp_required) {
          setShow2FA(true);
        } else {
          handleSuccessfulLogin(data);
        }
      } else {
        setErrors({ error: data.error });
      }
    } catch (error) {
      console.error('Error occurred during signin:', error);
      setErrors({ error: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handle2FASubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, otp: twoFactorCode }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccessfulLogin(data);
      } else {
        console.error('2FA verification failed:', data);
        setErrors({ error: data.error });
      }
    } catch (error) {
      console.error('Error occurred during 2FA verification:', error);
      setErrors({ error: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 w-full h-auto">
      <div className="col-span-1 xl:max-w-full w-full h-full justify-center items-center bg-bgfm shadow-2xl rounded-tl-3xl">
        <div className="grid grid-flow-row place-items-center h-full items-end overflow-hidden">
          <h2 className="pt-5 text-2xl text-tex-grey mt-2">
            Sign<span className="text-my-cyan"> In</span>
          </h2>
          {!show2FA ? (
            <>
            <form onSubmit={handleSignin} className="w-full h-full">
              <div className="text-center w-[100%] mx-auto lg:pb-9 p-0 md:p-1">
                <FormInput type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <FormInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {errors.error && <p className="text-red-500 text-sm mt-1 font-sans">{errors.error}</p>}
                <ButtonStart text="Get Started" />
              </div>
            </form>
              <WaveShapeAnimation intraRegister="Sign In with" signInUp="Sign Up Now" switchToSignUp={switchToSignUp} switchToSignIn={switchToSignIn} />
            </>
          ) : (
            <form onSubmit={handle2FASubmit} className="w-full h-full">
              <div className="text-center w-[100%] mx-auto lg:pb-9 p-0 md:p-1">
                <FormInput
                  type="text"
                  placeholder="Enter 2FA Code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                />
                {errors.error && <p className="text-red-500 text-sm mt-1 font-sans">{errors.error}</p>}
                <ButtonStart text="Verify" />
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="hidden col-span-2 p-2 w-full h-full xl:flex justify-center items-center rounded-br-3xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-graylight-bg to-gray-bg shadow-2xl">
        <Image src={logo} alt="logo" className="w-1/2 h-1/2 m-auto" />
      </div>
    </div>
  );
};

export default SignIn;