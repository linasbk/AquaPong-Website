'use client';
import React from 'react';



const SearchForm = ({ placeholder , setSearchTerm, searchTerm}) => {

    return (
        <div className="w-[90%] h-[80px] flex justify-center items-center relative gap-4 ">
            <form className="relative text-white z-10 w-full">
                <button className="absolute left-2 -translate-y-1/2 top-[55%] p-5 ">
                    <svg
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-labelledby="search"
                        className="w-5 h-5 text-gray-400"
                    >
                        <path
                            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </button>
                <input
                    className="bg-[rgba(110,110,110,0.3)] font-sans input rounded-br-3xl rounded-tl-3xl  px-14 py-3 border-2 border-transparent focus:outline-none focus:border-my-cyan placeholder-gray-400 transition-all duration-300 w-[100%]"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required=""
                    type="text"
                    id='search'
                />
            </form>
        </div>
    );
};

export default SearchForm;