"use client";
import './title.css';
import { usePathname } from 'next/navigation';

const Title = () => {
    const Titles = [
        { key: 1, title: 'HOME', path: '/homePage' },
        { key: 2, title: 'PROFILE', path: '/profilePage' },
        { key: 3, title: 'GAME', path: '/gamePage' },
        { key: 4, title: 'SETTINGS', path: '/settingsPage' },
        { key: 5, title: 'CHAT', path: '/chatPage' },
        { key: 6, title: 'CLANS', path: '/clanPage' }
    ];

    const pathname = usePathname();
    
    // Function to normalize paths by removing trailing IDs or parameters
    const normalizePath = (path) => {
        return path.replace(/\/[0-9]+$/, ''); // Regex to remove trailing numeric IDs
    };

    const currentTitle = Titles.find((item) => normalizePath(pathname).includes(item.path));

    return (
        <div className='Tcontainer relative flex justify-center col-start-2'>
            <h4 className='textTitle'>
                <span className='text-aqua-pong'>AQUA</span>
                {currentTitle ? currentTitle.title : 'Page Not Found'}
            </h4>
        </div>
    );
};

export default Title;
