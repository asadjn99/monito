'use client';

import React from 'react';
import { FiMapPin, FiPhone, FiMail,  FiSend } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDF7E4] py-12 px-4 md:px-8 font-sans flex items-center justify-center">
      
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-175">
        
        {/* --- LEFT: INFO SIDEBAR (Blue) --- */}
        <div className="w-full md:w-2/5 bg-[#003459] p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
           {/* Decorative Circle */}
           <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>

           <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Lets Chat!</h2>
              <p className="text-blue-200 mb-12 leading-relaxed">
                 Have questions about a puppy? Need advice on pet care? Or just want to say hi? We would love to hear from you.
              </p>

              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-xl backdrop-blur-sm">
                       <FiMapPin />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg">Visit Us</h3>
                       <p className="text-blue-100 text-sm">123 Pet Street, IT PArk<br/>Peshawar, 25000</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-xl backdrop-blur-sm">
                       <FiMail />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg">Email Us</h3>
                       <p className="text-blue-100 text-sm">hello@monito.com<br/>support@monito.com</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-xl backdrop-blur-sm">
                       <FiPhone />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg">Call Us</h3>
                       <p className="text-blue-100 text-sm">+92 (307) 599-3029<br/>24/7</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Socials at bottom */}
           <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-blue-200 mb-4">Follow our journey:</p>
              <div className="flex gap-4">
                 {['FB', 'IG', 'TW', 'YT'].map((social, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#003459] cursor-pointer transition-all">
                       <span className="text-xs font-bold">{social}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* --- RIGHT: FORM SECTION --- */}
        <div className="w-full md:w-3/5 p-10 md:p-16 bg-white">
           <form className="space-y-6 max-w-lg mx-auto md:mx-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] focus:bg-white transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] focus:bg-white transition-all" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] focus:bg-white transition-all text-gray-600">
                    <option>I want to adopt a pet</option>
                    <option>Question about a product</option>
                    <option>General Inquiry</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                 <textarea rows={5} placeholder="Tell us how we can help..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] focus:bg-white transition-all resize-none"></textarea>
              </div>

              <button className="w-full bg-[#003459] text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 group">
                 Send Message <FiSend className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>
        </div>

      </div>
    </div>
  );
}