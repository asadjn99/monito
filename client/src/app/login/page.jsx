'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ClientLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Clients always go to the Homepage after login
    signIn('google', { callbackUrl: '/' }); 
  };

  return (
    <div className="bg-white rounded-4xl shadow-xl w-full max-w-md overflow-hidden relative">
      <div className="h-32 bg-[#003459] relative flex items-center justify-center">
         <div className="relative z-10 w-32 h-10">
            <Image src="/images/logo.png" alt="Monito" fill className="object-contain brightness-0 invert" />
         </div>
      </div>

      <div className="p-10 text-center">
          <h1 className="text-2xl font-extrabold text-[#003459] mb-2">Join Monito</h1>
          <p className="text-gray-500 mb-8 text-sm">Sign in to adopt pets and save favorites.</p>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 text-sm p-3 rounded-lg">
               {error === 'OAuthAccountNotLinked' ? 'Please use your Admin Login instead.' : 'Login failed. Please try again.'}
            </div>
          )}

          <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full border-2 border-gray-100 hover:border-blue-100 bg-white text-gray-700 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
              {isLoading ? 'Connecting...' : <><FcGoogle className="text-2xl" /> Continue with Google</>}
          </button>

          <div className="mt-8 text-xs text-gray-400">
             Are you a staff member? <Link href="/admin/login" className="text-[#003459] font-bold hover:underline">Admin Portal</Link>
          </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDF7E4] flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}><ClientLoginForm /></Suspense>
    </div>
  );
}