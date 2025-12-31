// import React from 'react';

// // We removed the "getServerSession" check because Middleware handles security now.
// // This prevents the "Infinite Loop" on the login page.

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//        {/* You can add a Sidebar or Navbar here later */}
//        <main>
//           {children}
//        </main>
//     </div>
//   );
// }




'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiHome, FiGrid, FiShoppingBag, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { href: '/admin/pets', label: 'Pet Inventory', icon: <FiGrid /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { href: '/admin/finance', label: 'Finance', icon: <FiDollarSign /> },
    { href: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDF7E4] flex">
      
      {/* --- SIDEBAR (Fixed Left) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-50">
        <div className="p-8">
            <h1 className="text-2xl font-extrabold text-blue-900">MONITO<span className="text-yellow-400">.</span></h1>
            <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">ADMIN PANEL</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                        isActive 
                        ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/30' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-blue-900'
                      }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
            >
                <FiLogOut /> Log Out
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (Pushed Right) --- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                    {navItems.find(i => i.href === pathname)?.label || 'Admin Area'}
                </h2>
                <p className="text-xs text-gray-500">Welcome back, {session?.user?.name || 'Admin'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-blue-900">
                {session?.user?.name?.charAt(0) || 'A'}
            </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1">
            {children}
        </main>

        {/* Admin Footer */}
        <footer className="p-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
            &copy; {new Date().getFullYear()} Monito Admin Panel. All rights reserved.
        </footer>
      </div>

    </div>
  );
}