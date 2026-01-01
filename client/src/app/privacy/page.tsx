'use client';

import React from 'react';
import Link from 'next/link';
import { FiLock, FiEye, FiDatabase, FiGlobe } from 'react-icons/fi';

export default function PrivacyPage() {
  return (
    <div className="bg-[#FDF7E4] min-h-screen font-sans py-12 px-4 md:px-8">
      
      <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-[#003459] p-8 md:p-12 text-white text-center relative overflow-hidden">
           <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
              <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                 Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-70">Effective Date: January 1, 2026</p>
           </div>
           
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>

        {/* CONTENT */}
        <div className="p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">
           
           <p className="text-lg font-medium text-[#003459]">
              At Monito, we are committed to maintaining the trust and confidence of our visitors. We do not sell, rent or trade email lists with other companies and businesses for marketing purposes.
           </p>

           <Section title="1. Information We Collect" icon={<FiDatabase />}>
              <p className="mb-4">
                 We collect information to provide better services to all our users. This includes:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                 <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <strong className="block text-[#003459] mb-1">Personal Info</strong>
                    Name, email address, phone number, and shipping address when you make a purchase.
                 </li>
                 <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <strong className="block text-[#003459] mb-1">Payment Data</strong>
                    Payment details are processed securely by our payment partners; we do not store full credit card numbers.
                 </li>
              </ul>
           </Section>

           <Section title="2. How We Use Information" icon={<FiEye />}>
              <p>
                 We use the information we collect to operate, maintain, and improve our services. Specifically:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                 <li>To process transactions and send related information, including confirmations and invoices.</li>
                 <li>To send you technical notices, updates, security alerts, and support messages.</li>
                 <li>To respond to your comments, questions, and requests.</li>
              </ul>
           </Section>

           <Section title="3. Data Security" icon={<FiLock />}>
              <p>
                 We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. All sensitive data is transmitted via Secure Socket Layer (SSL) technology.
              </p>
           </Section>

           <Section title="4. Cookies & Tracking" icon={<FiGlobe />}>
              <p>
                 We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. You can choose to disable cookies through your individual browser options.
              </p>
           </Section>

           {/* Footer Note */}
           <div className="border-t border-gray-100 pt-8 mt-8">
              <p className="text-sm text-gray-500 text-center">
                 Monito Pets Inc.<br/>
                 123 Pet Street, Peshawar, Pakistan<br/>
                 <Link href="/contact" className="text-[#003459] font-bold hover:underline">Contact Privacy Officer</Link>
              </p>
           </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component for Sections
const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="space-y-3">
     <div className="flex items-center gap-3 text-[#003459]">
        <div className="text-xl bg-blue-50 p-2 rounded-lg">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
     </div>
     <div className="pl-0 md:pl-12 text-sm md:text-base">
        {children}
     </div>
  </div>
);