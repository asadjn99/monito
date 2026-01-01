'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  FiHome, FiGrid, FiShoppingBag, FiDollarSign, FiSettings, FiLogOut, FiUsers, 
  FiMessageSquare, FiMenu, FiX 
} from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { href: '/admin/inventory', label: 'Pet Inventory', icon: <FiGrid /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { href: '/admin/customers', label: 'Customers', icon: <FiUsers /> }, 
    { href: '/admin/finance', label: 'Finance', icon: <FiDollarSign /> },
    { href: '/admin/messages', label: 'Messages', icon: <FiMessageSquare /> },
    { href: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  // Close mobile menu when a link is clicked
  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#FDF7E4] flex font-sans relative overflow-x-hidden">
      
      {/* --- MOBILE OVERLAY (Closes menu when clicked) --- */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:shadow-sm flex flex-col
      `}>
        <div className="p-8 pb-4 flex justify-between items-start">
            <div>
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
               <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-2">Admin Panel</p>
            </div>
            
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="md:hidden text-gray-500 hover:text-red-500 p-1"
            >
               <FiX size={24} />
            </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
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

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
                {/* Hamburger Menu (Mobile Only) */}
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 text-[#003459] hover:bg-gray-100 rounded-lg"
                >
                   <FiMenu size={24} />
                </button>

                <div>
                    <h2 className="text-lg md:text-xl font-extrabold text-[#003459] capitalize tracking-tight truncate max-w-37.5 md:max-w-none">
                        {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium hidden md:block">Overview & Statistics</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#003459]">{session?.user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Super Admin</p>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-yellow-400 border-2 border-white shadow-md flex items-center justify-center font-bold text-[#003459] overflow-hidden shrink-0">
                    {session?.user?.image ? (
                        <Image src={session.user.image} alt="Admin" width={40} height={40} className="object-cover w-full h-full"/>
                    ) : (
                        session?.user?.name?.charAt(0) || 'A'
                    )}
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto overflow-x-hidden">
            {children}
        </main>

        {/* Admin Footer */}
        <footer className="p-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
            &copy; {new Date().getFullYear()} Monito Pets. Admin Panel.
        </footer>
      </div>

    </div>
  );
}