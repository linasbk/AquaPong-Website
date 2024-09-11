"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
function ButtonStart({ text, switchToSignIn, isSignIn }) {
    return (
       <button
        type='submit'
        onClick={isSignIn ? switchToSignIn : null}
        className="flex justify-center items-center h-16 m-auto
       mt-6 p-5 text-sm w-46 sm:w-64 md:mt-10  text-my-grey bg-bgto hover:bg-hover-button rounded-tr-3xl rounded-bl-3xl">
         {text}
         <FontAwesomeIcon
           icon={faArrowRight}
           className="ml-5"
           size="lg"
           color="#fff"
         />
       </button>
    );
   }

export default ButtonStart;
  