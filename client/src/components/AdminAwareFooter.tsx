'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer'; // Import your existing Public Footer

const AdminAwareFooter = () => {
  const pathname = usePathname();

  // If the URL starts with "/admin", DO NOT show the public footer
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Otherwise, show the normal website footer
  return <Footer />;
};

export default AdminAwareFooter;