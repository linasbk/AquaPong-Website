import dynamic from 'next/dynamic';
const AuthWrapper = dynamic(() => import('./components/authWrapper/authWrapper'));
export default function Home() {
  return <AuthWrapper>children</AuthWrapper>;
}