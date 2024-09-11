'use client';
import React, { useEffect, useState , useRef} from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import Table from './table';



const SearchForm = ({ placeholder }) => {
    const search = useRef(null);
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [close, onClose] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useDebouncedCallback((term) => {
        setSearchTerm(term);
        updateSearchParams(term);
        onClose(true);
    }, 100);

    const updateSearchParams = (term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        if (term === 'sign') {
            //clear the input field
            setSearchTerm('');
            term = '';
            setModalOpen(true);
            return;
        }
        replace(`${pathname}?${params.toString()}`);
        onClose(true);
    };

    useEffect(() => {
        return () => { 
            if (!searchParams.get('search')) return;
            const params = new URLSearchParams(searchParams);
            params.delete('search');
            replace(`${pathname}?${params.toString()}`);
            onClose(true);
        };
    }, []);


    return (
        <div className="w-[30%] min-w-[200px] h-[100%] flex justify-center items-center relative gap-4 " ref={search}>
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
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    value={searchTerm}
                    required=""
                    type="text"
                    id='search'
                />
            </form>
            {searchTerm && close && (<Table query={searchTerm} onClose={onClose} setSearchTerm={setSearchTerm} updateSearchParams={updateSearchParams} search={search} />)}
        </div>
    );
};

export default SearchForm;
