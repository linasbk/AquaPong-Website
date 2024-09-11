// components/Modal.js
"use client";
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';


const CloseButton = ({ onClick }) => {
  return (
    <button
      className="absolute top-4 right-4 text-white hover:text-gray-400 z-50"
      onClick={onClick}
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};


const Modal = ({ isOpen, onRequestClose, contentLabel, children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('body');
    }
  }, []);

  if (!isClient) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className="modal"
      overlayClassName="overlay"
    >
      <CloseButton onClick={onRequestClose} />
      {children}
    </ReactModal>
  );
};

export default Modal;
