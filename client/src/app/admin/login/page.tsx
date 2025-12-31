// 'use client';

// import React, { useState, Suspense } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { FiLock } from 'react-icons/fi';
// import PetSpinner from '@/src/components/PetSpinner';

// const AdminLoginForm = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     const res = await signIn('credentials', {
//       redirect: false,
//       email,
//       password,
//     });

//     if (res?.error) {
//       setError('Invalid Admin Credentials');
//       setIsLoading(false);
//     } else {
//       // 1. Refresh router to update Session immediately
//       router.refresh(); 
//       // 2. Redirect to the Dashboard
//       router.push('/admin'); 
//     }
//   };

//   return (
//     <div className="bg-white rounded-4xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100">
//       <div className="p-8">
//         <div className="flex justify-center mb-6 text-[#003459]">
//            <FiLock className="text-4xl bg-blue-50 p-2 rounded-full box-content" />
//         </div>
//         <h1 className="text-xl font-extrabold text-center text-[#003459] mb-6">Staff Access</h1>

//         {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded mb-4 font-bold text-center">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
//             <input 
//               type="email" 
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#003459] outline-none" 
//             />
//           </div>
//           <div>
//             <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
//             <input 
//               type="password" 
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#003459] outline-none" 
//             />
//           </div>
//           <button 
//             type="submit" 
//             disabled={isLoading}
//             className="w-full bg-[#003459] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-all shadow-lg"
//           >
//             {isLoading ? 'Verifying...' : 'Login to Dashboard'}
//           </button>
//         </form>
//       </div>
      
//       {/* Footer Area */}
//       <div className="bg-gray-50 p-4 text-center">
//         <p className="text-xs text-gray-400 mb-2">Authorized personnel only.</p>
//         <Link href="/login" className="text-xs text-[#003459] font-bold hover:underline">
//             Are you a user? Login here
//         </Link>
//       </div>
       
//     </div>
//   );
// };

// export default function AdminPage() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//        <Suspense fallback={<div> <PetSpinner/> </div>}><AdminLoginForm /></Suspense>
//     </div>
//   );
// }
















'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiAlertCircle } from 'react-icons/fi';
import PetSpinner from '@/src/components/PetSpinner'; // 👈 Using your spinner

const AdminLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid Admin Credentials');
      setIsLoading(false);
    } else {
      router.refresh(); 
      router.push('/admin'); 
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 pb-6">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
              <FiLock className="text-3xl text-[#003459]" />
           </div>
        </div>
        
        <div className="text-center mb-8">
           <h1 className="text-xl font-extrabold text-[#003459] mb-1">Staff Portal</h1>
           <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Secure Access Only</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2 justify-center animate-shake">
                <FiAlertCircle className="text-lg"/> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-[#003459] focus:bg-white focus:ring-2 focus:ring-[#003459] focus:border-transparent outline-none transition-all placeholder:text-gray-300" 
              placeholder="admin@monito.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-[#003459] focus:bg-white focus:ring-2 focus:ring-[#003459] focus:border-transparent outline-none transition-all placeholder:text-gray-300" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#003459] text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Verifying...</span>
               </div>
            ) : 'Login to Dashboard'}
          </button>
        </form>
      </div>
      
      {/* Footer Area */}
      <div className="bg-gray-50 p-5 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Not an admin?</p>
        <Link href="/login" className="text-xs text-[#003459] font-bold hover:underline">
            Go to User Login
        </Link>
      </div>
       
    </div>
  );
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
       <Suspense fallback={<div className="scale-75"><PetSpinner/></div>}>
          <AdminLoginForm />
       </Suspense>
    </div>
  );
}