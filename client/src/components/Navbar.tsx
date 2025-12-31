// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { useState } from 'react';
// import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
// import { BsChevronDown } from 'react-icons/bs';
// import { useSession, signOut } from 'next-auth/react'; // 1. Import Hooks

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   // 2. GET REAL DATA FROM SESSION
//   const { data: session } = useSession();
//   const user = session?.user; // This will be null if not logged in, or contain the admin user

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

//   const linkStyle = "relative cursor-pointer text-blue-900 font-bold transition-all duration-300 hover:text-blue-900 hover:opacity-90 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-900 after:transition-all after:duration-300 hover:after:w-full";

//   return (
//     <nav className="bg-transparent py-2 px-6 md:px-20 relative z-50">
//       <div className="container mx-auto flex justify-between items-center">
        
//         {/* Logo */}
//         <Link href="/" className="cursor-pointer group">
//           <div className="relative w-20 h-7 md:w-28 md:h-9 transition-transform duration-300 group-hover:scale-105">
//             <Image
//               src="/images/logo.png"
//               alt="Monito Logo"
//               fill
//               className="object-contain"
//               priority
//               sizes="(max-width: 768px) 100px, 150px"
//             />
//           </div>
//         </Link>

//         {/* Desktop Links */}
//         <ul className="hidden md:flex gap-8 font-bold text-base items-center">
//           <li><Link href="/" className={linkStyle}>Home</Link></li>
//           <li><Link href="/pets" className={linkStyle}>Category</Link></li>
//           <li><Link href="/about" className={linkStyle}>About</Link></li>
//           <li><Link href="/contact" className={linkStyle}>Contact</Link></li>
          
//           {/* 3. SECURE ADMIN LINK: Only visible if REAL role is admin */}
//           {user?.role === 'admin' && (
//              <li>
//                 <Link href="/admin/dashboard" className={`${linkStyle} text-red-600 after:bg-red-600 hover:text-red-600 hover:opacity-90`}>
//                     Admin Panel
//                 </Link>
//              </li>
//           )}
//         </ul>

//         {/* Desktop Actions */}
//         <div className="hidden md:flex items-center gap-6">
//           <div className="relative group">
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg transition-colors group-hover:text-blue-900" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-6 py-2 rounded-full border border-gray-300 bg-white text-sm w-56 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all duration-300 group-hover:shadow-md cursor-text"
//             />
//           </div>

//           {/* User Profile / Login Button */}
//           {user ? (
//             <div className="relative">
//               <button 
//                 onClick={toggleProfile}
//                 className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
//               >
//                 <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-blue-900 transition-all">
//                    {user.image ? (
//                      <Image src={user.image} alt="User" width={40} height={40} className="object-cover" />
//                    ) : (
//                      <span className="font-bold text-lg">{user.name?.charAt(0) || 'U'}</span>
//                    )}
//                 </div>
//                 <div className="text-left hidden lg:block">
//                     <p className="text-sm font-bold text-blue-900 leading-none">{user.name}</p>
//                     <p className="text-xs text-gray-500 font-medium capitalize">{user.role}</p>
//                 </div>
//                 <BsChevronDown className={`text-blue-900 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {isProfileOpen && (
//                  <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
//                     <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-400">
//                       Signed in as <br/> <span className="font-bold text-blue-900">{user.email}</span>
//                     </div>
//                     {user.role === 'admin' && (
//                       <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-900 transition-colors cursor-pointer">
//                           <FiSettings className="text-lg"/> Dashboard
//                       </Link>
//                     )}
//                     {/* 4. REAL LOGOUT FUNCTION */}
//                     <button 
//                         onClick={() => signOut({ callbackUrl: '/' })}
//                         className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left"
//                     >
//                         <FiLogOut className="text-lg"/> Logout
//                     </button>
//                  </div>
//               )}
//             </div>
//           ) : (
//             <Link href="/login">
//                 <button className="bg-blue-900 text-white border-2 border-blue-900 px-6 py-2 rounded-full font-bold text-sm cursor-pointer transition-all duration-300 hover:bg-white hover:text-blue-900 hover:opacity-90 hover:scale-105 hover:shadow-xl active:scale-95">
//                     Join the community
//                 </button>
//             </Link>
//           )}

