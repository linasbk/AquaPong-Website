'use client';
import { useState } from 'react';
import SignUp from '../../(firstSide)/(auth)/signUp/page';
import styles from './SignInLandinPage.module.css';


const SignUpButton = (isSignin) => {
    const [showModal, setShowModal] = useState(false);
    // const [signIn, setSignIn] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
        // setSignIn(true); // For SignIn button, set signIn state to true
    };

    return (
        <>
            <button className={styles.signUp} onClick={toggleModal}>SignUp</button>
            {showModal && (
                <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-gray-700 bg-opacity-50 z-50">
                    <button className="btn btn-square bg-bgfm hover:bg-bgto hover:text-my-cyan text-white absolute top-5 right-5 z-50" onClick={toggleModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="flex justify-center items-center h-screen">
                        <SignUp onClose={() => setShowModal(false)} isSignin={isSignin} />
                    </div>
                </div>
            )}
        </>
    );
};

export default SignUpButton;

