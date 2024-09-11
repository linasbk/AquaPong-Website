"use client";
import React, { useRef, useState } from 'react';
import "./signup.css";
import Image from 'next/image';
import logo from '../../../assets/aquaPong.svg';
import dynamic from 'next/dynamic';

const FormInput = dynamic(() => import("../../../components/sign/FormInput"), { ssr: false });
const ButtonStart = dynamic(() => import("../../../components/sign/ButtonStart"), { ssr: false });
const WaveShapeAnimation = dynamic(() => import("../../../components/sign/WaveShapeAnimation"), { ssr: false });
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

const SignUp = ({ switchToSignUp, switchToSignIn }) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('Username');
    const email = formData.get('Email address');
    const password = formData.get('Create a password');
    const gender = formData.get('Gender');

    try {
      const response = await fetch(`${API_ADDRESS}/Sign_up/signup`, {
        method: 'POST',
        credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ username, email, password, gender }),
      });

      if (response.ok) {
        const data = await response.json();
        switchToSignIn();
      } else {
        const errorData = await response.json();
        setErrors({});
        if (errorData && typeof errorData === 'object') {
          setErrors(errorData);
        }
      }
    } catch (error) {
      console.error('Error occurred during signup:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 w-full h-auto">
      <div className="hidden col-span-1 p-2 w-full h-full xl:flex justify-center items-center bg-bgfm rounded-tl-3xl shadow-2xl">
        <Image src={logo} alt="logo" className="w-full h-1/2 m-16" />
      </div>
      <div className="col-span-2 xl:max-w-full h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-graylight-bg to-gray-bg shadow-2xl rounded-br-3xl bg-red-500 w-full">
        <div className="grid grid-flow-row place-items-center h-full rounded-br-3xl items-end overflow-hidden ">
          <h2 className="md:pt-5 text-2xl text-tex-grey mt-2">
            Sign<span className="text-my-cyan"> Up</span>
          </h2>
          <form onSubmit={handleSubmit} className="w-full h-full">
            <div className="text-center w-[100%] mx-auto md:p-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:pb-5 p-1 md:p-5">
              <div >
                <FormInput type="Username" placeholder="Username" error={errors.username} />
              </div>
              <div >
                <FormInput type="email" placeholder="Email address" error={errors.email} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:pb-9 p-1 md:p-5">
              <div className='w-full pt-5'>
                <FormInput type="gender" placeholder="Gender" error={errors.gender} />
              </div>
              <div>
                <FormInput type="createPassword" placeholder="Create a password" error={errors.password} />
              </div>
            </div>
              <ButtonStart text={"Get Started"} className="w-full md:mt-10" switchToSignIn={switchToSignIn} isSignIn={false} />
            </div>
          </form>
            <WaveShapeAnimation intraRegister={"Sign Up with"} signInUp={"Sign In Now"} switchToSignUp={switchToSignUp} switchToSignIn={switchToSignIn} />
        </div>
      </div>
    </div>
  );
}

export default SignUp;