//           <div className="flex items-center gap-1 font-bold text-blue-900 cursor-pointer hover:opacity-90 transition-opacity">
//             <span>PKR</span>
//             <BsChevronDown className="text-xs stroke-2" />
//           </div>
//         </div>

//         {/* Mobile Toggle */}
//         <div className="md:hidden flex items-center gap-4">
//             <FiSearch className="text-2xl text-blue-900 cursor-pointer hover:scale-110 transition-transform duration-300" />
//             <button onClick={toggleMenu} className="focus:outline-none cursor-pointer p-1">
//                 {isMenuOpen ? <FiX className="text-3xl text-blue-900" /> : <FiMenu className="text-3xl text-blue-900" />}
//             </button>
//         </div>
//       </div>
      
//       {/* Mobile Menu logic remains similar... ensure you update the 'user' check there too! */}
//     </nav>
//   );
// };

// export default Navbar;
























'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiShoppingBag } from 'react-icons/fi';
import { BsChevronDown } from 'react-icons/bs';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/src/context/CartContext'; // 👈 IMPORT CART CONTEXT

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 1. Get Cart Data
  const { cartCount } = useCart();

  // 2. Get Session Data
  const { data: session } = useSession();
  const user = session?.user;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const linkStyle = "relative cursor-pointer text-blue-900 font-bold transition-all duration-300 hover:text-blue-900 hover:opacity-90 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-900 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <nav className="bg-transparent py-2 px-6 md:px-20 relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="cursor-pointer group">
          <div className="relative w-20 h-7 md:w-28 md:h-9 transition-transform duration-300 group-hover:scale-105">
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

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 font-bold text-base items-center">
          <li><Link href="/" className={linkStyle}>Home</Link></li>
          <li><Link href="/pets" className={linkStyle}>Category</Link></li>
          <li><Link href="/about" className={linkStyle}>About</Link></li>
          <li><Link href="/contact" className={linkStyle}>Contact</Link></li>
          
          {user?.role === 'admin' && (
             <li>
                <Link href="/admin/dashboard" className={`${linkStyle} text-red-600 after:bg-red-600 hover:text-red-600 hover:opacity-90`}>
                    Admin Panel
                </Link>
             </li>
          )}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg transition-colors group-hover:text-blue-900" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-6 py-2 rounded-full border border-gray-300 bg-white text-sm w-56 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all duration-300 group-hover:shadow-md cursor-text"
            />
          </div>

          {/* 🛒 SHOPPING CART ICON (NEW) */}
          <Link href="/checkout" className="relative text-blue-900 hover:text-blue-700 transition-transform hover:scale-110">
             <FiShoppingBag className="text-2xl" />
             {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FDF7E4]">
                    {cartCount}
                </span>
             )}
          </Link>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button 
                onClick={toggleProfile}
                className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-blue-900 transition-all">
                   {user.image ? (
                     <Image src={user.image} alt="User" width={40} height={40} className="object-cover" />
                   ) : (
                     <span className="font-bold text-lg">{user.name?.charAt(0) || 'U'}</span>
                   )}
                </div>
                <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold text-blue-900 leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 font-medium capitalize">{user.role}</p>
                </div>
                <BsChevronDown className={`text-blue-900 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                 <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-400">
                      Signed in as <br/> <span className="font-bold text-blue-900">{user.email}</span>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-900 transition-colors cursor-pointer">
                          <FiSettings className="text-lg"/> Dashboard
                      </Link>
                    )}
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                        <FiLogOut className="text-lg"/> Logout
                    </button>
                 </div>
              )}
            </div>
          ) : (
            <Link href="/login">
                <button className="bg-blue-900 text-white border-2 border-blue-900 px-6 py-2 rounded-full font-bold text-sm cursor-pointer transition-all duration-300 hover:bg-white hover:text-blue-900 hover:opacity-90 hover:scale-105 hover:shadow-xl active:scale-95">
                    Join the community
                </button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Icon */}
            <Link href="/checkout" className="relative text-blue-900">
                <FiShoppingBag className="text-2xl" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount}
                    </span>
                )}
            </Link>

            <button onClick={toggleMenu} className="focus:outline-none cursor-pointer p-1">
                {isMenuOpen ? <FiX className="text-3xl text-blue-900" /> : <FiMenu className="text-3xl text-blue-900" />}
            </button>
        </div>
      </div>
      
      {/* Mobile Menu Logic... */}
    </nav>
  );
};

export default Navbar;