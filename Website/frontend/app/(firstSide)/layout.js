"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/UserContext';
import Loading from '../components/loading/loading';

const Layout = ({ children }) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            checkAuth();
        }
    }
    , []);

    if (isLoading) {
        return <Loading />;
    }
    if (isAuthenticated) {
        router.push('/homePage');
    }
    else
    {
        return (<>{children}</>)
    }
}

export default Layout;