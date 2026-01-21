
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HiveEvent, Member, GalleryAlbum, Article, TimelineMilestone, TrainingDoc, MeetingMinute, Notification, EventType, Comment, Yearbook, BannerConfig, EventFormConfig, FormField } from '../types';
import { EVENTS, TEAM, ALBUMS, ARTICLES, MILESTONES, YEARBOOKS } from '../constants';

interface DataContextType {
  events: HiveEvent[];
  team: Member[];
  albums: GalleryAlbum[];
  articles: Article[];
  milestones: TimelineMilestone[];
  trainingDocs: TrainingDoc[];
  meetingMinutes: MeetingMinute[];
  notifications: Notification[];
  yearbooks: Yearbook[];
  previewMode: boolean;
  bannerConfig: BannerConfig;
  
  setPreviewMode: (mode: boolean) => void;
  updateBannerConfig: (config: BannerConfig) => void;

  // CRUD Operations
  addEvent: (event: HiveEvent) => void;
  updateEvent: (event: HiveEvent) => void;
  deleteEvent: (id: string) => void;

  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  addArticleComment: (articleId: string, comment: Comment) => void;

  addMember: (member: Member) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;

  addAlbum: (album: GalleryAlbum) => void;
  deleteAlbum: (id: string) => void;

  addTrainingDoc: (doc: TrainingDoc) => void;
  updateTrainingDoc: (doc: TrainingDoc) => void;
  deleteTrainingDoc: (id: string) => void;

  addMinute: (minute: MeetingMinute) => void;
  updateMinute: (minute: MeetingMinute) => void;
  deleteMinute: (id: string) => void;

  addYearbook: (yb: Yearbook) => void;
  updateYearbook: (yb: Yearbook) => void;
  deleteYearbook: (id: string) => void;

  addMilestone: (m: TimelineMilestone) => void;
  updateMilestone: (m: TimelineMilestone) => void;
  deleteMilestone: (id: string) => void;

  // Form Builder
  saveFormConfig: (eventId: string, fields: FormField[]) => void;
  getFormConfig: (eventId: string) => FormField[];
  cloneFormConfig: (sourceEventId: string, targetEventId: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() => {
    const saved = localStorage.getItem('hive_banner_config');
    return saved ? JSON.parse(saved) : {
      isVisible: true,
      message: "Hackathon 3.0 Registration Closing Soon!",
      showCountdown: false,
      targetDate: null,
      link: null
    };
  });

  const [events, setEvents] = useState<HiveEvent[]>(() => {
    const saved = localStorage.getItem('hive_events');
    return saved ? JSON.parse(saved) : EVENTS;
  });

