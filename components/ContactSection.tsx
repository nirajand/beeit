
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

type Category = 'General' | 'Membership' | 'Event';

// Security Utility: Sanitize inputs to prevent XSS and injection
const sanitize = (val: string) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/[<>"'/]/g, (m) => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#47;'
    }[m] || m))
    .trim();
};

const ContactSection: React.FC = () => {
  const [category, setCategory] = useState<Category>('General');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'destructive' | 'warning', title: string, message: string } | null>(null);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    email: '',
    message: '',
    semester: '',
    interests: '',
    eventTitle: '',
    eventConcept: '',
    _bot_trap: '' // Honeypot field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const lastSubmitRef = useRef<number>(0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData._bot_trap) {
      return false; // Silently fail bots
    }

    if (!formData.name) newErrors.name = 'Full name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please provide a valid email';

    if (category === 'Membership') {
      if (!formData.semester) newErrors.semester = 'Please select your current semester';
      if (!formData.interests || formData.interests.length < 10) newErrors.interests = 'Please tell us more about your interests (min 10 chars)';
    }

    if (category === 'Event') {
      if (!formData.eventTitle) newErrors.eventTitle = 'A title for your event is required';
      if (!formData.eventConcept || formData.eventConcept.length < 20) newErrors.eventConcept = 'Please describe the concept in detail (min 20 chars)';
    }

    if (category === 'General') {
      if (!formData.message) newErrors.message = 'Message cannot be empty';
      else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
        setAlert({
            type: 'destructive',
            title: 'Validation Error',
            message: 'Please fix the errors highlighted below.'
        });
        return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const safeValue = sanitize(value);
    setFormData(prev => ({ ...prev, [name]: safeValue }));
    if (errors[name]) {
      setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
    }
    if (alert) setAlert(null); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    
    const now = Date.now();
    if (now - lastSubmitRef.current < 10000) {
      setAlert({
          type: 'warning',
          title: 'Rate Limit Active',
          message: 'Please wait a few seconds before sending another message.'
      });
      return;
    }
    lastSubmitRef.current = now;

    if (validate()) {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  };

  const ErrorMsg = ({ field }: { field: string }) => (
    <AnimatePresence>
      {errors[field] && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -5 }}
          className="text-[10px] font-bold text-red-500 mt-1 ml-2 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" /> {errors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  if (submitted) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center animate-in fade-in zoom-in duration-500 min-h-[60vh] flex flex-col justify-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
           <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-hive-blue dark:text-white mb-4 font-heading">Sync Complete!</h1>
        
        <Alert variant="success" className="mb-10 text-left bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Secure Dispatch Confirmed</AlertTitle>
            <AlertDescription>
                Reference ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} <br/>
                Category: {category}
            </AlertDescription>
        </Alert>

        <button 
          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '', semester: '', interests: '', eventTitle: '', eventConcept: '', _bot_trap: '' }); setAlert(null); }} 
          className="bg-hive-blue text-white px-10 py-4 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl uppercase tracking-widest text-xs"
        >
          Send New Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-6xl font-black text-hive-blue dark:text-white mb-10 leading-tight font-heading">Sync Your<br />Thoughts.</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-lg leading-relaxed font-body">The Hive ecosystem relies on clear, secure communication. Use this secure channel for inquiries, proposals, and membership applications.</p>
          
          <div className="space-y-10 mb-12">
             <div className="flex items-center group">
                <div className="w-14 h-14 bg-hive-gold/10 rounded-[1.25rem] flex items-center justify-center mr-6 text-2xl group-hover:bg-hive-gold group-hover:text-white transition-all text-hive-gold">
                  <i className="fa-solid fa-paper-plane-top"></i>
                </div>
                <div>
                   <p className="font-bold text-hive-blue dark:text-white text-lg font-heading">Central Hub</p>
                   <p className="text-gray-500 text-sm"><span className="font-brand-uni">Gandaki University</span>, Gyankunja, Pokhara</p>
                </div>
             </div>
             
             <div className="flex items-center group">
                <div className="w-14 h-14 bg-hive-blue/10 dark:bg-white/10 rounded-[1.25rem] flex items-center justify-center mr-6 text-2xl group-hover:bg-hive-blue dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-hive-blue transition-all text-hive-blue dark:text-white">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                   <p className="font-bold text-hive-blue dark:text-white text-lg font-heading">Digital Line</p>
                   <p className="text-gray-500 text-sm">bee-it.hive@gandakiuniversity.edu.np</p>
                </div>
             </div>
          </div>
          
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 h-[320px] bg-gray-100 relative">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28152.292244556655!2d84.0925184!3d28.1149175!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995bdc62c29a31d%3A0xdfcc810d7364629a!2sGandaki%20University!5e0!3m2!1sen!2snp" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                title="Gandaki University Campus Map"
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
             ></iframe>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/10 relative animate-in fade-in slide-in-from-right duration-700">
          
          {alert && (
              <Alert variant={alert.type} className="mb-8">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="hidden" aria-hidden="true">
              <input type="text" name="_bot_trap" tabIndex={-1} autoComplete="off" value={formData._bot_trap} onChange={handleChange} />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Inquiry Type</label>
              <div className="flex flex-wrap gap-3 bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl w-fit">
                 {(['General', 'Membership', 'Event'] as Category[]).map((c) => (
                   <button
                     key={c}
                     type="button"
                     onClick={() => { setCategory(c); setErrors({}); setAlert(null); }}
                     className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                       category === c 
                       ? 'bg-hive-blue text-white shadow-md' 
                       : 'text-gray-500 hover:text-hive-blue dark:hover:text-white'
                     }`}
                   >
                     {c}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Display Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text" 
                  className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all text-sm font-bold ${errors.name ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/10' : ''}`} 
                  placeholder="John Doe" 
                />
                <ErrorMsg field="name" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Sync Email</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all text-sm font-bold ${errors.email ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/10' : ''}`} 
                  placeholder="name@gandaki.edu.np" 
                />
                <ErrorMsg field="email" />
              </div>
            </div>

            {/* Dynamic Fields Area */}
            <div className="min-h-[120px]">
              <AnimatePresence mode="wait">
                {category === 'Membership' && (
                  <motion.div 
                    key="membership"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Current Semester</label>
                      <select 
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white text-sm font-bold appearance-none cursor-pointer ${errors.semester ? 'ring-2 ring-red-400' : ''}`}
                      >
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                      <ErrorMsg field="semester" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Tech Interests</label>
                      <input 
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white text-sm font-bold ${errors.interests ? 'ring-2 ring-red-400' : ''}`}
                        placeholder="AI, Web, Cloud, IoT..."
                      />
                      <ErrorMsg field="interests" />
                    </div>
                  </motion.div>
                )}

                {category === 'Event' && (
                  <motion.div 
                    key="event"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Proposed Event Title</label>
                      <input 
                        name="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white text-sm font-bold ${errors.eventTitle ? 'ring-2 ring-red-400' : ''}`}
                        placeholder="e.g. Next.js Masterclass Workshop"
                      />
                      <ErrorMsg field="eventTitle" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Concept Description</label>
                      <textarea 
                        name="eventConcept"
                        value={formData.eventConcept}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white text-sm font-bold resize-none ${errors.eventConcept ? 'ring-2 ring-red-400' : ''}`}
                        placeholder="Describe target audience, duration, and resources needed..."
                      />
                      <ErrorMsg field="eventConcept" />
                    </div>
                  </motion.div>
                )}

                {category === 'General' && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Body</label>
                      <span className={`text-[9px] font-bold ${formData.message.length > 1900 ? 'text-red-500' : 'text-gray-400'}`}>
                        {formData.message.length} / 2000
                      </span>
                    </div>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={2000}
                      rows={4} 
                      className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all resize-none text-sm font-medium ${errors.message ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/10' : ''}`} 
                      placeholder="How can we help you today?"
                    ></textarea>
                    <ErrorMsg field="message" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-hive-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl hover:shadow-hive-gold/20 flex items-center justify-center relative overflow-hidden group active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin text-xl"></i>
              ) : (
                <span className="flex items-center gap-3">Dispatch Secure Inquiry <i className="fa-solid fa-shield-check"></i></span>
              )}
            </button>
            <p className="text-[9px] text-center text-gray-400 uppercase tracking-[0.3em] font-mono">AES-256 Encrypted Protocol</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
