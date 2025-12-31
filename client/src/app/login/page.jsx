// 'use client';

// import React, { Suspense, useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { FcGoogle } from 'react-icons/fc';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';

// const ClientLoginForm = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const error = searchParams.get('error');

//   const handleGoogleLogin = () => {
//     setIsLoading(true);
//     // Clients always go to the Homepage after login
//     signIn('google', { callbackUrl: '/' }); 
//   };

//   return (
//     <div className="bg-white rounded-4xl shadow-xl w-full max-w-md overflow-hidden relative">
//       <div className="h-32 bg-[#003459] relative flex items-center justify-center">
//          <div className="relative z-10 w-32 h-10">
//             <Image src="/images/logo.png" alt="Monito" fill className="object-contain brightness-0 invert" />
//          </div>
//       </div>

//       <div className="p-10 text-center">
//           <h1 className="text-2xl font-extrabold text-[#003459] mb-2">Join Monito</h1>
//           <p className="text-gray-500 mb-8 text-sm">Sign in to adopt pets and save favorites.</p>

//           {error && (
//             <div className="mb-6 bg-red-50 text-red-600 text-sm p-3 rounded-lg">
//                {error === 'OAuthAccountNotLinked' ? 'Please use your Admin Login instead.' : 'Login failed. Please try again.'}
//             </div>
//           )}

//           <button 
//               onClick={handleGoogleLogin}
//               disabled={isLoading}
//               className="w-full border-2 border-gray-100 hover:border-blue-100 bg-white text-gray-700 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
//           >
//               {isLoading ? 'Connecting...' : <><FcGoogle className="text-2xl" /> Continue with Google</>}
//           </button>

//           <div className="mt-8 text-xs text-gray-400">
//              Are you a staff member? <Link href="/admin/login" className="text-[#003459] font-bold hover:underline">Admin Portal</Link>
//           </div>
//       </div>
//     </div>
//   );
// };

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen bg-[#FDF7E4] flex items-center justify-center p-4">
//       <Suspense fallback={<div>Loading...</div>}><ClientLoginForm /></Suspense>
//     </div>
//   );
// }






















'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PetSpinner from '@/src/components/PetSpinner'; // 👈 Using your spinner

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
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Section */}
      <div className="bg-[#003459] p-8 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Background Pattern Decoration (Optional) */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/pattern.png')] bg-cover"></div>
         
         <div className="relative z-10 w-40 h-12 mb-2">
            <Image src="/images/logo.png" alt="Monito" fill className="object-contain brightness-0 invert" priority />
         </div>
         <p className="text-blue-100 text-xs font-medium tracking-wide relative z-10">PETS FOR BEST</p>
      </div>

      <div className="p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#003459] mb-2">Welcome Back!</h1>
            <p className="text-gray-500 text-sm">Sign in to save your favorite pets and track orders.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
               <span className="text-xl">⚠️</span>
               <span className="font-medium">
                 {error === 'OAuthAccountNotLinked' ? 'Please use your Admin Login instead.' : 'Login failed. Please try again.'}
               </span>
            </div>
          )}

          <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-100 hover:border-blue-100 hover:bg-gray-50 text-gray-700 font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>
                   <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" /> 
                  <span>Continue with Google</span>
                </>
              )}
          </button>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
             <p className="text-xs text-gray-400 mb-2">Are you a staff member?</p>
             <Link href="/admin/login" className="inline-flex items-center gap-1 text-[#003459] font-bold text-sm hover:underline">
                Access Admin Portal <span>→</span>
             </Link>
          </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDF7E4] flex items-center justify-center p-4 font-sans">
      <Suspense fallback={<div className="scale-75"><PetSpinner /></div>}>
         <ClientLoginForm />
      </Suspense>
    </div>
  );
}