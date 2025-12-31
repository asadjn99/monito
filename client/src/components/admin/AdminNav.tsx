import Link from 'next/link';
import React from 'react';

const AdminNav = () => {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold">Monito Admin</h1>
          <div className="hidden md:flex space-x-4">
            {/* 👇 FIXED: Closing tags are now correct */}
            <Link href="/admin" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link href="/admin/add-pet" className="hover:text-blue-200 transition">
              Add Pet
            </Link>
          </div>
        </div>
        <div>
            <Link href="/" className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition">
               Back to Website
            </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;