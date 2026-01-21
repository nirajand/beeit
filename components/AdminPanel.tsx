
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { EventType, HiveEvent, Article, Member, MeetingMinute, FormField, FieldType } from '../types';
import { DotBackground } from './ui/DotBackground';
import { DateTimePicker } from './DateTimePicker';
import { sanitize, parseMarkdown } from '../utils';
import { BentoGrid, BentoCard } from './ui/BentoGrid';

// --- Login Screen Component ---
const LoginScreen = ({ onLogin }: { onLogin: (password: string) => void }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === 'admin123') { // Simple frontend gate
      onLogin(input);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <DotBackground>
          <div className="relative z-10 bg-white/80 dark:bg-[#0b1129]/90 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/20 max-w-md w-full text-center">
             <div className="w-24 h-24 bg-gradient-to-br from-hive-gold to-yellow-600 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-lg text-white mx-auto transform rotate-3 hover:rotate-6 transition-transform">
                <i className="fa-solid fa-shield-cat"></i>
             </div>
             <h1 className="text-3xl font-black text-hive-blue dark:text-white mb-2 font-heading">Restricted Access</h1>
             <p className="text-gray-500 text-sm mb-8 font-bold uppercase tracking-widest">Admin Authorization Required</p>
             
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input 
                      type="password" 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      className={`w-full text-center text-xl tracking-[0.3em] font-bold py-4 bg-gray-50 dark:bg-black/20 border-2 rounded-2xl outline-none transition-all ${error ? 'border-red-500 text-red-500' : 'border-gray-200 dark:border-white/10 focus:border-hive-gold dark:text-white'}`} 
                      placeholder="••••••" 
                      autoFocus 
                    />
                </div>
                <button type="submit" className="w-full bg-hive-blue text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl hover:shadow-hive-gold/20 text-xs">
                  Unlock Console
                </button>
             </form>
          </div>
        </DotBackground>
    </div>
  );
};

// --- Helper Components ---

