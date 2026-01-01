'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiMenu, FiX, FiLogOut, FiSettings, FiShoppingBag, FiUser, FiChevronDown } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/src/context/CartContext'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 1. Get Cart Data
  // Ensure your Context provides 'cart' array so we can count length
  const { cart } = useCart();
  const cartCount = cart ? cart.length : 0;

  // 2. Get Session Data
  const { data: session } = useSession();
  const user = session?.user;

  // Toggle Handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  // Close menus when route changes or clicking outside
  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const linkStyle = "relative cursor-pointer text-blue-900 font-bold transition-all duration-300 hover:text-blue-900 hover:opacity-90 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-900 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <>
      {/* OVERLAY FOR MOBILE MENU / DROPDOWNS */}
      {(isMenuOpen || isProfileOpen) && (
        <div onClick={closeAll} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" />
      )}

      <nav className="bg-transparent py-3 px-6 md:px-20 relative z-50">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* --- LOGO --- */}
          <Link href="/" className="cursor-pointer group relative z-50">
            <div className="relative w-24 h-8 md:w-32 md:h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Monito Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100px, 150px"
              />
            </div>
          </Link>

          {/* --- DESKTOP LINKS --- */}
          <ul className="hidden lg:flex gap-8 font-bold text-base items-center text-blue-900">
            <li><Link href="/" className={linkStyle}>Home</Link></li>
            <li><Link href="/pets" className={linkStyle}>Browse Pets</Link></li>
            <li><Link href="/about" className={linkStyle}>About</Link></li>
            <li><Link href="/contact" className={linkStyle}>Contact</Link></li>
          </ul>

          {/* --- DESKTOP ACTIONS --- */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Search Bar */}
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-hover:text-blue-900" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-6 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm w-64 focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-900 transition-all duration-300 group-hover:shadow-sm"
              />
            </div>

            {/* 🛒 DESKTOP CART ICON */}
            <Link href="/checkout" className="relative p-2 text-blue-900 hover:text-blue-700 transition-transform hover:scale-110">
               <FiShoppingBag className="text-2xl" />
               {cartCount > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform translate-x-1 -translate-y-1 animate-in zoom-in">
                    {cartCount}
                 </span>
               )}
            </Link>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center gap-3 cursor-pointer focus:outline-none group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-blue-900 transition-all shadow-sm">
                     {user.image ? (
                       <Image src={user.image} alt="User" width={40} height={40} className="object-cover w-full h-full" />
                     ) : (
                       <span className="font-bold text-lg">{user.name?.charAt(0).toUpperCase() || <FiUser/>}</span>
                     )}
                  </div>
                  <div className="text-left hidden xl:block">
                      <p className="text-sm font-bold text-blue-900 leading-none">{user.name?.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-500 font-medium capitalize mt-0.5">{user.role || 'Member'}</p>
                  </div>
                  <FiChevronDown className={`text-blue-900 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                   <div className="absolute right-0 top-full mt-4 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="font-bold text-blue-900 truncate" title={user.email || ''}>{user.email}</p>
                      </div>
                      
                      {/* Admin Link */}
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors">
                            <FiSettings className="text-lg"/> Admin Dashboard
                        </Link>
                      )}
                      
                      <Link href="/my-orders" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors">
                          <FiShoppingBag className="text-lg"/> My Orders
                      </Link>

                      <div className="h-px bg-gray-100 my-1 mx-4"></div>

                      <button 
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                          <FiLogOut className="text-lg"/> Sign Out
                      </button>
                   </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                  <button className="bg-blue-900 text-white border-2 border-blue-900 px-7 py-2.5 rounded-full font-bold text-sm cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-blue-900 hover:shadow-lg active:scale-95">
                      Join the community
                  </button>
              </Link>
            )}
          </div>

          {/* --- MOBILE TOGGLES --- */}
          <div className="lg:hidden flex items-center gap-5 z-50">
             
             {/* Mobile Cart */}
             <Link href="/checkout" className="relative text-blue-900 p-1">
                 <FiShoppingBag className="text-2xl" />
                 {cartCount > 0 && (
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                         {cartCount}
                     </span>
                 )}
             </Link>

             <button onClick={toggleMenu} className="focus:outline-none p-1 text-blue-900 hover:text-blue-700 transition">
                 {isMenuOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
             </button>
          </div>

        </div>

        {/* --- MOBILE MENU DRAWER --- */}
        <div className={`fixed inset-x-0 top-0 pt-24 pb-10 bg-white shadow-2xl lg:hidden transition-all duration-500 ease-in-out z-40 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
           <div className="container mx-auto px-6 flex flex-col gap-6">
              
              {/* Search Mobile */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search pets..." className="w-full pl-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-900" />
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-4 text-lg font-bold text-blue-900">
                 <li><Link href="/" onClick={closeAll} className="block py-2 border-b border-gray-100">Home</Link></li>
                 <li><Link href="/pets" onClick={closeAll} className="block py-2 border-b border-gray-100">Category</Link></li>
                 <li><Link href="/about" onClick={closeAll} className="block py-2 border-b border-gray-100">About</Link></li>
                 <li><Link href="/contact" onClick={closeAll} className="block py-2 border-b border-gray-100">Contact</Link></li>
                 {user?.role === 'admin' && (
                    <li><Link href="/admin" onClick={closeAll} className="block py-2 text-red-600">Admin Panel</Link></li>
                 )}
              </ul>

              {/* Mobile Auth Actions */}
              {user ? (
                 <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                          {user.image ? <Image src={user.image} alt="U" width={48} height={48}/> : <span className="font-bold text-xl text-blue-900">{user.name?.charAt(0)}</span>}
                       </div>
                       <div>
                          <p className="font-bold text-blue-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                       </div>
                    </div>
                    <button onClick={() => signOut()} className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                       <FiLogOut/> Sign Out
                    </button>
                 </div>
              ) : (
                 <Link href="/login" onClick={closeAll}>
                    <button className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold shadow-lg">
                       Join the Community
                    </button>
                 </Link>
              )}
           </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;