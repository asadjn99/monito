'use client';

import React from 'react';
import Link from 'next/link';
import { FiShield, FiAlertCircle, FiCheckSquare, FiFileText } from 'react-icons/fi';

export default function TermsPage() {
  return (
    <div className="bg-[#FDF7E4] min-h-screen font-sans py-12 px-4 md:px-8">
      
      <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-[#003459] p-8 md:p-12 text-white text-center relative overflow-hidden">
           <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Terms of Service</h1>
              <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                 Please read these terms carefully before using our services. By accessing Monito, you agree to be bound by these terms.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-70">Last Updated: January 2026</p>
           </div>
           
           {/* Decor */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        {/* CONTENT */}
        <div className="p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">
           
           <Section title="1. Acceptance of Terms" icon={<FiCheckSquare />}>
              <p>
                 By accessing and using the Monito website ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
           </Section>

           <Section title="2. Pet Adoption & Sales" icon={<FiFileText />}>
              <p className="mb-4">
                 All pet sales are final unless otherwise stated in our Health Guarantee. We reserve the right to refuse adoption to any individual if we believe the home environment is unsuitable for the animal.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <li><strong>Health Check:</strong> All pets are vetted before sale.</li>
                 <li><strong>Age Requirement:</strong> You must be at least 18 years old to adopt.</li>
                 <li><strong>Shipping:</strong> We use third-party nannies for delivery; schedules are subject to change.</li>
              </ul>
           </Section>

           <Section title="3. User Responsibilities" icon={<FiAlertCircle />}>
              <p>
                 You agree not to use the Service for any unlawful purpose. You are responsible for maintaining the confidentiality of your account password and are responsible for all activities that occur under your account.
              </p>
           </Section>

           <Section title="4. Limitation of Liability" icon={<FiShield />}>
              <p>
                 Monito shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
           </Section>

           {/* Footer Note */}
           <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-[#003459]">
              <p className="font-bold mb-2">Questions regarding these terms?</p>
              <p>
                 If you have any questions about these Terms, please contact us at <Link href="/contact" className="underline font-bold hover:text-blue-600">support@monito.com</Link>.
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
        <div className="text-xl">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
     </div>
     <div className="pl-0 md:pl-8 text-sm md:text-base">
        {children}
     </div>
  </div>
);