'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/UserContext';
import Loading from '../loading/loading';
const AuthWrapper = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isAuthenticated && !isLoading) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    checkAuthentication();
  }, [isAuthenticated, isLoading, checkAuth]);
  useEffect(() => {
    if (!isChecking && !isLoading) {
      if (!isAuthenticated) {
        router.push('/landingPage');
      } else if (window.location.pathname === '/') {
        router.push('/homePage');
      }
    }
  }, [isAuthenticated, isLoading, isChecking, router]);

  if (isLoading || isChecking) {
    return <Loading />;
  }

  return isAuthenticated ? children : null;
};

export default AuthWrapper;