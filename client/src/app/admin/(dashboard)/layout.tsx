
// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { signOut, useSession } from 'next-auth/react';
// import { FiHome, FiGrid, FiShoppingBag, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const { data: session } = useSession();

//   const navItems = [
//     { href: '/admin', label: 'Dashboard', icon: <FiHome /> },
//     { href: '/admin/inventory', label: 'Pet Inventory', icon: <FiGrid /> },
//     { href: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
//     { href: '/admin/finance', label: 'Finance', icon: <FiDollarSign /> },
//     { href: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
//   ];

//   return (
//     <div className="min-h-screen bg-[#FDF7E4] flex">
      
//       {/* --- SIDEBAR (Fixed Left) --- */}
//       <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-50">
//         <div className="p-8">
//             <h1 className="text-2xl font-extrabold text-blue-900">MONITO<span className="text-yellow-400">.</span></h1>
//             <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">ADMIN PANEL</p>
//         </div>
        
//         <nav className="flex-1 px-4 space-y-2">
//             {navItems.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                     <Link 
//                       key={item.href}
//                       href={item.href}
//                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
//                         isActive 
//                         ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/30' 
//                         : 'text-gray-500 hover:bg-gray-50 hover:text-blue-900'
//                       }`}
//                     >
//                         <span className="text-xl">{item.icon}</span>
//                         {item.label}
//                     </Link>
//                 );
//             })}
//         </nav>

//         <div className="p-4 border-t border-gray-100">
//             <button 
//               onClick={() => signOut({ callbackUrl: '/' })}
//               className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
//             >
//                 <FiLogOut /> Log Out
//             </button>
//         </div>
//       </aside>

//       {/* --- MAIN CONTENT (Pushed Right) --- */}
//       <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
//         {/* Header */}
//         <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
//             <div>
//                 <h2 className="text-xl font-bold text-gray-800 capitalize">
//                     {navItems.find(i => i.href === pathname)?.label || 'Admin Area'}
//                 </h2>
//                 <p className="text-xs text-gray-500">Welcome back, {session?.user?.name || 'Admin'}</p>
//             </div>
//             <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-blue-900">
//                 {session?.user?.name?.charAt(0) || 'A'}
//             </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-8 flex-1">
//             {children}
//         </main>

//         {/* Admin Footer */}
//         <footer className="p-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
//             &copy; {new Date().getFullYear()} Monito Admin Panel. All rights reserved.
//         </footer>
//       </div>

//     </div>
//   );
// }









'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 👈 Added missing import
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  FiHome, FiGrid, FiShoppingBag, FiDollarSign, FiSettings, FiLogOut, FiUsers 
} from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { href: '/admin/inventory', label: 'Pet Inventory', icon: <FiGrid /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { href: '/admin/customers', label: 'Customers', icon: <FiUsers /> }, // Added Customers link since you have the page
    { href: '/admin/finance', label: 'Finance', icon: <FiDollarSign /> },
    { href: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDF7E4] flex font-sans">
      
      {/* --- SIDEBAR (Fixed Left) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-50 shadow-sm">
        <div className="p-8 pb-4">
            {/* Logo Section */}
            <Link href="/" className="block cursor-pointer group relative z-50 mb-2">
              <div className="relative w-32 h-10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Monito Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-2">Admin Control Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                        isActive 
                        ? 'bg-[#003459] text-white shadow-lg shadow-blue-900/20 translate-x-1' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#003459]'
                      }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
            >
                <FiLogOut className="text-lg" /> Log Out
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (Pushed Right) --- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center shadow-sm">
            <div>
                <h2 className="text-xl font-extrabold text-[#003459] capitalize tracking-tight">
                    {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-xs text-gray-500 font-medium">Overview & Statistics</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#003459]">{session?.user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-md flex items-center justify-center font-bold text-[#003459] overflow-hidden">
                    {session?.user?.image ? (
                        <Image src={session.user.image} alt="Admin" width={40} height={40} className="object-cover w-full h-full"/>
                    ) : (
                        session?.user?.name?.charAt(0) || 'A'
                    )}
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
            {children}
        </main>

        {/* Admin Footer */}
        <footer className="p-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
            &copy; {new Date().getFullYear()} Monito Pets. Authorized Personnel Only.
        </footer>
      </div>

    </div>
  );
}