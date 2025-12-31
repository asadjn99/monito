// 'use client';

// import React, { useState, Suspense } from 'react';
// import { signIn } from 'next-auth/react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { FiLock } from 'react-icons/fi';

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
//       // Admins go to Dashboard
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
//       <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
//         Authorized personnel only.
//         <div className="mt-8 text-xs text-gray-400">
//                    Are you a user? <Link href="/login" className="text-[#003459] font-bold hover:underline">User Login</Link>
//                 </div>
//       </div>
       
//     </div>
//   );
// };

// export default function AdminPage() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//        <Suspense fallback={<div>Loading...</div>}><AdminLoginForm /></Suspense>
//     </div>
//   );
// }



























'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock } from 'react-icons/fi';

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
      // 1. Refresh router to update Session immediately
      router.refresh(); 
      // 2. Redirect to the Dashboard
      router.push('/admin'); 
    }
  };

  return (
    <div className="bg-white rounded-4xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100">
      <div className="p-8">
        <div className="flex justify-center mb-6 text-[#003459]">
           <FiLock className="text-4xl bg-blue-50 p-2 rounded-full box-content" />
        </div>
        <h1 className="text-xl font-extrabold text-center text-[#003459] mb-6">Staff Access</h1>

        {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded mb-4 font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#003459] outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#003459] outline-none" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#003459] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-all shadow-lg"
          >
            {isLoading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
      
      {/* Footer Area */}
      <div className="bg-gray-50 p-4 text-center">
        <p className="text-xs text-gray-400 mb-2">Authorized personnel only.</p>
        <Link href="/login" className="text-xs text-[#003459] font-bold hover:underline">
            Are you a user? Login here
        </Link>
      </div>
       
    </div>
  );
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
       <Suspense fallback={<div>Loading...</div>}><AdminLoginForm /></Suspense>
    </div>
  );
}