const ListItem: React.FC<{ title: string, subtitle?: string, status?: string, onDelete: () => void, onEdit?: () => void }> = ({ title, subtitle, status, onDelete, onEdit }) => (
  <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-white/10 mb-3 hover:shadow-lg hover:border-hive-gold/30 transition-all group">
      <div className="flex-1 min-w-0 mr-4">
          <h4 className="font-bold text-hive-blue dark:text-white truncate text-sm group-hover:text-hive-gold transition-colors">{title}</h4>
          <div className="flex gap-2 items-center mt-1">
             {status && (
                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded tracking-wider ${
                    status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                    'bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                }`}>
                    {status}
                </span>
             )}
             {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
          </div>
      </div>
      <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && <button onClick={onEdit} className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/10 text-gray-400 hover:text-hive-blue hover:bg-hive-gold transition-all flex items-center justify-center"><i className="fa-solid fa-pen text-xs"></i></button>}
          <button onClick={onDelete} className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/10 text-gray-400 hover:text-red-600 hover:bg-red-100 transition-all flex items-center justify-center"><i className="fa-solid fa-trash text-xs"></i></button>
      </div>
  </div>
);

const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <motion.div initial={{scale:0.95, opacity:0, y: 20}} animate={{scale:1, opacity:1, y: 0}} exit={{scale:0.95, opacity:0, y: 20}} className="bg-white dark:bg-[#0b1129] p-8 rounded-[2.5rem] shadow-2xl w-full max-w-4xl relative z-10 border border-gray-100 dark:border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-white/5 pb-4 sticky top-0 bg-inherit z-20">
               <h2 className="text-2xl font-black font-heading text-hive-blue dark:text-white">{title}</h2>
               <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all"><i className="fa-solid fa-xmark"></i></button>
           </div>
           {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const RichTextEditor = ({ 
  label, 
  name, 
  defaultValue, 
  value, 
  onChange,
  required,
  placeholder
}: { 
  label?: string, 
  name?: string, 
  defaultValue?: string,
  value?: string,
  onChange?: (val: string) => void,
  required?: boolean,
  placeholder?: string
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(value !== undefined ? value : (defaultValue || ''));
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !hasInitialized.current) {
        const initialHTML = parseMarkdown(value !== undefined ? value : (defaultValue || ''));
        if (editorRef.current.innerHTML !== initialHTML) {
            editorRef.current.innerHTML = initialHTML;
        }
        setContent(initialHTML);
        hasInitialized.current = true;
    }
  }, []);

  const exec = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        setContent(html);
        if (onChange) onChange(html);
        editorRef.current.focus();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const html = e.currentTarget.innerHTML;
      setContent(html);
      if (onChange) onChange(html);
  };

  const ToolbarBtn = ({ cmd, arg, icon, title }: any) => (
    <button 
      type="button" 
      onClick={() => exec(cmd, arg)} 
      className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs transition-all text-hive-blue dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-white/10" 
      title={title}
    >
      <i className={`fa-solid ${icon}`}></i>
    </button>
  );

  return (
    <div className="mb-6">
      {label && (
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
          </label>
      )}
      
      <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-white/5 focus-within:ring-2 focus-within:ring-hive-gold transition-all shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
           <div className="flex gap-0.5 border-r border-gray-200 dark:border-white/10 pr-2 mr-2">
              <ToolbarBtn cmd="bold" icon="fa-bold" title="Bold" />
              <ToolbarBtn cmd="italic" icon="fa-italic" title="Italic" />
              <ToolbarBtn cmd="underline" icon="fa-underline" title="Underline" />
           </div>
           
           <div className="flex gap-0.5 border-r border-gray-200 dark:border-white/10 pr-2 mr-2">
              <ToolbarBtn cmd="formatBlock" arg="H3" icon="fa-h3" title="Heading 3" />
              <ToolbarBtn cmd="formatBlock" arg="H4" icon="fa-h4" title="Heading 4" />
              <ToolbarBtn cmd="formatBlock" arg="H5" icon="fa-h5" title="Heading 5" />
           </div>

           <div className="flex gap-0.5 border-r border-gray-200 dark:border-white/10 pr-2 mr-2">
              <ToolbarBtn cmd="insertUnorderedList" icon="fa-list-ul" title="Bullet List" />
              <ToolbarBtn cmd="insertOrderedList" icon="fa-list-ol" title="Numbered List" />
              <ToolbarBtn cmd="indent" icon="fa-indent" title="Indent" />
              <ToolbarBtn cmd="outdent" icon="fa-outdent" title="Outdent" />
           </div>

           <div className="flex gap-2 items-center pl-2">
              <button type="button" onClick={() => { const url = prompt('Enter URL:'); if(url) exec('createLink', url); }} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs"><i className="fa-solid fa-link"></i></button>
              <div className="relative w-6 h-6 overflow-hidden rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                 <input type="color" className="absolute inset-0 w-full h-full p-0 border-none opacity-0 cursor-pointer" onChange={(e) => exec('foreColor', e.target.value)} title="Text Color" />
                 <div className="w-full h-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500"></div>
              </div>
           </div>
        </div>
        
        {/* Content Area */}
        <div 
          ref={editorRef}
          className="w-full px-6 py-4 min-h-[300px] outline-none font-body text-sm text-hive-blue dark:text-white overflow-y-auto prose dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:font-heading prose-a:text-hive-gold"
          contentEditable
          onInput={handleInput}
          suppressContentEditableWarning={true}
          data-placeholder={placeholder}
        />
      </div>
      {name && <input type="hidden" name={name} value={content} />}
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block; 
        }
      `}</style>
    </div>
  );
};

const PipelineControl = ({ status, onChange, allowTerminalStates = true }: { status: string, onChange: (s: any) => void, allowTerminalStates?: boolean }) => {
  const stages = ['draft', 'verification', 'approval', 'published'];
  const currentIndex = stages.indexOf(status);
  
  if (['completed', 'cancelled'].includes(status) && allowTerminalStates) {
      return (
          <div className="mb-6 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">Event Status</label>
              <select value={status} onChange={(e) => onChange(e.target.value)} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold shadow-sm">
                  <option value="draft">Revert to Draft</option>
                  <option value="published">Re-Publish</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
              </select>
          </div>
      );
  }

  return (
    <div className="mb-8 relative bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
      <div className="flex justify-between items-center mb-6">
          <label className="text-xs font-black uppercase text-hive-blue dark:text-white tracking-[0.2em]">Publication Pipeline</label>
      </div>
      
      <div className="flex justify-between items-center gap-2 relative mb-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-hive-gold to-yellow-300 -z-10 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}></div>

        {stages.map((stage, idx) => {
          const isAccessible = idx <= currentIndex + 1;
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;

          return (
            <button
              key={stage}
              type="button"
              disabled={!isAccessible}
              onClick={() => onChange(stage)}
              className={`relative flex flex-col items-center group transition-all duration-300 ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all z-10 ${
                  isActive ? 'bg-hive-gold border-white dark:border-[#0b1129] text-hive-blue scale-110 shadow-lg' :
                  isCompleted ? 'bg-hive-blue border-hive-blue text-white' :
                  'bg-white dark:bg-[#0b1129] border-gray-200 dark:border-white/20 text-gray-400'
              }`}>
                  {isCompleted && !isActive ? <i className="fa-solid fa-check"></i> : idx + 1}
              </div>
              <span className={`absolute top-full mt-3 text-[9px] font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-hive-gold' : 'text-gray-400 dark:text-gray-500'
              }`}>
                  {stage}
              </span>
            </button>
          );
        })}
      </div>
      
      {allowTerminalStates && (
        <div className="pt-4 border-t border-gray-200 dark:border-white/5 flex gap-3">
            <button type="button" onClick={() => onChange('completed')} className="flex-1 text-[10px] uppercase font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 px-4 py-3 rounded-xl transition-colors border border-blue-100 dark:border-blue-900/30">
               <i className="fa-solid fa-flag-checkered mr-2"></i> Mark Completed
            </button>
            <button type="button" onClick={() => onChange('cancelled')} className="flex-1 text-[10px] uppercase font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 px-4 py-3 rounded-xl transition-colors border border-red-100 dark:border-red-900/30">
               <i className="fa-solid fa-ban mr-2"></i> Mark Cancelled
            </button>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">{label}</label>
        <input {...props} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold focus:border-transparent outline-none transition-all font-body text-sm text-hive-blue dark:text-white" />
    </div>
);

const TextAreaField = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">{label}</label>
        <textarea {...props} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold focus:border-transparent outline-none transition-all font-body text-sm resize-none text-hive-blue dark:text-white" />
    </div>
);

const HybridImageUpload = ({ label, name, defaultValue }: { label: string, name: string, defaultValue?: string }) => {
    const [preview, setPreview] = useState(defaultValue || '');
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 1024 * 1024 * 8) { // 8MB Limit
                alert("File too large. Please use an image under 8MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setPreview(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">{label}</label>
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 flex-shrink-0 border border-gray-200 dark:border-white/5">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <i className="fa-regular fa-image text-3xl"></i>
                        </div>
                    )}
                </div>
                <div className="flex-1 w-full space-y-3">
                    <input type="hidden" name={name} value={preview} />
                    <InputField label="Image URL" value={preview} onChange={(e) => setPreview(e.target.value)} placeholder="https://..." />
                    <div className="relative">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <button type="button" className="w-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-cloud-arrow-up"></i> Upload File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventFormContent = ({ event, PipelineControl }: { event: HiveEvent | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(event?.status || 'draft');
  const [startDate, setStartDate] = useState<Date | undefined>(event ? new Date(event.datetime.start) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(event ? new Date(event.datetime.end) : undefined);
  const [regDate, setRegDate] = useState<Date | undefined>(event?.registrationDeadline ? new Date(event.registrationDeadline) : undefined);

  return (
    <>
      <PipelineControl status={status} onChange={setStatus} allowTerminalStates={true} />
      <input type="hidden" name="status" value={status} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Event Title" name="title" defaultValue={event?.title} required />
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Event Type</label>
            <select name="type" defaultValue={event?.type || EventType.Workshop} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold outline-none text-sm font-body text-hive-blue dark:text-white">
               {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
         </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Start Time</label>
            <DateTimePicker date={startDate} setDate={setStartDate} name="start" />
         </div>
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">End Time</label>
            <DateTimePicker date={endDate} setDate={setEndDate} name="end" />
         </div>
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Reg. Deadline</label>
            <DateTimePicker date={regDate} setDate={setRegDate} name="registrationDeadline" />
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Location Name" name="locationName" defaultValue={event?.location.name} required />
         <InputField label="Coordinates (Lat, Lng)" name="locationCoords" defaultValue={event?.location.coordinates} placeholder="28.16, 84.02" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Capacity" type="number" name="capacity" defaultValue={event?.capacity || 50} required />
         <InputField label="Tags (comma separated)" name="tags" defaultValue={event?.tags.join(', ')} placeholder="AI, Workshop" />
      </div>
      <InputField label="Organizers (comma separated)" name="organizers" defaultValue={event?.organizers?.join(', ')} />
      
      <RichTextEditor 
        label="Description" 
        name="description" 
        defaultValue={event?.description} 
        required 
        placeholder="Enter event details..."
      />
    </>
  );
};

const MemberFormContent = ({ member, PipelineControl }: { member: Member | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(member?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} allowTerminalStates={false} />
      <input type="hidden" name="status" value={status} />
      <div className="grid grid-cols-2 gap-6">
        <InputField label="Full Name" name="name" defaultValue={member?.name} required />
        <InputField label="Tenure Year" type="number" name="year" defaultValue={member?.year || new Date().getFullYear()} required />
      </div>
      <InputField label="Role / Position" name="role" defaultValue={member?.role} required />
      <HybridImageUpload label="Profile Photo" name="image" defaultValue={member?.image} />
      <TextAreaField label="Bio / Message" name="message" defaultValue={member?.message} rows={3} required />
      <InputField label="Journey Steps (comma sep)" name="journey" defaultValue={member?.journey.join(', ')} placeholder="Member, VP, President" />
    </>
  );
};

const ArticleFormContent = ({ article, PipelineControl }: { article: Article | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(article?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} allowTerminalStates={false} />
      <input type="hidden" name="status" value={status} />
      <InputField label="Article Title" name="title" defaultValue={article?.title} required />
      <div className="grid grid-cols-2 gap-6">
         <InputField label="Author" name="author" defaultValue={article?.author} required />
         <InputField label="Read Time" name="readTime" defaultValue={article?.readTime} placeholder="5 min read" />
      </div>
      <HybridImageUpload label="Cover Image" name="image" defaultValue={article?.image} />
      <InputField label="Tags (comma sep)" name="tags" defaultValue={article?.tags.join(', ')} />
      <TextAreaField label="Excerpt" name="excerpt" defaultValue={article?.excerpt} rows={2} required />
      <RichTextEditor 
        label="Content Body" 
        name="content" 
        defaultValue={article?.content} 
        required 
        placeholder="Write your article here..."
      />
    </>
  );
};

const MinuteFormContent = ({ minute, PipelineControl }: { minute: MeetingMinute | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(minute?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} allowTerminalStates={false} />
      <input type="hidden" name="status" value={status} />
      <InputField label="Meeting Title" name="title" defaultValue={minute?.title} required />
      <InputField label="Date" name="date" type="date" defaultValue={minute?.date} required />
      <InputField label="Attendees (comma sep)" name="attendees" defaultValue={minute?.attendees.join(', ')} required />
      <TextAreaField label="Agenda Items (one per line)" name="agenda" defaultValue={minute?.agenda.join('\n')} rows={4} />
      <TextAreaField label="Decisions (one per line)" name="decisions" defaultValue={minute?.decisions.join('\n')} rows={4} />
      <TextAreaField label="Action Items (one per line)" name="actionItems" defaultValue={minute?.actionItems.join('\n')} rows={4} />
    </>
  );
};

const BannerForm = ({ config, updateConfig, events }: { config: any, updateConfig: any, events: HiveEvent[] }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [useManualDate, setUseManualDate] = useState(!events.find(e => new Date(e.datetime.start).toISOString() === localConfig.targetDate));
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [manualDate, setManualDate] = useState<Date | undefined>(localConfig.targetDate ? new Date(localConfig.targetDate) : undefined);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(localConfig);
    alert("Banner updated successfully!");
  };

  const handleEventSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const evtId = e.target.value;
    setSelectedEventId(evtId);
    const evt = events.find(ev => ev.id === evtId);
    if (evt) {
      setLocalConfig({ 
        ...localConfig, 
        targetDate: evt.datetime.start,
        message: evt.title 
      });
      setManualDate(new Date(evt.datetime.start));
    }
  };

  const handleManualDateChange = (date: Date | undefined) => {
    setManualDate(date);
    setLocalConfig({ ...localConfig, targetDate: date ? date.toISOString() : undefined });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h3 className="font-bold text-xl text-hive-blue dark:text-white">Active Banner</h3>
            <p className="text-xs text-gray-500">Global site notification bar</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={localConfig.isVisible} onChange={(e) => setLocalConfig({...localConfig, isVisible: e.target.checked})} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-hive-gold"></div>
            </label>
        </div>
        <InputField label="Message Text" value={localConfig.message} onChange={(e) => setLocalConfig({...localConfig, message: sanitize(e.target.value)})} disabled={!useManualDate && !localConfig.isVisible} />
      </div>

      <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-lg text-hive-blue dark:text-white">Countdown Timer</h4>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={localConfig.showCountdown} onChange={(e) => setLocalConfig({...localConfig, showCountdown: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
         </div>
         
         {localConfig.showCountdown && (
             <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                 <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    <button type="button" onClick={() => setUseManualDate(false)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${!useManualDate ? 'bg-white dark:bg-white/10 shadow-sm text-hive-blue dark:text-white' : 'text-gray-500'}`}>Linked Event</button>
                    <button type="button" onClick={() => setUseManualDate(true)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${useManualDate ? 'bg-white dark:bg-white/10 shadow-sm text-hive-blue dark:text-white' : 'text-gray-500'}`}>Custom Date</button>
                 </div>
                 
                 {!useManualDate ? (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Select Event</label>
                        <select value={selectedEventId} onChange={handleEventSelection} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-body text-hive-blue dark:text-white">
                            <option value="">-- Choose Upcoming Event --</option>
                            {events.filter(e => new Date(e.datetime.start) > new Date()).map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                        </select>
                    </div>
                 ) : (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Target Date</label>
                        <DateTimePicker date={manualDate} setDate={handleManualDateChange} />
                    </div>
                 )}
             </div>
         )}
      </div>

      <button type="submit" className="w-full bg-hive-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg text-sm">
        Save Configuration
      </button>
    </form>
  );
};

// --- Full Form Builder Component ---
const FormBuilder = ({ events, saveForm, getForm, selectedEventIdProp }: { events: HiveEvent[], saveForm: (eventId: string, fields: FormField[]) => void, getForm: (eventId: string) => FormField[], selectedEventIdProp?: string }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(selectedEventIdProp || '');
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    if(selectedEventIdProp) setSelectedEventId(selectedEventIdProp);
  }, [selectedEventIdProp]);

  useEffect(() => {
    if (selectedEventId) {
      setFields(getForm(selectedEventId));
    } else {
      setFields([]);
    }
  }, [selectedEventId, getForm]);

  // Filter out past/completed events from dropdown as per requirement
  const availableEvents = events.filter(e => 
    e.status !== 'completed' && 
    e.status !== 'cancelled' && 
    new Date(e.datetime.end) > new Date()
  );

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: type === 'description' || type === 'static_image' ? undefined : `New ${type} question`,
      content: type === 'description' ? 'Enter instructions...' : type === 'static_image' ? 'https://picsum.photos/800/200' : undefined,
      required: false,
      options: ['Option 1', 'Option 2'],
      placeholder: ''
    };
    setFields([...fields, newField]);
  };

  const addTemplate = (templateName: string) => {
    const timestamp = Date.now();
    let newFields: FormField[] = [];

    switch(templateName) {
      case 'name':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'text', label: 'First Name', required: true, placeholder: 'John' },
          { id: `field_${timestamp}_2`, type: 'text', label: 'Last Name', required: true, placeholder: 'Doe' }
        ];
        break;
      case 'contact':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'email', label: 'Email Address', required: true, placeholder: 'name@example.com' },
          { id: `field_${timestamp}_2`, type: 'phone', label: 'Phone Number', required: true, placeholder: '+977 9800000000' }
        ];
        break;
      case 'gender':
        newFields = [
          { id: `field_${timestamp}`, type: 'radio', label: 'Gender', required: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] }
        ];
        break;
      case 'program':
        newFields = [
          { id: `field_${timestamp}`, type: 'select', label: 'Academic Program', required: true, options: ['BIT', 'BCA', 'BSc. CSIT', 'BIM', 'BCIS'] }
        ];
        break;
      case 'college':
        newFields = [
          { id: `field_${timestamp}`, type: 'text', label: 'College / Institution', required: true, placeholder: 'Gandaki University' }
        ];
        break;
      case 'socials':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'url', label: 'LinkedIn Profile', required: false, placeholder: 'https://linkedin.com/in/...' },
          { id: `field_${timestamp}_2`, type: 'url', label: 'Portfolio URL', required: false, placeholder: 'https://github.com/...' }
        ];
        break;
      case 'tshirt':
        newFields = [
          { id: `field_${timestamp}`, type: 'select', label: 'T-Shirt Size', required: true, options: ['S', 'M', 'L', 'XL', 'XXL'] }
        ];
        break;
      case 'agreements':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'checkbox', label: 'I agree to the Terms & Conditions', required: true, options: ['Agreed'] },
          { id: `field_${timestamp}_2`, type: 'checkbox', label: 'I agree to the Code of Conduct', required: true, options: ['Agreed'] }
        ];
        break;
    }
    setFields([...fields, ...newFields]);
  };

  const updateField = (id: string, key: keyof FormField, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const addOption = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`] } : f));
  };

  const updateOption = (id: string, idx: number, val: string) => {
    setFields(fields.map(f => {
      if (f.id !== id) return f;
      const newOpts = [...(f.options || [])];
      newOpts[idx] = val;
      return { ...f, options: newOpts };
    }));
  };

  const removeOption = (id: string, idx: number) => {
    setFields(fields.map(f => {
      if (f.id !== id) return f;
      const newOpts = [...(f.options || [])];
      newOpts.splice(idx, 1);
      return { ...f, options: newOpts };
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    const newFields = [...fields];
    const temp = newFields[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  const handleFileUpload = (id: string, file: File) => {
    if (file.size > 150000) { // ~150KB limit
        alert("Image too large. Please use an image under 150KB to ensure data persistence.");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField(id, 'content', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedEventId) return;
    saveForm(selectedEventId, fields);
    alert('Form configuration saved!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      {/* Event Selection */}
      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Select Event to Build Form For</label>
          <select 
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold outline-none font-body text-sm text-hive-blue dark:text-white"
          >
            <option value="">-- Select Active Event --</option>
            {availableEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <button 
          onClick={handleSave}
          disabled={!selectedEventId}
          className="bg-hive-blue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-hive-gold hover:text-hive-blue transition-colors text-xs"
        >
          Save Form
        </button>
      </div>

      {selectedEventId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm h-fit sticky top-32">
            <h3 className="text-xl font-bold text-hive-blue dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4 font-heading">Live Preview</h3>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {fields.length === 0 && <p className="text-gray-400 text-sm italic text-center py-8">Form is empty. Add fields from the right.</p>}
              {fields.map(field => (
                <div key={field.id} className="space-y-2">
                  {field.type !== 'description' && field.type !== 'static_image' && field.label && (
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 font-body">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  )}
                  
                  {field.type === 'description' ? (
                    <div 
                      className="text-sm text-gray-600 dark:text-gray-400 prose dark:prose-invert whitespace-pre-wrap font-body"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(field.content || 'Description text...') }}
                    />
                  ) : field.type === 'static_image' ? (
                    <div className="rounded-xl overflow-hidden my-4 border border-gray-100 dark:border-white/10">
                        <img src={field.content || 'https://picsum.photos/800/200'} alt="Form Banner" className="w-full h-auto object-cover max-h-48" />
                    </div>
                  ) : field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' || field.type === 'phone' || field.type === 'url' ? (
                    <input type={field.type === 'phone' ? 'tel' : field.type} placeholder={field.placeholder} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-body outline-none" disabled />
                  ) : field.type === 'textarea' ? (
                    <textarea placeholder={field.placeholder} rows={3} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-body outline-none" disabled />
                  ) : field.type === 'select' ? (
                    <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-body outline-none" disabled>
                      {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                  ) : (field.type === 'radio' || field.type === 'checkbox') ? (
                    <div className="space-y-2">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type={field.type} disabled className="text-hive-gold" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-body">{opt}</span>
                        </div>
                      ))}
                    </div>
                  ) : (field.type === 'file' || field.type === 'image') ? (
                    <div className="w-full bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 text-center text-gray-400 text-sm flex flex-col items-center gap-2 font-body">
                      <i className={`fa-solid ${field.type === 'image' ? 'fa-image' : 'fa-cloud-arrow-up'} text-2xl mb-1`}></i>
                      <span>Click to upload {field.label || (field.type === 'image' ? 'Image' : 'File')}</span>
                      {field.type === 'image' && <span className="text-[10px] uppercase font-bold text-gray-300">Supports JPG, PNG, WEBP</span>}
                    </div>
                  ) : null}
                </div>
              ))}
              {fields.length > 0 && (
                <button className="w-full bg-hive-blue text-white py-3 rounded-xl font-bold mt-4 opacity-50 cursor-not-allowed uppercase tracking-widest text-xs">Submit Registration</button>
              )}
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10">
               <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">Quick Templates</h4>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['name', 'contact', 'gender', 'program', 'college', 'socials', 'tshirt', 'agreements'].map(tmpl => (
                      <button key={tmpl} onClick={() => addTemplate(tmpl)} className="bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-hive-blue dark:text-white text-[10px] font-bold py-2.5 rounded-xl border border-gray-200 dark:border-white/10 uppercase tracking-wide transition-colors">
                          {tmpl}
                      </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['text', 'textarea', 'email', 'phone', 'url', 'number', 'select', 'radio', 'checkbox', 'date', 'file'].map((type) => (
                <button 
                  key={type}
                  onClick={() => addField(type as FieldType)}
                  className="bg-hive-gold/10 hover:bg-hive-gold hover:text-hive-blue text-hive-gold text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-hive-gold/20 tracking-wide"
                >
                  + {type}
                </button>
              ))}
              <button onClick={() => addField('image')} className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-blue-200 dark:border-blue-800 tracking-wide">+ User Image</button>
              <button onClick={() => addField('static_image')} className="bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-300 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-pink-200 dark:border-pink-800 tracking-wide">+ Banner</button>
              <button onClick={() => addField('description')} className="bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-purple-200 dark:border-purple-800 tracking-wide">+ Text Block</button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative group hover:border-hive-gold/50 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveField(index, 'up')} disabled={index === 0} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 hover:text-hive-blue disabled:opacity-30"><i className="fa-solid fa-arrow-up text-xs"></i></button>
                    <button onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 hover:text-hive-blue disabled:opacity-30"><i className="fa-solid fa-arrow-down text-xs"></i></button>
                    <button onClick={() => removeField(field.id)} className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded text-red-500 hover:bg-red-100"><i className="fa-solid fa-trash text-xs"></i></button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center pr-24">
                      <span className="text-[9px] font-black uppercase bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500 tracking-widest">{field.type.replace('_', ' ')}</span>
                      {field.type !== 'description' && field.type !== 'static_image' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, 'required', e.target.checked)} className="rounded text-hive-gold focus:ring-hive-gold" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Required</span>
                        </label>
                      )}
                    </div>

                    {field.type === 'description' ? (
                      <div>
                        <RichTextEditor 
                          label="Instruction Text" 
                          value={field.content || ''} 
                          onChange={(val) => updateField(field.id, 'content', val)} 
                          placeholder="Enter instructions here..."
                        />
                      </div>
                    ) : field.type === 'static_image' ? (
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Banner Image Source</label>
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1">
                                <input value={field.content || ''} onChange={(e) => updateField(field.id, 'content', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-hive-gold" placeholder="https://..." />
                            </div>
                            <div className="relative">
                                <input type="file" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(field.id, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <button className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 uppercase tracking-wide">Upload</button>
                            </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Label</label>
                          <input value={field.label || ''} onChange={(e) => updateField(field.id, 'label', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-hive-gold" placeholder="Question Title" />
                        </div>
                        {!['select', 'radio', 'checkbox', 'file', 'date', 'image'].includes(field.type) && (
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Placeholder</label>
                            <input value={field.placeholder || ''} onChange={(e) => updateField(field.id, 'placeholder', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-hive-gold" />
                          </div>
                        )}
                      </div>
                    )}

                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                      <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">Options</label>
                        <div className="space-y-2">
                          {field.options?.map((opt, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input value={opt} onChange={(e) => updateOption(field.id, idx, e.target.value)} className="flex-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-body outline-none focus:border-hive-gold" />
                              <button onClick={() => removeOption(field.id, idx)} className="text-red-400 hover:text-red-500 w-6 flex justify-center"><i className="fa-solid fa-times"></i></button>
                            </div>
                          ))}
                          <button onClick={() => addOption(field.id)} className="text-xs font-bold text-hive-gold hover:underline uppercase tracking-wide">+ Add Option</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormStrategyModal = ({ isOpen, onClose, eventTitle, onChoice, existingEvents }: { isOpen: boolean, onClose: () => void, eventTitle: string, onChoice: (strategy: 'scratch' | 'clone', sourceId?: string) => void, existingEvents: HiveEvent[] }) => {
  const [selectedSource, setSelectedSource] = useState<string>("");

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Form Configuration Strategy">
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          How would you like to set up the registration form for <strong>{eventTitle}</strong>?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => onChoice('scratch')}
            className="p-6 rounded-2xl border-2 border-gray-100 dark:border-white/10 hover:border-hive-gold hover:bg-hive-gold/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <h4 className="font-bold text-hive-blue dark:text-white mb-1">Start from Scratch</h4>
            <p className="text-xs text-gray-500">Build a custom form using the drag-and-drop builder.</p>
          </button>

          <div 
            className={`p-6 rounded-2xl border-2 border-gray-100 dark:border-white/10 transition-all text-left group relative ${existingEvents.length === 0 ? 'opacity-50' : 'hover:border-hive-gold hover:bg-hive-gold/5'}`}
          >
             {existingEvents.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-2xl backdrop-blur-[1px] z-10 pointer-events-none">
                   <span className="text-xs font-bold bg-gray-200 dark:bg-white/10 px-3 py-1 rounded text-gray-500">No templates available</span>
                </div>
             )}
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-copy text-xl"></i>
            </div>
            <h4 className="font-bold text-hive-blue dark:text-white mb-3">Clone Existing Form</h4>
            
            <div className="flex gap-2">
                <select 
                value={selectedSource} 
                onChange={(e) => setSelectedSource(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-hive-gold relative z-20 text-hive-blue dark:text-white"
                disabled={existingEvents.length === 0}
                >
                <option value="">Select Source Event</option>
                {existingEvents.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                ))}
                </select>
                <button 
                    onClick={() => { if(selectedSource) onChoice('clone', selectedSource); }}
                    disabled={!selectedSource}
                    className="bg-hive-gold text-hive-blue px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-white transition-colors"
                >
                    Go
                </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const AdminPanel = () => {
  const { 
    events, team, articles, meetingMinutes, trainingDocs, 
    addEvent, updateEvent, deleteEvent,
    addMember, updateMember, deleteMember,
    addArticle, updateArticle, deleteArticle,
    addMinute, updateMinute, deleteMinute,
    addTrainingDoc, updateTrainingDoc, deleteTrainingDoc,
    bannerConfig, updateBannerConfig,
    saveFormConfig, getFormConfig, cloneFormConfig
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form Strategy State
  const [showFormStrategy, setShowFormStrategy] = useState(false);
  const [recentEventId, setRecentEventId] = useState<string | null>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    // Basic type conversion and array handling
    if (data.tags) data.tags = data.tags.split(',').map((t: string) => t.trim());
    if (data.organizers) data.organizers = data.organizers.split(',').map((t: string) => t.trim());
    if (data.attendees) data.attendees = data.attendees.split(',').map((t: string) => t.trim());
    if (data.agenda) data.agenda = data.agenda.split('\n').filter((t: string) => t.trim());
    if (data.decisions) data.decisions = data.decisions.split('\n').filter((t: string) => t.trim());
    if (data.actionItems) data.actionItems = data.actionItems.split('\n').filter((t: string) => t.trim());
    if (data.journey) data.journey = data.journey.split(',').map((t: string) => t.trim());
    if (data.capacity) data.capacity = parseInt(data.capacity);
    if (data.year) data.year = parseInt(data.year);

    // Location handling for events
    if (activeTab === 'events') {
        data.location = {
            name: data.locationName,
            coordinates: data.locationCoords
        };
        data.datetime = {
            start: data.start,
            end: data.end
        };
        // Preserve ID if editing, else generate
        data.id = editingItem?.id || `evt_${Date.now()}`;
        if (!data.registeredCount) data.registeredCount = editingItem?.registeredCount || 0;
        
        if (editingItem) {
            updateEvent(data);
        } else {
            addEvent(data);
            setRecentEventId(data.id);
            setShowFormStrategy(true); // Trigger strategy modal for new events
        }
    } else if (activeTab === 'team') {
        data.id = editingItem?.id || `mem_${Date.now()}`;
        if (editingItem) updateMember(data);
        else addMember(data);
    } else if (activeTab === 'articles') {
        data.id = editingItem?.id || `art_${Date.now()}`;
        if (editingItem) updateArticle(data);
        else {
            data.date = new Date().toISOString();
            addArticle(data);
        }
    } else if (activeTab === 'minutes') {
        data.id = editingItem?.id || `min_${Date.now()}`;
        if (editingItem) updateMinute(data);
        else addMinute(data);
    }

    handleClose();
  };

  const handleFormStrategyChoice = (strategy: 'scratch' | 'clone', sourceId?: string) => {
      if (!recentEventId) return;

      if (strategy === 'clone' && sourceId) {
          cloneFormConfig(sourceId, recentEventId);
      }
      
      setActiveTab('forms');
      setShowFormStrategy(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const tabs = [
    { id: 'events', label: 'Events', icon: 'fa-calendar' },
    { id: 'team', label: 'Team', icon: 'fa-users' },
    { id: 'articles', label: 'Articles', icon: 'fa-newspaper' },
    { id: 'minutes', label: 'Minutes', icon: 'fa-file-signature' },
    { id: 'banner', label: 'Banner', icon: 'fa-bullhorn' },
    { id: 'forms', label: 'Forms', icon: 'fa-clipboard-question' },
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
                <h1 className="text-4xl font-black text-hive-blue dark:text-white font-heading mb-2">Admin Console</h1>
                <p className="text-gray-500">Manage content, members, and settings.</p>
            </div>
            <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 mt-4 md:mt-0 overflow-x-auto max-w-full no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-hive-blue text-white shadow-md' : 'text-gray-500 hover:text-hive-blue dark:hover:text-white'}`}
                    >
                        <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'banner' && (
            <BannerForm config={bannerConfig} updateConfig={updateBannerConfig} events={events} />
        )}

        {activeTab === 'forms' && (
            <FormBuilder 
              events={events} 
              saveForm={saveFormConfig} 
              getForm={getFormConfig} 
              selectedEventIdProp={recentEventId || undefined} 
            />
        )}

        {['events', 'team', 'articles', 'minutes'].includes(activeTab) && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-hive-blue dark:text-white capitalize">{activeTab} Directory</h3>
                    <button onClick={handleAdd} className="bg-hive-gold text-hive-blue px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm">
                        + Add New
                    </button>
                </div>

                <div className="space-y-2">
                    {activeTab === 'events' && events.map(item => (
                        <ListItem key={item.id} title={item.title} subtitle={new Date(item.datetime.start).toLocaleDateString()} status={item.status} onEdit={() => handleEdit(item)} onDelete={() => deleteEvent(item.id)} />
                    ))}
                    {activeTab === 'team' && team.map(item => (
                        <ListItem key={item.id} title={item.name} subtitle={item.role} status={item.status} onEdit={() => handleEdit(item)} onDelete={() => deleteMember(item.id)} />
                    ))}
                    {activeTab === 'articles' && articles.map(item => (
                        <ListItem key={item.id} title={item.title} subtitle={item.author} status={item.status} onEdit={() => handleEdit(item)} onDelete={() => deleteArticle(item.id)} />
                    ))}
                    {activeTab === 'minutes' && meetingMinutes.map(item => (
                        <ListItem key={item.id} title={item.title} subtitle={item.date} status={item.status} onEdit={() => handleEdit(item)} onDelete={() => deleteMinute(item.id)} />
                    ))}
                </div>
            </div>
        )}

        <Modal 
            isOpen={isModalOpen} 
            onClose={handleClose} 
            title={`${editingItem ? 'Edit' : 'Add New'} ${activeTab.slice(0, -1)}`}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'events' && <EventFormContent event={editingItem} PipelineControl={PipelineControl} />}
                {activeTab === 'team' && <MemberFormContent member={editingItem} PipelineControl={PipelineControl} />}
                {activeTab === 'articles' && <ArticleFormContent article={editingItem} PipelineControl={PipelineControl} />}
                {activeTab === 'minutes' && <MinuteFormContent minute={editingItem} PipelineControl={PipelineControl} />}
                
                <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
                    <button type="button" onClick={handleClose} className="px-6 py-3 rounded-xl text-gray-500 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                    <button type="submit" className="px-8 py-3 rounded-xl bg-hive-blue text-white font-bold text-xs uppercase tracking-wider hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg">Save Changes</button>
                </div>
            </form>
        </Modal>

        <FormStrategyModal 
          isOpen={showFormStrategy} 
          onClose={() => setShowFormStrategy(false)} 
          eventTitle={events.find(e => e.id === recentEventId)?.title || "New Event"} 
          onChoice={handleFormStrategyChoice} 
          existingEvents={events.filter(e => e.id !== recentEventId && getFormConfig(e.id).length > 0)}
        />
    </div>
  );
};

export default AdminPanel;
