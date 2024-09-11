import React from 'react';
import styles from './WaveShapeAnimation.module.css';
import Image from 'next/image';
import Intralogo from '../../assets/42logo.svg';
import { useRouter } from 'next/navigation';
function RegistrationButton({ text, switchToSignUp, switchToSignIn }) {
  const router = useRouter();
  const handleClick = () => {
    if (text === 'Sign Up Now') {
      switchToSignUp();
    } else if (text === 'Sign In Now') {
      switchToSignIn();
    }
    else
    {
      router.push(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_type=code`);
    }
  };
  return (
    <button
      type="submit"
      onClick={handleClick}
      className={`text-reg-text bg-reg-button hover:bg-white shadow-2xl font-sans md:text-xl  font-medium w-52 lg:w-[17.2rem] h-16
      ${
        text === 'Sign In with' || text === 'Sign Up with'
          ? 'rounded-tl-3xl '
          : 'rounded-br-3xl'
      }`}
    >
      <span className="hidden md:inline">
        {text === 'Sign In with' || text === 'Sign Up with' ? (
          <>
            {text}{' '}
            <Image
              src={Intralogo}
              alt="42logo"
              className="w-8 h-8 inline-block ml-2 translate-y-2"
            />
          </>
        ) : (
          text
        )}
      </span>
      <span className="md:hidden">
        {text === 'Sign In with' ? 'Sign In Intra' : 'Sign Up Now'}
      </span>
    </button>
  );
}

function WaveShapeAnimation({ intraRegister, signInUp, switchToSignUp, switchToSignIn }) {
  return (
      <div className={styles.animatedContainer}>

        <div className={styles.registrationContainer}>
          <RegistrationButton text={intraRegister} />
          <RegistrationButton
            text={signInUp}
            switchToSignUp={switchToSignUp}
            switchToSignIn={switchToSignIn}
          />
        </div>
        <div className="w-[100%] h-full hidden md:block">
          <div className={styles.waveShape}>
            <div className={styles.ocean}>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default WaveShapeAnimation;