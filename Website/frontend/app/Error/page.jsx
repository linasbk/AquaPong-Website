"use client";
import {Suspense} from 'react';
import { useSearchParams } from 'next/navigation';
import NotFound from '../not-found.jsx';
import Loading from '../components/loading/loading';
function ErrorComponent() {
  const searchParams = useSearchParams();
  const statusCode = searchParams.get('statusCode') || '404';


  return (
    <div className="text-center text-white">
      <NotFound params={statusCode} />
    </div>
  );
}

const Error = () => (
  <Suspense fallback={<Loading />}>
    <ErrorComponent />
  </Suspense>
);

export default Error;