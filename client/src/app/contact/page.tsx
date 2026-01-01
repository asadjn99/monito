'use client';

import React, { useState } from 'react';
import { 
  FiMapPin, FiPhone, FiMail, FiSend, FiCheckCircle, FiLoader, 
  FiHelpCircle, FiChevronDown, FiFacebook, FiInstagram, FiTwitter 
} from 'react-icons/fi';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: 'General Inquiry', message: ''
  });

  // Toggle for Mobile FAQ (optional, but good for interactivity)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        setTimeout(() => setSuccess(false), 5000); 
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const faqs = [
    { question: "Do you ship pets internationally?", answer: "Yes! We have a safe and verified travel nanny program to deliver pets worldwide." },
    { question: "Are the pets health checked?", answer: "Absolutely. Every pet comes with a 100% health guarantee and vet certification." },
    { question: "Can I visit the store?", answer: "We love visitors! Please book an appointment using the form above to ensure we are available." },
  ];

  return (
    <div className="min-h-screen bg-[#FDF7E4] font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="pt-16 pb-12 text-center px-4">
         <p className="text-[#003459] font-bold tracking-widest uppercase text-sm mb-2">Support Center</p>
         <h1 className="text-4xl md:text-5xl font-extrabold text-[#003459] mb-4">How can we help?</h1>
         <p className="text-gray-600 max-w-xl mx-auto">
            Whether you are looking to adopt, have questions about shipping, or just want to say hello, our team is ready to answer.
         </p>
      </div>

      <div className="pb-20 px-4 flex flex-col items-center">
        
        {/* --- MAIN CONTACT CARD --- */}
        <div className="max-w-5xl w-full bg-white rounded-4xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-137.5 mb-16 relative z-10">
          
          {/* --- LEFT: INFO SIDEBAR --- */}
          <div className="w-full md:w-5/12 bg-[#003459] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
             
             {/* Content */}
             <div className="relative z-10 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Contact Info</h2>
                  <p className="text-blue-200 text-sm opacity-90">We are open Mon-Fri, 9am - 6pm.</p>
                </div>

                <div className="space-y-6">
                   <ContactItem icon={<FiMapPin />} title="Headquarters" text="123 Pet Street, Peshawar" />
                   <ContactItem icon={<FiMail />} title="Email Support" text="support@monito.com" />
                   <ContactItem icon={<FiPhone />} title="Phone" text="+92 (307) 599-3029" />
                </div>

                {/* Social Icons */}
                <div className="flex gap-4 pt-4">
                   {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#003459] cursor-pointer transition-all">
                         <Icon />
                      </div>
                   ))}
                </div>
             </div>

             {/* Visual Map Decorator (Bottom)
             <div className="absolute bottom-0 left-0 w-full h-32 bg-white/5 backdrop-blur-sm mt-8 border-t border-white/10 flex items-center justify-center">
                 <div className="text-center opacity-50">
                    <FiMapPin className="mx-auto text-2xl mb-1" />
                    <span className="text-xs uppercase tracking-widest">Map View Unavailable</span>
                 </div>
             </div> */}

             {/* Decorative Blobs */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* --- RIGHT: FORM --- */}
          <div className="w-full md:w-7/12 p-8 md:p-12 bg-white relative">
             {success ? (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm">
                    <FiCheckCircle />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003459] mb-2">Message Sent!</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mb-8">Thank you for reaching out. A team member will get back to you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="px-6 py-2 rounded-full border-2 border-[#003459] text-[#003459] font-bold hover:bg-[#003459] hover:text-white transition-all text-sm">
                    Send another message
                  </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-5 h-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-5">
                     <InputGroup label="Your Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                     <InputGroup label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subject</label>
                     <div className="relative">
                        <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] text-sm text-gray-700 appearance-none cursor-pointer">
                           <option>General Inquiry</option>
                           <option>Adoption Question</option>
                           <option>Shipping & Delivery</option>
                           <option>Partnership</option>
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Message</label>
                     <textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Tell us more about what you're looking for..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] text-sm resize-none"></textarea>
                  </div>

                  <button disabled={loading} className="w-full bg-[#003459] text-white py-4 rounded-xl font-bold hover:bg-[#002a48] transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group disabled:opacity-70 mt-2">
                     {loading ? <FiLoader className="animate-spin text-xl"/> : <>Send Message <FiSend className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
               </form>
             )}
          </div>

        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-4xl w-full">
           <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#003459]">Frequently Asked Questions</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 bg-[#FDF7E4] rounded-full flex items-center justify-center text-[#003459] text-xl mb-4">
                      <FiHelpCircle />
                   </div>
                   <h4 className="font-bold text-[#003459] mb-2">{faq.question}</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}

// Sub-components
const ContactItem = ({ icon, title, text }: any) => (
  <div className="flex items-center gap-4 group">
     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-lg backdrop-blur-sm group-hover:bg-white group-hover:text-[#003459] transition-colors">
        {icon}
     </div>
     <div>
        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">{title}</p>
        <p className="text-sm font-semibold">{text}</p>
     </div>
  </div>
);

const InputGroup = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
     <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
     <input {...props} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003459] transition-all text-sm focus:bg-white" />
  </div>
);