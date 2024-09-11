'use client';
import { useEffect } from 'react';
import ReactModal from 'react-modal';

const useModalAppElement = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('#__next');
    }
  }, []);
};

export default useModalAppElement;
