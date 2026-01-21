
import React, { useState, useEffect, useRef } from 'react';
import { HiveEvent, RegistrationForm, FormField } from '../types';
import { useData } from '../context/DataContext';
import { parseMarkdown } from '../utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { AlertCircle, CheckCircle2, QrCode, Ticket, Download, UploadCloud } from 'lucide-react';

interface EventRegistrationProps {
  event: HiveEvent;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState: RegistrationForm = {
  step: 1,
  firstName: '',
  lastName: '',
  email: '',
  studentId: '',
  semester: '1',
  dietary: '',
  agreedToTerms: false,
  agreedToConduct: false,
};

const sanitize = (val: string) => {
  if (typeof val !== 'string') return val;
  return val.replace(/[<>"'/]/g, (m) => ({
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#47;'
  }[m] || m));
};

const EventRegistration: React.FC<EventRegistrationProps> = ({ event, onClose, onSuccess }) => {
  const { getFormConfig } = useData();
  const configFields = getFormConfig(event.id);
  const useCustomForm = configFields && configFields.length > 0;

  // Static Form State
  const [formData, setFormData] = useState<RegistrationForm>(() => {
    const saved = localStorage.getItem(`draft_reg_${event.id}`);
    return saved ? JSON.parse(saved) : initialFormState;
  });

  // Dynamic Form State
  const [dynamicData, setDynamicData] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(`draft_reg_dyn_${event.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [activeAccordion, setActiveAccordion] = useState<string>("item-1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ticketData, setTicketData] = useState<{id: string, qrUrl: string} | null>(null);
  const [alert, setAlert] = useState<{ type: 'destructive' | 'warning', title: string, message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const lastSubmitRef = useRef<number>(0);
  const isWaitlist = event.registeredCount >= event.capacity;

  // Persist Drafts
  useEffect(() => {
    if (!isCompleted) {
        const timer = setInterval(() => {
            if (useCustomForm) {
                localStorage.setItem(`draft_reg_dyn_${event.id}`, JSON.stringify(dynamicData));
            } else {
                localStorage.setItem(`draft_reg_${event.id}`, JSON.stringify(formData));
            }
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [formData, dynamicData, event.id, isCompleted, useCustomForm]);

  // --- Static Form Handlers ---
  const updateField = (field: keyof RegistrationForm, value: any) => {
    const safeValue = typeof value === 'string' ? sanitize(value) : value;
    setFormData(prev => ({ ...prev, [field]: safeValue }));
    if (errors[field]) setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
    if(alert) setAlert(null);
  };

  // --- Dynamic Form Handlers ---
  const updateDynamicField = (fieldId: string, value: any) => {
      // Basic sanitization for strings
      const safeValue = typeof value === 'string' ? sanitize(value) : value;
      setDynamicData(prev => ({ ...prev, [fieldId]: safeValue }));
      
      // Clear error
      if (errors[fieldId]) {
          setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[fieldId];
              return newErrors;
          });
      }
      if(alert) setAlert(null);
  };

  const validateStep = (step: string) => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      if (useCustomForm) {
          // Dynamic Validation
          // Assuming all fields are in "item-1" for now in dynamic mode
          if (step === 'item-1') {
              configFields.forEach(field => {
                  if (field.required) {
                      const val = dynamicData[field.id];
                      if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && !val.trim())) {
                          newErrors[field.id] = `${field.label || 'This field'} is required`;
                      }
                  }
                  // specific type validation could go here (email regex etc)
                  if (field.type === 'email' && dynamicData[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dynamicData[field.id])) {
                      newErrors[field.id] = "Invalid email format";
                  }
              });
          }
      } else {
          // Static Validation
          if (step === 'item-1') {
              if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
              if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
              if (!formData.email.trim()) {
                  newErrors.email = "Email is required";
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                  newErrors.email = "Invalid email format";
              }
          }
          if (step === 'item-2') {
              if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
              else if (formData.studentId.length < 5) newErrors.studentId = "Invalid Student ID format";
          }
          if (step === 'item-4') {
              if (!formData.agreedToTerms) newErrors.agreedToTerms = "Required";
              if (!formData.agreedToConduct) newErrors.agreedToConduct = "Required";
          }
      }

      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          isValid = false;
      }

      return isValid;
  }

  const handleNext = (currentStep: string, nextStep: string) => {
      if(validateStep(currentStep)) {
          setActiveAccordion(nextStep);
          setAlert(null);
      } else {
          setAlert({
              type: 'destructive',
              title: 'Validation Error',
              message: 'Please complete required fields.'
          });
      }
  }

  const handleSubmit = async () => {
    // Final check
    const validationStep = useCustomForm ? 'item-1' : 'item-4';
    if (!validateStep(validationStep)) {
        setAlert({ type: 'destructive', title: 'Action Required', message: 'Please complete all required fields.' });
        return;
    }

    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) {
      setAlert({ type: 'warning', title: 'Rate Limit', message: 'Please wait a moment before submitting again.' });
      return;
    }
    lastSubmitRef.current = now;

    setIsSubmitting(true);
    
    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate Unique Ticket ID
      const uniqueId = `TKT-${event.id.split('_')[1] || 'EVT'}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Determine attendee name for QR
      let attendeeName = "Guest";
      let attendeeId = "N/A";

      if (useCustomForm) {
          // Try to find name fields in dynamic data
          const nameField = configFields.find(f => f.label?.toLowerCase().includes('name'));
          const idField = configFields.find(f => f.label?.toLowerCase().includes('id') || f.label?.toLowerCase().includes('roll'));
          
          if (nameField) attendeeName = dynamicData[nameField.id] || "Guest";
          if (idField) attendeeId = dynamicData[idField.id] || "N/A";
      } else {
          attendeeName = `${formData.firstName} ${formData.lastName}`;
          attendeeId = formData.studentId;
      }

      // QR Code Data
      const qrPayload = JSON.stringify({
          event: event.id,
          ticket: uniqueId,
          attendee: attendeeName,
          id: attendeeId
      });
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`;

      setTicketData({ id: uniqueId, qrUrl });

      // Clean up
      localStorage.removeItem(useCustomForm ? `draft_reg_dyn_${event.id}` : `draft_reg_${event.id}`);
      setIsSubmitting(false);
      setIsCompleted(true);
    } catch (err) {
      setIsSubmitting(false);
      setAlert({
          type: 'destructive',
          title: 'Submission Failed',
          message: 'Network error. Please try again.'
      });
    }
  };

  const getProgress = () => {
    if (isCompleted) return 100;
    if (useCustomForm) {
        // Simple progress for 2-step dynamic form
        return activeAccordion === 'item-final' ? 90 : 50;
    }
    // Static form progress
    if (!activeAccordion) return 20; 
    const parts = activeAccordion.split('-');
    if (parts.length < 2) return 20;
    const step = parseInt(parts[1]);
    return isNaN(step) ? 20 : (step / 5) * 100;
  };

  const InputError = ({ fieldId }: { fieldId: string }) => (
      errors[fieldId] ? <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide mt-1 block animate-in slide-in-from-left-1">{errors[fieldId]}</span> : null
  );

  // Render Helper for Dynamic Fields
  const renderDynamicField = (field: FormField) => {
      const val = dynamicData[field.id];

      switch(field.type) {
          case 'description':
              return (
                  <div 
                    key={field.id} 
                    className="col-span-full prose dark:prose-invert text-sm text-gray-500 dark:text-gray-400 mb-4 whitespace-pre-wrap bg-gray-50 dark:bg-white/5 p-4 rounded-xl"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(field.content || '') }}
                  />
              );
          case 'static_image':
              return (
                  <div key={field.id} className="col-span-full mb-4">
                      {field.label && <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{field.label}</label>}
                      <img src={field.content} alt="Banner" className="w-full h-40 object-cover rounded-xl border border-gray-200 dark:border-white/10" />
                  </div>
              );
          case 'textarea':
              return (
                  <div key={field.id} className="col-span-full">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                          className={`w-full bg-gray-50 dark:bg-white/5 border ${errors[field.id] ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none font-body`}
                          rows={4}
                          placeholder={field.placeholder}
                          value={val || ''}
                          onChange={(e) => updateDynamicField(field.id, e.target.value)}
                      />
                      <InputError fieldId={field.id} />
                  </div>
              );
          case 'select':
              return (
                  <div key={field.id}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <select
                          className={`w-full bg-gray-50 dark:bg-white/5 border ${errors[field.id] ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none font-body`}
                          value={val || ''}
                          onChange={(e) => updateDynamicField(field.id, e.target.value)}
                      >
                          <option value="">-- Select --</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <InputError fieldId={field.id} />
                  </div>
              );
          case 'radio':
              return (
                  <div key={field.id} className="col-span-full">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-4">
                          {field.options?.map(opt => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-lg border border-transparent hover:border-hive-gold transition-colors">
                                  <input 
                                      type="radio" 
                                      name={field.id}
                                      value={opt}
                                      checked={val === opt}
                                      onChange={(e) => updateDynamicField(field.id, e.target.value)}
                                      className="text-hive-gold focus:ring-hive-gold"
                                  />
                                  <span className="text-sm font-body text-gray-700 dark:text-gray-300">{opt}</span>
                              </label>
                          ))}
                      </div>
                      <InputError fieldId={field.id} />
                  </div>
              );
          case 'checkbox':
              if (field.options && field.options.length > 0) {
                  return (
                      <div key={field.id} className="col-span-full space-y-2">
                          {field.label && <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{field.label} {field.required && <span className="text-red-500">*</span>}</label>}
                          {field.options.map(opt => (
                              <div key={opt} className={`p-3 rounded-xl border transition-colors ${errors[field.id] ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-white/5 hover:border-hive-gold'}`}>
                                  <label className="flex items-start gap-3 cursor-pointer">
                                      <input 
                                          type="checkbox" 
                                          checked={val === opt || (Array.isArray(val) && val.includes(opt))}
                                          onChange={(e) => {
                                              if (field.options?.length === 1) {
                                                  updateDynamicField(field.id, e.target.checked ? opt : '');
                                              } else {
                                                  updateDynamicField(field.id, e.target.checked ? opt : ''); 
                                              }
                                          }}
                                          className="mt-1 text-hive-gold focus:ring-hive-gold" 
                                      />
                                      <span className="text-xs text-gray-600 dark:text-gray-300 font-body">{opt}</span>
                                  </label>
                              </div>
                          ))}
                          <InputError fieldId={field.id} />
                      </div>
                  );
              }
              return null;
          case 'file':
          case 'image':
              return (
                  <div key={field.id} className="col-span-full">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:border-hive-gold transition-colors cursor-pointer bg-gray-50 dark:bg-white/5">
                          <input type="file" className="hidden" id={field.id} onChange={(e) => {
                              // Mock file upload
                              if(e.target.files?.[0]) updateDynamicField(field.id, e.target.files[0].name);
                          }}/>
                          <label htmlFor={field.id} className="cursor-pointer flex flex-col items-center">
                              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">{val ? `Selected: ${val}` : `Click to upload ${field.type}`}</span>
                          </label>
                      </div>
                      <InputError fieldId={field.id} />
                  </div>
              );
          default: // Text, Email, Number, Date, Phone, URL
              return (
                  <div key={field.id}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                          type={field.type === 'phone' ? 'tel' : field.type}
                          className={`w-full bg-gray-50 dark:bg-white/5 border ${errors[field.id] ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none font-body text-hive-blue dark:text-white`}
                          placeholder={field.placeholder}
                          value={val || ''}
                          onChange={(e) => updateDynamicField(field.id, e.target.value)}
                      />
                      <InputError fieldId={field.id} />
                  </div>
              );
      }
  };

  // ... (rest of render logic remains same)
  if (isCompleted && ticketData) {
    return (
      <div className="fixed inset-0 z-[120] bg-hive-blue/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0b1129] max-w-md w-full rounded-[3rem] p-8 text-center shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col items-center">
           <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
           <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-2 font-heading">You're In!</h2>
           <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
             Registration confirmed for <strong>{event.title}</strong>.
           </p>
           <div className="bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-6 w-full mb-6 relative">
              <div className="flex flex-col items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                      <img src={ticketData.qrUrl} alt="Event QR" className="w-32 h-32 object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Ticket ID</p>
                      <p className="font-mono text-lg font-bold text-hive-gold tracking-wider">{ticketData.id}</p>
                  </div>
              </div>
           </div>
           <div className="flex flex-col gap-3 w-full">
               <button className="w-full bg-gray-100 dark:bg-white/10 text-hive-blue dark:text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" /> Save Ticket
               </button>
               <button 
                 onClick={onSuccess} 
                 className="w-full bg-hive-blue text-white py-3 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl uppercase tracking-widest text-xs"
               >
                  Done
               </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-hive-blue/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0b1129] max-w-xl w-full rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] border border-white/10">
        
        {/* Header */}
        <div className="p-8 bg-hive-blue text-white flex justify-between items-center relative overflow-hidden shrink-0">
           <div className="absolute inset-0 bg-hive-gold/5"></div>
           <div className="relative z-10">
              <h2 className="font-bold text-xl font-heading">{event.title}</h2>
              <p className="text-[10px] text-hive-gold font-bold uppercase tracking-widest mt-1">
                  {useCustomForm ? 'Event Form' : 'Secure Registration'}
              </p>
           </div>
           <button onClick={onClose} className="hover:text-hive-gold transition-colors text-2xl relative z-10"><i className="fa-solid fa-xmark"></i></button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 px-8 pt-8">
           <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              <span>{useCustomForm ? (activeAccordion === 'item-1' ? 'Form Details' : 'Review') : `Step ${formData.step} of 5`}</span>
              <span className="text-hive-gold">{isWaitlist ? 'Waitlist' : 'Available'}</span>
           </div>
           <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-hive-gold transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,170,13,0.5)]"
                style={{ width: `${getProgress()}%` }}
              ></div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 pb-8 overflow-y-auto flex-grow bg-white dark:bg-transparent custom-scrollbar">
           {alert && (
               <Alert variant={alert.type} className="mb-4">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>{alert.title}</AlertTitle>
                   <AlertDescription>{alert.message}</AlertDescription>
               </Alert>
           )}

           <Accordion type="single" value={activeAccordion} onValueChange={(val) => { if (val) setActiveAccordion(val); }} collapsible className="w-full">
              
              {useCustomForm ? (
                  // --- DYNAMIC FORM ---
                  <>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 w-full">
                                <span>Registration Details</span>
                                {Object.keys(errors).length > 0 && activeAccordion === 'item-1' && <AlertCircle className="w-4 h-4 text-red-500 ml-auto mr-4" />}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                {configFields.map(field => renderDynamicField(field))}
                            </div>
                            <button onClick={() => handleNext('item-1', 'item-final')} className="mt-6 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Review & Submit</button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-final">
                        <AccordionTrigger>Final Review</AccordionTrigger>
                        <AccordionContent>
                            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl space-y-2 mb-4 border border-gray-100 dark:border-white/5">
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Summary</h4>
                                {configFields.filter(f => !['description', 'static_image'].includes(f.type)).map(field => (
                                    <div key={field.id} className="flex justify-between text-xs border-b border-gray-100 dark:border-white/5 pb-1 last:border-0">
                                        <span className="text-gray-500 font-bold">{field.label || 'Field'}:</span>
                                        <span className="font-medium text-hive-blue dark:text-white truncate max-w-[50%] text-right">
                                            {String(dynamicData[field.id] || '-')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting}
                                className="w-full bg-hive-blue text-white py-4 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                            >
                                {isSubmitting ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <Ticket className="w-4 h-4" />}
                                {isWaitlist ? 'Join Waitlist' : 'Complete Registration'}
                            </button>
                        </AccordionContent>
                    </AccordionItem>
                  </>
              ) : (
                  // --- STATIC FALLBACK FORM (Legacy) ---
                  <>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 w-full">
                                <span className={errors.firstName || errors.email ? "text-red-500" : ""}>1. Personal Info</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <input 
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                                    placeholder="First Name *"
                                    value={formData.firstName}
                                    onChange={(e) => updateField('firstName', e.target.value)}
                                />
                                <InputError fieldId="firstName" />
                            </div>
                            <div>
                                <input 
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                                    placeholder="Last Name *"
                                    value={formData.lastName}
                                    onChange={(e) => updateField('lastName', e.target.value)}
                                />
                                <InputError fieldId="lastName" />
                            </div>
                            <div className="sm:col-span-2">
                                <input 
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                                    placeholder="University Email *"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                />
                                <InputError fieldId="email" />
                            </div>
                        </div>
                        <button onClick={() => handleNext('item-1', 'item-2')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Continue</button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>2. Academic Details</AccordionTrigger>
                        <AccordionContent>
                        <div className="space-y-4 pt-2">
                            <div>
                                <input 
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.studentId ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                                    placeholder="Student ID (e.g. BIT-2023-01) *"
                                    value={formData.studentId}
                                    onChange={(e) => updateField('studentId', e.target.value)}
                                />
                                <InputError fieldId="studentId" />
                            </div>
                            <select 
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none"
                                value={formData.semester}
                                onChange={(e) => updateField('semester', e.target.value)}
                            >
                                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <button onClick={() => handleNext('item-2', 'item-3')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Continue</button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>3. Specific Needs (Optional)</AccordionTrigger>
                        <AccordionContent>
                        <textarea 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold resize-none outline-none"
                            rows={3}
                            placeholder="Dietary restrictions or physical access requirements..."
                            value={formData.dietary}
                            onChange={(e) => updateField('dietary', e.target.value)}
                        />
                        <button onClick={() => handleNext('item-3', 'item-4')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Continue</button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>4. Legal & Conduct</AccordionTrigger>
                        <AccordionContent>
                        <div className="space-y-4 pt-2">
                            <div className={`p-3 rounded-xl border transition-colors ${errors.agreedToTerms ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-white/5 hover:border-hive-gold'}`}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.agreedToTerms} onChange={(e) => updateField('agreedToTerms', e.target.checked)} className="mt-1 text-hive-gold focus:ring-hive-gold" />
                                    <span className="text-xs text-gray-600 dark:text-gray-300">I consent to my data being processed for event logistics. *</span>
                                </label>
                            </div>
                            <div className={`p-3 rounded-xl border transition-colors ${errors.agreedToConduct ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-white/5 hover:border-hive-gold'}`}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.agreedToConduct} onChange={(e) => updateField('agreedToConduct', e.target.checked)} className="mt-1 text-hive-gold focus:ring-hive-gold" />
                                    <span className="text-xs text-gray-600 dark:text-gray-300">I agree to the Code of Conduct. *</span>
                                </label>
                            </div>
                        </div>
                        <button onClick={() => handleNext('item-4', 'item-5')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Review Application</button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>5. Final Review</AccordionTrigger>
                        <AccordionContent>
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl space-y-2 mb-4 border border-gray-100 dark:border-white/5">
                            <p className="flex justify-between text-xs"><span className="text-gray-400 font-bold uppercase">Name:</span> <span className="font-medium text-hive-blue dark:text-white">{formData.firstName} {formData.lastName}</span></p>
                            <p className="flex justify-between text-xs"><span className="text-gray-400 font-bold uppercase">ID:</span> <span className="font-medium text-hive-blue dark:text-white">{formData.studentId}</span></p>
                            <p className="flex justify-between text-xs"><span className="text-gray-400 font-bold uppercase">Status:</span> <span className={isWaitlist ? 'text-orange-500 font-bold' : 'text-green-500 font-bold'}>{isWaitlist ? 'Waitlist' : 'Confirmed'}</span></p>
                        </div>
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting}
                            className="w-full bg-hive-blue text-white py-4 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <Ticket className="w-4 h-4" />}
                            {isWaitlist ? 'Secure Waitlist Spot' : 'Generate Ticket'}
                        </button>
                        </AccordionContent>
                    </AccordionItem>
                  </>
              )}

           </Accordion>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
