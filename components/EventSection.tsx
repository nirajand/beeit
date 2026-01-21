import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext'; 
import { HiveEvent, EventType } from '../types';
import EventRegistration from './EventRegistration';
import EventFeedback from './EventFeedback';
import EventCalendar from './EventCalendar';
import { parseMarkdown } from '../utils';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ShineBorder } from './ui/ShineBorder';
import { Meteors } from './ui/Meteors';
import { Avatar } from './ui/Avatar';
import { LazyImage } from './ui/LazyImage';

interface EventSectionProps {
  onBreadcrumbUpdate?: (detail: string | null) => void;
}

type ViewMode = 'LIST' | 'DETAIL';
type DisplayFormat = 'CARDS' | 'CALENDAR';
type TimeFilter = 'UPCOMING' | 'PAST';

const EventSection: React.FC<EventSectionProps> = ({ onBreadcrumbUpdate }) => {
  const { events, team } = useData(); 
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('UPCOMING');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('CARDS');
  const [selectedEvent, setSelectedEvent] = useState<HiveEvent | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Filter logic
  const filteredEvents = useMemo(() => {
    let result = events;
    if (timeFilter === 'PAST') {
      result = result.filter(e => e.status === 'completed' || e.status === 'cancelled');
    } else {
      result = result.filter(e => e.status === 'published');
    }
    if (filter !== 'all') {
      result = result.filter(e => e.type === filter);
    }
    return result.sort((a, b) => {
      const dateA = new Date(a.datetime.start).getTime();
      const dateB = new Date(b.datetime.start).getTime();
      return timeFilter === 'UPCOMING' ? dateA - dateB : dateB - dateA;
    });
  }, [events, timeFilter, filter]);

  const nextEvents = useMemo(() => {
    if (!selectedEvent) return [];
    return events
      .filter(e => e.id !== selectedEvent.id && e.status === 'published' && new Date(e.datetime.start) > new Date())
      .sort((a, b) => new Date(a.datetime.start).getTime() - new Date(b.datetime.start).getTime())
      .slice(0, 3);
  }, [events, selectedEvent]);

  // Derive Organizers from Team Data
  const eventOrganizers = useMemo(() => {
    if (!selectedEvent || !selectedEvent.organizers) return [];
    return selectedEvent.organizers.map(name => {
      const member = team.find(m => m.name === name);
      return member || { name, role: 'Event Coordinator', image: '' }; // Fallback if member not found in team
    });
  }, [selectedEvent, team]);

  useEffect(() => {
    if (onBreadcrumbUpdate) {
      if (viewMode === 'LIST') {
        const timeLabel = timeFilter === 'PAST' ? 'Past Archive' : 'Upcoming';
        const typeLabel = filter === 'all' ? '' : `: ${(filter || "").charAt(0).toUpperCase() + (filter || "").slice(1)}`;
        onBreadcrumbUpdate(displayFormat === 'CALENDAR' ? 'Calendar' : `${timeLabel}${typeLabel}`);
      } else if (viewMode === 'DETAIL' && selectedEvent) {
        onBreadcrumbUpdate(selectedEvent.title);
      }
    }
  }, [filter, onBreadcrumbUpdate, viewMode, selectedEvent, displayFormat, timeFilter]);

  const handleEventClick = (event: HiveEvent) => {
    setSelectedEvent(event);
    setViewMode('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setViewMode('LIST');
    setShowRegistration(false);
    setShowFeedback(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'DETAIL' && selectedEvent) {
    const isPast = selectedEvent.status === 'completed';
    const isCancelled = selectedEvent.status === 'cancelled';
    const registrationClosed = selectedEvent.registrationDeadline ? new Date() > new Date(selectedEvent.registrationDeadline) : false;

    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen animate-in fade-in duration-500 relative">
        <button 
          onClick={handleBackToList}
          className="mb-10 text-sm font-bold text-gray-400 hover:text-hive-blue dark:hover:text-white flex items-center transition-all group"
        >
          <i className="fa-solid fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i> Back to Events
        </button>

        {/* Featured Shine Border for Event Banner */}
        <ShineBorder 
          className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl mb-12 border-0 p-0" 
          color={["#FFAA0D", "#DB3069", "#030A37"]}
          borderWidth={2}
        >
          <div className="relative w-full h-[400px] md:h-[560px]">
            <LazyImage 
              src={selectedEvent.image} 
              alt={selectedEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-8 right-8 bg-white/90 dark:bg-hive-blue/90 backdrop-blur-md px-8 py-3 rounded-3xl text-sm font-black uppercase tracking-[0.3em] text-hive-blue dark:text-white shadow-2xl border border-white/20">
              {selectedEvent.type}
            </div>
          </div>
        </ShineBorder>

        {/* Event Detail Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-hive-blue dark:text-white mb-4 font-heading">{selectedEvent.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2"><i className="fa-regular fa-calendar text-hive-gold"></i> {new Date(selectedEvent.datetime.start).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><i className="fa-regular fa-clock text-hive-gold"></i> {new Date(selectedEvent.datetime.start).toLocaleTimeString()} - {new Date(selectedEvent.datetime.end).toLocaleTimeString()}</span>
                        <span className="flex items-center gap-2"><i className="fa-solid fa-location-dot text-hive-gold"></i> {selectedEvent.location.name}</span>
                    </div>
                </div>

                <div 
                    className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-body"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedEvent.description || '') }} 
                />

                {/* Organizers */}
                {eventOrganizers.length > 0 && (
                    <div className="pt-8 border-t border-gray-100 dark:border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Event Organizers</h3>
                        <div className="flex flex-wrap gap-6">
                            {eventOrganizers.map((org, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Avatar src={org.image} fallback={org.name.charAt(0)} className="w-10 h-10 border border-hive-gold" />
                                    <div>
                                        <p className="font-bold text-hive-blue dark:text-white text-sm">{org.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">{org.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
                <Card className="p-8 border-t-4 border-t-hive-gold">
                    <div className="text-center mb-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Registration Status</p>
                        {isPast ? (
                            <span className="inline-block px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-full text-xs font-bold text-gray-500 uppercase">Event Ended</span>
                        ) : isCancelled ? (
                            <span className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-xs font-bold text-red-500 uppercase">Cancelled</span>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-hive-blue dark:text-white">{selectedEvent.capacity - selectedEvent.registeredCount}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Seats Remaining</p>
                            </div>
                        )}
                    </div>

                    {!isPast && !isCancelled && (
                        <Button 
                            className="w-full mb-4" 
                            size="lg" 
                            disabled={registrationClosed}
                            onClick={() => setShowRegistration(true)}
                        >
                            {registrationClosed ? 'Registration Closed' : 'Register Now'}
                        </Button>
                    )}

                    {isPast && (
                        <Button 
                            className="w-full mb-4" 
                            variant="secondary"
                            onClick={() => setShowFeedback(true)}
                        >
                            Give Feedback
                        </Button>
                    )}

                    {selectedEvent.resources && selectedEvent.resources.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Resources</p>
                            <div className="space-y-2">
                                {selectedEvent.resources.map((res, idx) => (
                                    <a key={idx} href={res.url} className="flex items-center gap-2 text-sm font-bold text-hive-blue dark:text-white hover:text-hive-gold transition-colors">
                                        <i className={`fa-solid ${res.type === 'pdf' ? 'fa-file-pdf' : 'fa-link'}`}></i>
                                        {res.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>

        {/* Modals */}
        {showRegistration && (
            <EventRegistration 
              event={selectedEvent} 
              onClose={() => setShowRegistration(false)} 
              onSuccess={() => { setShowRegistration(false); alert('Registration Successful!'); }} 
            />
        )}
        {showFeedback && (
            <EventFeedback event={selectedEvent} onClose={() => setShowFeedback(false)} />
        )}
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
       <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
             <h1 className="text-5xl md:text-6xl font-black text-hive-blue dark:text-white mb-4 font-heading">Events Hub</h1>
             <p className="text-gray-500 dark:text-gray-400 max-w-xl">Join the buzz. Workshops, hackathons, and socials designed to elevate your skills.</p>
          </div>
          
          <div className="flex flex-col gap-4 items-end">
             <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex">
                <button onClick={() => setTimeFilter('UPCOMING')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${timeFilter === 'UPCOMING' ? 'bg-white dark:bg-hive-blue shadow text-hive-blue dark:text-white' : 'text-gray-500'}`}>Upcoming</button>
                <button onClick={() => setTimeFilter('PAST')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${timeFilter === 'PAST' ? 'bg-white dark:bg-hive-blue shadow text-hive-blue dark:text-white' : 'text-gray-500'}`}>Archive</button>
             </div>
             
             <div className="flex gap-2">
                <button onClick={() => setDisplayFormat('CARDS')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${displayFormat === 'CARDS' ? 'bg-hive-gold text-hive-blue' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}><i className="fa-solid fa-grid-2"></i></button>
                <button onClick={() => setDisplayFormat('CALENDAR')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${displayFormat === 'CALENDAR' ? 'bg-hive-gold text-hive-blue' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}><i className="fa-solid fa-calendar-days"></i></button>
             </div>
          </div>
       </div>

       {displayFormat === 'CALENDAR' ? (
          <EventCalendar onEventClick={handleEventClick} />
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredEvents.map((event, idx) => (
                <div 
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="group relative cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                   <div className="absolute inset-0 bg-hive-gold blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[2.5rem]"></div>
                   <Card className="h-full flex flex-col border-gray-100 dark:border-white/5 hover:border-hive-gold/30 transition-all duration-300 rounded-[2.5rem]">
                      <div className="relative h-56 overflow-hidden shrink-0">
                         <LazyImage src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute top-4 left-4">
                            <Badge variant={event.type === 'hackathon' ? 'default' : 'secondary'} className="uppercase tracking-widest text-[10px] font-black shadow-lg backdrop-blur-md">
                               {event.type}
                            </Badge>
                         </div>
                         <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 to-transparent"></div>
                         <div className="absolute bottom-6 left-6 text-white">
                            <p className="font-bold text-lg leading-tight mb-1">{new Date(event.datetime.start).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</p>
                            <p className="text-[10px] uppercase tracking-widest opacity-80">{new Date(event.datetime.start).toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'})}</p>
                         </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-grow">
                         <h3 className="text-xl font-black text-hive-blue dark:text-white mb-3 group-hover:text-hive-gold transition-colors leading-tight font-heading">{event.title}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-grow">{event.description}</p>
                         
                         <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                               <i className="fa-solid fa-location-dot text-hive-gold"></i>
                               <span className="truncate max-w-[120px]">{event.location.name}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-hive-gold group-hover:text-hive-blue transition-colors">
                               <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
                            </div>
                         </div>
                      </div>
                   </Card>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};

export default EventSection;