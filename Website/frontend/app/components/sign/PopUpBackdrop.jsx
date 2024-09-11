'use client';

import './modal.css';
import React, { useState } from 'react';
import Modal from './Modal';
import SignIn from '../../(firstSide)/(auth)/signIn/page';
import SignUp from '../../(firstSide)/(auth)/signUp/page';
import styles from './SignInLandinPage.module.css';

const PopUpBackdrop = () => {
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const openSignInModal = () => setSignInModalOpen(true);
  const closeSignInModal = () => setSignInModalOpen(false);
  const openSignUpModal = () => setSignUpModalOpen(true);
  const closeSignUpModal = () => setSignUpModalOpen(false);

  const switchToSignIn = () => {
    closeSignUpModal();
    openSignInModal();
  };

   const switchToSignUp = () => {
    closeSignInModal();
    openSignUpModal();
  };

  return (
    <>
      <button className={styles.signIn} onClick={openSignInModal}>
        SignIn
      </button>
      <button className={styles.signUp} onClick={openSignUpModal}>
        SignUp
      </button>

      <Modal
        isOpen={isSignInModalOpen}
        onRequestClose={closeSignInModal}
        contentLabel="Sign In Modal"
        className="fixed inset-0 backdrop-filter backdrop-blur-md bg-gray-700 bg-opacity-50 z-50 flex justify-center items-center"
      >
        <SignIn switchToSignUp={switchToSignUp} switchToSignIn={switchToSignIn} />
      </Modal>

      <Modal
        isOpen={isSignUpModalOpen}
        onRequestClose={closeSignUpModal}
        contentLabel="Sign Up Modal"
        className="fixed inset-0 backdrop-filter backdrop-blur-md bg-gray-700 bg-opacity-50 z-50 flex justify-center items-center"
      >
        <div className="flex justify-center items-center h-screen">
          <SignUp switchToSignUp={switchToSignUp} switchToSignIn={switchToSignIn} />
        </div>
      </Modal>
    </>
  );
};

export default PopUpBackdrop;