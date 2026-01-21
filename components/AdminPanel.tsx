
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { EventType, HiveEvent, Article, Member, TrainingDoc, MeetingMinute, Yearbook, TimelineMilestone, ContentStatus } from '../types';
import { LOGO_URL } from '../constants';
import { DotBackground } from './ui/DotBackground';
import { DateTimePicker } from './DateTimePicker';
import { sanitize } from '../utils';

const MotionDiv = motion.div as any;

// --- Helper Components Defined Outside ---

const ListItem: React.FC<{ title: string, subtitle?: string, status?: string, onDelete: () => void, onEdit?: () => void }> = ({ title, subtitle, status, onDelete, onEdit }) => (
  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl flex justify-between items-center border border-gray-100 dark:border-white/10 mb-3">
      <div>
          <h4 className="font-bold text-hive-blue dark:text-white">{title}</h4>
          <div className="flex gap-2 items-center mt-1">
             {status && <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{status}</span>}
             {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
      </div>
      <div className="flex gap-2">
          {onEdit && <button onClick={onEdit} className="p-2 text-gray-400 hover:text-hive-gold"><i className="fa-solid fa-pen"></i></button>}
          <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
      </div>
  </div>
);

const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-[#0b1129] p-8 rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 border border-white/10 max-h-[90vh] overflow-y-auto">
           <h2 className="text-2xl font-bold mb-6 font-heading text-hive-blue dark:text-white">{title}</h2>
           {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const PipelineControl = ({ status, onChange }: { status: string, onChange: (s: any) => void }) => {
  const stages = ['draft', 'verification', 'approval', 'published'];
  const currentIndex = stages.indexOf(status);
  
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
      return (
          <button onClick={() => setIsVisible(true)} className="mb-6 text-xs font-bold text-hive-gold uppercase tracking-widest hover:underline">
              Show Publication Pipeline
          </button>
      );
  }

  return (
    <div className="mb-6 relative bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
          <label className="text-[10px] font-bold uppercase text-hive-blue dark:text-white tracking-[0.2em]">Publication Pipeline</label>
          <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-hive-gold"><i className="fa-solid fa-xmark"></i></button>
      </div>
      
      <div className="flex justify-between items-center gap-2 relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/10 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-hive-gold -z-10 rounded-full transition-all duration-300" style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}></div>

        {stages.map((stage, idx) => {
          const isAccessible = idx <= currentIndex + 1; // Can only go to next step
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;

          return (
            <button
              key={stage}
              type="button"
              disabled={!isAccessible}
              onClick={() => onChange(stage)}
              className={`relative flex flex-col items-center group transition-all ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all z-10 ${
                  isActive ? 'bg-hive-gold border-hive-gold text-hive-blue scale-110 shadow-[0_0_10px_rgba(255,170,13,0.5)]' :
                  isCompleted ? 'bg-hive-blue border-hive-blue text-white' :
                  'bg-white dark:bg-[#0b1129] border-gray-300 dark:border-white/20 text-gray-400'
              }`}>
                  {isCompleted && !isActive ? <i className="fa-solid fa-check"></i> : idx + 1}
              </div>
              <span className={`absolute top-full mt-2 text-[9px] font-bold uppercase tracking-wide transition-colors ${
                  isActive ? 'text-hive-gold' : 'text-gray-400 dark:text-gray-500'
              }`}>
                  {stage}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Sub-components for Form Content ---

const EventFormContent = ({ event, PipelineControl }: { event: HiveEvent | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(event?.status || 'draft');
  const [startDate, setStartDate] = useState<Date | undefined>(event ? new Date(event.datetime.start) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(event ? new Date(event.datetime.end) : undefined);

  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />
      
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
            <input name="title" defaultValue={event?.title} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
         </div>
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type</label>
            <select name="type" defaultValue={event?.type || EventType.Workshop} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
               {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
         </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Start Time</label>
            <DateTimePicker date={startDate} setDate={setStartDate} name="start" />
         </div>
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">End Time</label>
            <DateTimePicker date={endDate} setDate={setEndDate} name="end" />
         </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Location</label>
            <input name="locationName" defaultValue={event?.location.name} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
         </div>
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Coordinates (Lat,Lng)</label>
            <input name="locationCoords" defaultValue={event?.location.coordinates} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" placeholder="28.16, 84.02" />
         </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Capacity</label>
            <input type="number" name="capacity" defaultValue={event?.capacity || 50} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
         </div>
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tags (comma sep)</label>
            <input name="tags" defaultValue={event?.tags.join(', ')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
         </div>
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Organizers (comma sep)</label>
         <input name="organizers" defaultValue={event?.organizers?.join(', ')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
         <textarea 
            name="description" 
            defaultValue={event?.description} 
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 resize-none h-40 overflow-y-auto whitespace-pre-wrap" 
            required 
         />
      </div>
    </>
  );
};

const MemberFormContent = ({ member, PipelineControl }: { member: Member | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(member?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
           <input name="name" defaultValue={member?.name} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
        </div>
        <div>
           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tenure Year</label>
           <input type="number" name="year" defaultValue={member?.year || new Date().getFullYear()} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
        </div>
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Role / Position</label>
         <input name="role" defaultValue={member?.role} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
         <input name="image" defaultValue={member?.image} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Bio / Message</label>
         <textarea name="message" rows={3} defaultValue={member?.message} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Journey Steps (comma sep)</label>
         <input name="journey" defaultValue={member?.journey.join(', ')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" placeholder="Member, Coordinator, President" />
      </div>
    </>
  );
};

const ArticleFormContent = ({ article, PipelineControl }: { article: Article | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(article?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />

      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Article Title</label>
         <input name="title" defaultValue={article?.title} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Author</label>
            <input name="author" defaultValue={article?.author} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
         </div>
         <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Read Time</label>
            <input name="readTime" defaultValue={article?.readTime} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" placeholder="5 min read" />
         </div>
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cover Image URL</label>
         <input name="image" defaultValue={article?.image} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tags (comma sep)</label>
         <input name="tags" defaultValue={article?.tags.join(', ')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Excerpt</label>
         <textarea name="excerpt" rows={2} defaultValue={article?.excerpt} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Content (HTML Supported)</label>
         <textarea name="content" rows={10} defaultValue={article?.content} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-sm" required />
      </div>
    </>
  );
};

const MinuteFormContent = ({ minute, PipelineControl }: { minute: MeetingMinute | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(minute?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />

      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Meeting Title</label>
         <input name="title" defaultValue={minute?.title} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date</label>
         <input name="date" type="date" defaultValue={minute?.date} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Attendees (comma separated)</label>
         <input name="attendees" defaultValue={minute?.attendees.join(', ')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Agenda Items (one per line)</label>
         <textarea name="agenda" rows={4} defaultValue={minute?.agenda.join('\n')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Key Decisions (one per line)</label>
         <textarea name="decisions" rows={4} defaultValue={minute?.decisions.join('\n')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
      <div>
         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Action Items (one per line)</label>
         <textarea name="actionItems" rows={4} defaultValue={minute?.actionItems.join('\n')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" />
      </div>
    </>
  );
};

// --- Banner Form Component ---
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
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
        <div>
          <h3 className="font-bold text-lg">Sticky Banner</h3>
          <p className="text-xs text-gray-500">Show a persistent notification at the top of the site.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={localConfig.isVisible} onChange={(e) => setLocalConfig({...localConfig, isVisible: e.target.checked})} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hive-gold/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hive-gold"></div>
        </label>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Banner Message</label>
        <input 
          type="text" 
          value={localConfig.message} 
          onChange={(e) => setLocalConfig({...localConfig, message: sanitize(e.target.value)})} 
          className={`w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold ${!useManualDate ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="e.g., Hackathon Registration closing soon!"
          disabled={!useManualDate}
        />
      </div>

      <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 space-y-6">
        <div className="flex items-center justify-between">
           <h4 className="font-bold text-hive-blue dark:text-white">Countdown Timer</h4>
           <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localConfig.showCountdown} onChange={(e) => setLocalConfig({...localConfig, showCountdown: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hive-gold/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
           </label>
        </div>

        {localConfig.showCountdown && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 pt-2">
             <div className="flex gap-4">
                <button type="button" onClick={() => setUseManualDate(false)} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${!useManualDate ? 'bg-hive-blue text-white border-transparent' : 'border-gray-200 text-gray-500'}`}>Link Event</button>
                <button type="button" onClick={() => setUseManualDate(true)} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${useManualDate ? 'bg-hive-blue text-white border-transparent' : 'border-gray-200 text-gray-500'}`}>Manual Date</button>
             </div>

             {!useManualDate ? (
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Select Upcoming Event</label>
                  <select 
                    value={selectedEventId} 
                    onChange={handleEventSelection}
                    className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold"
                  >
                    <option value="">-- Choose Event --</option>
                    {events.filter(e => new Date(e.datetime.start) > new Date()).map(e => (
                      <option key={e.id} value={e.id}>{e.title} ({new Date(e.datetime.start).toLocaleDateString()})</option>
                    ))}
                  </select>
               </div>
             ) : (
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Set Target Date & Time</label>
                  <DateTimePicker date={manualDate} setDate={handleManualDateChange} />
               </div>
             )}
          </motion.div>
        )}
      </div>

      <button type="submit" className="w-full bg-hive-gold text-hive-blue font-bold py-4 rounded-xl shadow-lg hover:bg-white transition-colors uppercase tracking-widest text-sm">
        Update Banner Settings
      </button>
    </form>
  );
};

const AdminPanel: React.FC = () => {
  const {
    events,
    team,
    articles,
    trainingDocs,
    meetingMinutes,
    yearbooks,
    milestones,
    bannerConfig,
    updateBannerConfig,
    updateEvent, addEvent, deleteEvent,
    updateArticle, addArticle, deleteArticle,
    updateMember, addMember, deleteMember,
    updateTrainingDoc, addTrainingDoc, deleteTrainingDoc,
    updateMinute, addMinute, deleteMinute,
    updateYearbook, addYearbook, deleteYearbook,
    addMilestone, updateMilestone, deleteMilestone
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'articles' | 'team' | 'training' | 'minutes' | 'yearbooks' | 'timeline' | 'banner'>('dashboard');

  // --- Modal States ---
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HiveEvent | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestone | null>(null);

  const [isMinuteModalOpen, setIsMinuteModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<MeetingMinute | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('SECURITY ALERT: Invalid access credentials provided.');
    }
  };

  // --- Handlers ---

  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const startDateRaw = formData.get('start') as string;
    const endDateRaw = formData.get('end') as string;

    const newEvent: HiveEvent = {
      id: editingEvent?.id || `evt_${Date.now()}`,
      title: sanitize(formData.get('title') as string),
      type: formData.get('type') as EventType,
      status: formData.get('status') as any, 
      datetime: {
        start: startDateRaw,
        end: endDateRaw
      },
      location: {
        name: sanitize(formData.get('locationName') as string),
        coordinates: sanitize(formData.get('locationCoords') as string)
      },
      capacity: Number(formData.get('capacity')),
      registeredCount: editingEvent?.registeredCount || 0,
      tags: (formData.get('tags') as string).split(',').map(t => sanitize(t.trim())),
      image: sanitize(formData.get('image') as string) || 'https://picsum.photos/seed/event_new/800/400',
      description: sanitize(formData.get('description') as string),
      organizers: (formData.get('organizers') as string).split(',').map(o => sanitize(o.trim())),
      resources: editingEvent?.resources || [],
      sentNotifications: editingEvent?.sentNotifications || []
    };

    if (editingEvent) updateEvent(newEvent);
    else addEvent(newEvent);
    
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMember: Member = {
      id: editingMember?.id || `mem_${Date.now()}`,
      name: sanitize(formData.get('name') as string),
      role: sanitize(formData.get('role') as string),
      message: sanitize(formData.get('message') as string),
      image: sanitize(formData.get('image') as string) || 'https://picsum.photos/200',
      year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
      journey: (formData.get('journey') as string).split(',').map(s => sanitize(s.trim())),
      status: formData.get('status') as ContentStatus
    };

    if (editingMember) updateMember(newMember);
    else addMember(newMember);
    
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleArticleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newArticle: Article = {
      id: editingArticle?.id || `art_${Date.now()}`,
      title: sanitize(formData.get('title') as string),
      excerpt: sanitize(formData.get('excerpt') as string),
      content: formData.get('content') as string,
      author: sanitize(formData.get('author') as string),
      date: editingArticle?.date || new Date().toISOString(),
      image: sanitize(formData.get('image') as string) || 'https://picsum.photos/800/400',
      tags: (formData.get('tags') as string).split(',').map(t => sanitize(t.trim())),
      readTime: sanitize(formData.get('readTime') as string),
      status: formData.get('status') as ContentStatus,
      comments: editingArticle?.comments || []
    };

    if (editingArticle) updateArticle(newArticle);
    else addArticle(newArticle);

    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleMilestoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMilestone: TimelineMilestone = {
      id: editingMilestone?.id || `ms_${Date.now()}`,
      year: parseInt(formData.get('year') as string),
      milestone: sanitize(formData.get('milestone') as string),
      summary: sanitize(formData.get('summary') as string),
      category: formData.get('category') as EventType,
      media: {
          type: 'image',
          url: 'https://picsum.photos/800/600', 
      }
    };

    if (editingMilestone) {
      updateMilestone(newMilestone);
    } else {
      addMilestone(newMilestone);
    }
    setIsMilestoneModalOpen(false);
    setEditingMilestone(null);
  };

  const handleMinuteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMinute: MeetingMinute = {
        id: editingMinute?.id || `mm_${Date.now()}`,
        title: sanitize(formData.get('title') as string),
        date: formData.get('date') as string,
        status: formData.get('status') as ContentStatus,
        attendees: (formData.get('attendees') as string).split(',').map(s => sanitize(s.trim())),
        agenda: (formData.get('agenda') as string).split('\n').map(s => sanitize(s.trim())).filter(Boolean),
        decisions: (formData.get('decisions') as string).split('\n').map(s => sanitize(s.trim())).filter(Boolean),
        actionItems: (formData.get('actionItems') as string).split('\n').map(s => sanitize(s.trim())).filter(Boolean),
    };

    if (editingMinute) updateMinute(newMinute);
    else addMinute(newMinute);

    setIsMinuteModalOpen(false);
    setEditingMinute(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20">
        <DotBackground className="h-[90vh]">
          <div className="flex items-center justify-center h-full px-4">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white/80 dark:bg-[#0b1129]/80 backdrop-blur-xl p-16 rounded-[3rem] shadow-2xl max-w-lg w-full border border-gray-200 dark:border-white/5 text-center relative z-10"
            >
              <div className="w-24 h-24 bg-hive-blue text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-4xl shadow-[0_0_40px_rgba(255,170,13,0.15)] border border-hive-gold/20">
                <i className="fa-solid fa-fingerprint text-hive-gold" />
              </div>
              <h1 className="text-4xl font-bold text-hive-blue dark:text-white mb-3 font-heading tracking-wide">ACCESS CONTROL</h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">Restricted Environment</p>
              <form className="space-y-8" onSubmit={handleLogin}>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#060916] border border-gray-200 dark:border-white/10 rounded-2xl px-8 py-5 text-hive-blue dark:text-white focus:ring-1 focus:ring-hive-gold text-center tracking-[0.5em] font-bold text-xl"
                    placeholder="PASSCODE"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-hive-gold text-hive-blue py-5 rounded-2xl font-black hover:bg-hive-blue hover:text-white transition-all shadow-lg uppercase tracking-[0.25em] text-xs"
                >
                  Authenticate
                </button>
              </form>
            </MotionDiv>
          </div>
        </DotBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#01041a] text-hive-blue dark:text-white transition-colors duration-500">
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/80 dark:bg-[#0b1129]/80 backdrop-blur-xl p-6 lg:p-10 rounded-[3rem] border border-gray-200 dark:border-white/5 sticky top-28 shadow-2xl flex flex-col gap-6 lg:gap-12">
               <div>
                  <h2 className="text-xl font-black text-hive-blue dark:text-white mb-6">Admin Core</h2>
                  <nav className="space-y-2">
                     <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Dashboard</button>
                     <button onClick={() => setActiveTab('banner')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'banner' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Banner & Alerts</button>
                     <button onClick={() => setActiveTab('events')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'events' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Events</button>
                     <button onClick={() => setActiveTab('team')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'team' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Members</button>
                     <button onClick={() => setActiveTab('articles')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'articles' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Articles</button>
                     <button onClick={() => setActiveTab('minutes')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'minutes' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Meeting Minutes</button>
                     <button onClick={() => setActiveTab('timeline')} className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === 'timeline' ? 'bg-hive-gold text-hive-blue shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>Timeline</button>
                     <button onClick={() => setIsAuthenticated(false)} className="w-full text-left px-5 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">Logout</button>
                  </nav>
               </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
             <div className="bg-white dark:bg-[#0b1129]/60 p-10 rounded-[3rem] border border-gray-200 dark:border-white/5 min-h-[600px]">
                
                {activeTab === 'dashboard' && (
                  <div>
                    <h1 className="text-4xl font-bold mb-8">System Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
                          <h3 className="text-2xl font-bold">{events.length}</h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Total Events</p>
                       </div>
                       <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl">
                          <h3 className="text-2xl font-bold">{team.length}</h3>
                          <p className="text-sm text-green-600 dark:text-green-400">Team Members</p>
                       </div>
                       <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl">
                          <h3 className="text-2xl font-bold">{articles.length}</h3>
                          <p className="text-sm text-purple-600 dark:text-purple-400">Articles</p>
                       </div>
                    </div>
                    <p className="text-gray-500">Select a module from the sidebar to manage content.</p>
                  </div>
                )}

                {activeTab === 'banner' && (
                  <div>
                    <h1 className="text-4xl font-bold mb-8">Sticky Banner Configuration</h1>
                    <BannerForm config={bannerConfig} updateConfig={updateBannerConfig} events={events} />
                  </div>
                )}

                {activeTab === 'events' && (
                   <div>
                      <div className="flex justify-between items-center mb-8">
                         <h1 className="text-4xl font-bold">Event Management</h1>
                         <button onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} className="bg-hive-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors">+ New Event</button>
                      </div>
                      <div className="space-y-2">
                         {events.map(e => <ListItem key={e.id} title={e.title} subtitle={new Date(e.datetime.start).toLocaleDateString()} status={e.status} onDelete={() => deleteEvent(e.id)} onEdit={() => { setEditingEvent(e); setIsEventModalOpen(true); }} />)}
                      </div>
                   </div>
                )}

                {activeTab === 'team' && (
                   <div>
                      <div className="flex justify-between items-center mb-8">
                         <h1 className="text-4xl font-bold">Team Directory</h1>
                         <button onClick={() => { setEditingMember(null); setIsMemberModalOpen(true); }} className="bg-hive-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors">+ New Member</button>
                      </div>
                      <div className="space-y-2">
                         {team.map(m => <ListItem key={m.id} title={m.name} subtitle={`${m.role} (${m.year})`} status={m.status} onDelete={() => deleteMember(m.id)} onEdit={() => { setEditingMember(m); setIsMemberModalOpen(true); }} />)}
                      </div>
                   </div>
                )}

                {activeTab === 'articles' && (
                   <div>
                      <div className="flex justify-between items-center mb-8">
                         <h1 className="text-4xl font-bold">Editorial</h1>
                         <button onClick={() => { setEditingArticle(null); setIsArticleModalOpen(true); }} className="bg-hive-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors">+ New Article</button>
                      </div>
                      <div className="space-y-2">
                         {articles.map(a => <ListItem key={a.id} title={a.title} subtitle={a.author} status={a.status} onDelete={() => deleteArticle(a.id)} onEdit={() => { setEditingArticle(a); setIsArticleModalOpen(true); }} />)}
                      </div>
                   </div>
                )}

                {activeTab === 'minutes' && (
                   <div>
                      <div className="flex justify-between items-center mb-8">
                         <h1 className="text-4xl font-bold">Meeting Minutes</h1>
                         <button onClick={() => { setEditingMinute(null); setIsMinuteModalOpen(true); }} className="bg-hive-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg">+ Log Minutes</button>
                      </div>
                      <div className="space-y-2">
                         {meetingMinutes.map(m => <ListItem key={m.id} title={m.title} subtitle={new Date(m.date).toLocaleDateString()} status={m.status} onDelete={() => deleteMinute(m.id)} onEdit={() => { setEditingMinute(m); setIsMinuteModalOpen(true); }} />)}
                      </div>
                   </div>
                )}

                {activeTab === 'timeline' && (
                  <div>
                    <div className="flex justify-between items-center mb-8">
                       <h1 className="text-4xl font-bold">Timeline Management</h1>
                       <button onClick={() => { setEditingMilestone(null); setIsMilestoneModalOpen(true); }} className="bg-hive-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg">
                          + Add Milestone
                       </button>
                    </div>

                    <div className="space-y-4">
                       {milestones.map((milestone) => (
                          <div key={milestone.id} className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-white/10">
                             <div>
                                <span className="bg-hive-gold/20 text-hive-gold px-2 py-1 rounded text-xs font-bold mr-3">{milestone.year}</span>
                                <span className="font-bold text-lg">{milestone.milestone}</span>
                                <p className="text-sm text-gray-500 mt-1">{milestone.summary}</p>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => { setEditingMilestone(milestone); setIsMilestoneModalOpen(true); }} className="p-2 text-gray-400 hover:text-hive-gold"><i className="fa-solid fa-pen"></i></button>
                                <button onClick={() => deleteMilestone(milestone.id)} className="p-2 text-gray-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                )}
             </div>
          </main>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Event Modal */}
      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={editingEvent ? 'Edit Event' : 'New Event'}>
         <form onSubmit={handleEventSubmit} className="space-y-4">
            <EventFormContent event={editingEvent} PipelineControl={PipelineControl} />
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setIsEventModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
               <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors">Save Event</button>
            </div>
         </form>
      </Modal>

      {/* Member Modal */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title={editingMember ? 'Edit Member' : 'New Member'}>
         <form onSubmit={handleMemberSubmit} className="space-y-4">
            <MemberFormContent member={editingMember} PipelineControl={PipelineControl} />
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setIsMemberModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
               <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors">Save Member</button>
            </div>
         </form>
      </Modal>

      {/* Article Modal */}
      <Modal isOpen={isArticleModalOpen} onClose={() => setIsArticleModalOpen(false)} title={editingArticle ? 'Edit Article' : 'New Article'}>
         <form onSubmit={handleArticleSubmit} className="space-y-4">
            <ArticleFormContent article={editingArticle} PipelineControl={PipelineControl} />
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setIsArticleModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
               <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors">Save Article</button>
            </div>
         </form>
      </Modal>

      {/* Timeline Modal */}
      <Modal isOpen={isMilestoneModalOpen} onClose={() => setIsMilestoneModalOpen(false)} title={editingMilestone ? 'Edit Milestone' : 'New Milestone'}>
         <form onSubmit={handleMilestoneSubmit} className="space-y-4">
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Year</label>
               <input name="year" type="number" defaultValue={editingMilestone?.year || new Date().getFullYear()} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Milestone Title</label>
               <input name="milestone" defaultValue={editingMilestone?.milestone} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Summary</label>
               <textarea name="summary" rows={3} defaultValue={editingMilestone?.summary} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3" required />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
               <select name="category" defaultValue={editingMilestone?.category || EventType.Social} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                  {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setIsMilestoneModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
               <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors">Save</button>
            </div>
         </form>
      </Modal>

      {/* Meeting Minute Modal */}
      <Modal isOpen={isMinuteModalOpen} onClose={() => setIsMinuteModalOpen(false)} title={editingMinute ? 'Edit Minutes' : 'Log Minutes'}>
         <form onSubmit={handleMinuteSubmit} className="space-y-4">
            <MinuteFormContent minute={editingMinute} PipelineControl={PipelineControl} />
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setIsMinuteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
               <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors">Save Log</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