  const [team, setTeam] = useState<Member[]>(() => {
    const saved = localStorage.getItem('hive_team');
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, status: m.status || 'published' })) : TEAM.map(m => ({ ...m, status: 'published' }));
  });

  const [albums, setAlbums] = useState<GalleryAlbum[]>(() => {
    const saved = localStorage.getItem('hive_albums');
    return saved ? JSON.parse(saved) : ALBUMS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('hive_articles');
    return saved ? JSON.parse(saved).map((a: any) => ({ ...a, status: a.status || 'published' })) : ARTICLES.map(a => ({ ...a, status: 'published' }));
  });

  const [yearbooks, setYearbooks] = useState<Yearbook[]>(() => {
    const saved = localStorage.getItem('hive_yearbooks');
    return saved ? JSON.parse(saved) : YEARBOOKS;
  });

  const [trainingDocs, setTrainingDocs] = useState<TrainingDoc[]>(() => {
    const saved = localStorage.getItem('hive_training');
    return saved ? JSON.parse(saved) : [
      { id: 'tr_01', title: 'Committee Onboarding', category: 'onboarding', status: 'published', lastUpdated: '2025-01-01', content: 'Welcome to the BEE-IT HIVE Committee...' },
      { id: 'tr_02', title: 'CMS Publishing Guide', category: 'technical', status: 'published', lastUpdated: '2025-02-15', content: 'How to manage the Hive portal content...' }
    ];
  });

  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinute[]>(() => {
    const saved = localStorage.getItem('hive_minutes');
    return saved ? JSON.parse(saved) : [
      {
        id: 'mm_01',
        title: 'Q1 Strategy Planning',
        date: '2025-01-10',
        attendees: ['Nirajan Dhakal', 'Shrijana Poudel', 'Saroj Giri'],
        agenda: ['Budget Allocation', 'Hackathon Dates', 'Portal Launch'],
        decisions: ['Approved budget for Q1', 'Hackathon set for May'],
        actionItems: ['Nirajan to contact sponsors', 'Shrijana to draft timeline'],
        status: 'published'
      }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('hive_notifications');
    if (saved) return JSON.parse(saved);
    
    // Initial Seed Notifications
    return [
      {
        id: 'n1',
        title: 'Welcome to the Hive Portal',
        message: 'Your official digital hub is now live. Explore events and team profiles!',
        type: 'general',
        category: 'system',
        timestamp: new Date().toISOString(),
        isRead: false,
        isArchived: false
      },
      {
        id: 'n2',
        title: 'Global Innovation Summit 2025',
        message: 'Registration is now open for our biggest event of the year!',
        type: 'important',
        category: 'community',
        timestamp: new Date().toISOString(),
        eventId: 'evt_2025_001',
        isRead: false,
        isArchived: false
      }
    ];
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem('hive_milestones');
    return saved ? JSON.parse(saved) : MILESTONES;
  });

  const [formConfigs, setFormConfigs] = useState<EventFormConfig[]>(() => {
    const saved = localStorage.getItem('hive_form_configs');
    return saved ? JSON.parse(saved) : [];
  });

  // Helper to safely set item in localStorage with quota handling
  const safeSetItem = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.error(`Storage limit exceeded when saving ${key}. Data not persisted.`);
        // Optional: Alert the user only if critical data
        if (key === 'hive_form_configs' || key === 'hive_events') {
           alert("Storage Limit Reached: Recent changes could not be saved to your browser. Please clear data or use smaller images.");
        }
      } else {
        console.error(`Failed to save ${key} to localStorage`, e);
      }
    }
  };

  useEffect(() => safeSetItem('hive_banner_config', bannerConfig), [bannerConfig]);
  useEffect(() => safeSetItem('hive_events', events), [events]);
  useEffect(() => safeSetItem('hive_team', team), [team]);
  useEffect(() => safeSetItem('hive_albums', albums), [albums]);
  useEffect(() => safeSetItem('hive_articles', articles), [articles]);
  useEffect(() => safeSetItem('hive_yearbooks', yearbooks), [yearbooks]);
  useEffect(() => safeSetItem('hive_training', trainingDocs), [trainingDocs]);
  useEffect(() => safeSetItem('hive_minutes', meetingMinutes), [meetingMinutes]);
  useEffect(() => safeSetItem('hive_notifications', notifications), [notifications]);
  useEffect(() => safeSetItem('hive_milestones', milestones), [milestones]);
  useEffect(() => safeSetItem('hive_form_configs', formConfigs), [formConfigs]);

  // COM-03: Automated Notification Logic
  useEffect(() => {
    const checkEventCountdowns = () => {
      const now = new Date().getTime();
      let updatedEvents = false;
      const newNotifications: Notification[] = [];

      const newEvents = events.map(event => {
        // Skip check if not published or cancelled
        if (event.status !== 'published') return event;

        const startTime = new Date(event.datetime.start).getTime();
        const diffMs = startTime - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        
        const sentList = event.sentNotifications || [];
        let newSentList = [...sentList];
        let triggered = false;

        // Thresholds: 72h, 24h, 1h
        if (diffHours <= 72 && diffHours > 24 && !sentList.includes('72h')) {
           newNotifications.push({
             id: `n_${event.id}_72h_${now}`,
             title: `Upcoming: ${event.title}`,
             message: `In 3 days: Get ready for ${event.title}. ${event.type === EventType.Hackathon ? 'Prepare your gear!' : 'Check requirements.'}`,
             type: 'general',
             category: 'community',
             timestamp: new Date().toISOString(),
             eventId: event.id,
             isRead: false,
             isArchived: false
           });
           newSentList.push('72h');
           triggered = true;
        }
        else if (diffHours <= 24 && diffHours > 1 && !sentList.includes('24h')) {
           newNotifications.push({
             id: `n_${event.id}_24h_${now}`,
             title: `Tomorrow: ${event.title}`,
             message: `Reminder: ${event.title} starts tomorrow at ${new Date(event.datetime.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
             type: 'important',
             category: 'community',
             timestamp: new Date().toISOString(),
             eventId: event.id,
             isRead: false,
             isArchived: false
           });
           newSentList.push('24h');
           triggered = true;
        }
        else if (diffHours <= 1 && diffHours > 0 && !sentList.includes('1h')) {
           newNotifications.push({
             id: `n_${event.id}_1h_${now}`,
             title: `Starting Now: ${event.title}`,
             message: `Hurry up! Event begins in 1 hour at ${event.location.name}.`,
             type: 'urgent',
             category: 'community',
             timestamp: new Date().toISOString(),
             eventId: event.id,
             isRead: false,
             isArchived: false
           });
           newSentList.push('1h');
           triggered = true;
        }

        if (triggered) {
          updatedEvents = true;
          return { ...event, sentNotifications: newSentList as any };
        }
        return event;
      });

      if (updatedEvents) {
        setEvents(newEvents);
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    };

    const intervalId = setInterval(checkEventCountdowns, 60000); // Check every minute
    checkEventCountdowns(); // Run on mount

    return () => clearInterval(intervalId);
  }, [events]);

  const updateBannerConfig = (config: BannerConfig) => setBannerConfig(config);

  const addEvent = (evt: HiveEvent) => setEvents(prev => [evt, ...prev]);
  
  const updateEvent = (evt: HiveEvent) => {
    // Detect Cancellation
    const oldEvent = events.find(e => e.id === evt.id);
    if (oldEvent && oldEvent.status !== 'cancelled' && evt.status === 'cancelled') {
       // Trigger Cancellation Alert
       const cancelNote: Notification = {
          id: `n_${evt.id}_cancel_${Date.now()}`,
          title: `CANCELLED: ${evt.title}`,
          message: `ALERT: ${evt.title} has been cancelled. Please check your email for further details regarding refunds or rescheduling.`,
          type: 'urgent',
          category: 'community',
          timestamp: new Date().toISOString(),
          eventId: evt.id,
          isRead: false,
          isArchived: false
       };
       setNotifications(prev => [cancelNote, ...prev]);
       
       // Mark as sent
       const updatedEvt = {
         ...evt,
         sentNotifications: [...(evt.sentNotifications || []), 'cancelled'] as any
       };
       setEvents(prev => prev.map(e => e.id === evt.id ? updatedEvt : e));
    } else {
       setEvents(prev => prev.map(e => e.id === evt.id ? evt : e));
    }
  };
  
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const addArticle = (art: Article) => setArticles(prev => [art, ...prev]);
  const updateArticle = (art: Article) => setArticles(prev => prev.map(a => a.id === art.id ? art : a));
  const deleteArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id));
  
  const addArticleComment = (articleId: string, comment: Comment) => {
    setArticles(prev => prev.map(a => {
      if (a.id === articleId) {
        return { ...a, comments: [comment, ...(a.comments || [])] };
      }
      return a;
    }));
  };

  const addMember = (mem: Member) => setTeam(prev => [...prev, mem]);
  const updateMember = (mem: Member) => setTeam(prev => prev.map(m => m.id === mem.id ? mem : m));
  const deleteMember = (id: string) => setTeam(prev => prev.filter(m => m.id !== id));

  const addAlbum = (alb: GalleryAlbum) => setAlbums(prev => [alb, ...prev]);
  const deleteAlbum = (id: string) => setAlbums(prev => prev.filter(a => a.album_id !== id));

  const addTrainingDoc = (doc: TrainingDoc) => setTrainingDocs(prev => [doc, ...prev]);
  const updateTrainingDoc = (doc: TrainingDoc) => setTrainingDocs(prev => prev.map(d => d.id === doc.id ? doc : d));
  const deleteTrainingDoc = (id: string) => setTrainingDocs(prev => prev.filter(d => d.id !== id));

  const addMinute = (minute: MeetingMinute) => setMeetingMinutes(prev => [minute, ...prev]);
  const updateMinute = (minute: MeetingMinute) => setMeetingMinutes(prev => prev.map(m => m.id === minute.id ? minute : m));
  const deleteMinute = (id: string) => setMeetingMinutes(prev => prev.filter(m => m.id !== id));

  const addYearbook = (yb: Yearbook) => setYearbooks(prev => [yb, ...prev]);
  const updateYearbook = (yb: Yearbook) => setYearbooks(prev => prev.map(y => y.id === yb.id ? yb : y));
  const deleteYearbook = (id: string) => setYearbooks(prev => prev.filter(y => y.id !== id));

  const addMilestone = (m: TimelineMilestone) => setMilestones(prev => [...prev, m].sort((a,b) => a.year - b.year));
  const updateMilestone = (m: TimelineMilestone) => setMilestones(prev => prev.map(old => old.id === m.id ? m : old).sort((a,b) => a.year - b.year));
  const deleteMilestone = (id: string) => setMilestones(prev => prev.filter(m => m.id !== id));

  // Form Builder Methods
  const saveFormConfig = (eventId: string, fields: FormField[]) => {
    setFormConfigs(prev => {
      const existing = prev.find(c => c.eventId === eventId);
      if (existing) {
        return prev.map(c => c.eventId === eventId ? { ...c, fields } : c);
      } else {
        return [...prev, { eventId, fields }];
      }
    });
  };

  const getFormConfig = (eventId: string): FormField[] => {
    return formConfigs.find(c => c.eventId === eventId)?.fields || [];
  };

  const cloneFormConfig = (sourceEventId: string, targetEventId: string) => {
    const sourceConfig = formConfigs.find(c => c.eventId === sourceEventId);
    if (sourceConfig) {
        // Deep copy the fields to ensure unique instance for the new event
        const newFields = JSON.parse(JSON.stringify(sourceConfig.fields));
        saveFormConfig(targetEventId, newFields);
    }
  };

  // Notification methods
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isArchived: true, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <DataContext.Provider value={{
      events, team, albums, articles, milestones, trainingDocs, meetingMinutes, notifications, yearbooks, previewMode, bannerConfig, setPreviewMode, updateBannerConfig,
      addEvent, updateEvent, deleteEvent,
      addArticle, updateArticle, deleteArticle, addArticleComment,
      addMember, updateMember, deleteMember,
      addAlbum, deleteAlbum,
      addTrainingDoc, updateTrainingDoc, deleteTrainingDoc,
      addMinute, updateMinute, deleteMinute,
      addYearbook, updateYearbook, deleteYearbook,
      addMilestone, updateMilestone, deleteMilestone,
      saveFormConfig, getFormConfig, cloneFormConfig,
      markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, archiveNotification, clearAllNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
