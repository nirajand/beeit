
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Member, Yearbook } from '../types';
import { PixelImage } from './ui/PixelImage';

const TeamSection: React.FC = () => {
  const { team, yearbooks } = useData();
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [activeYearbook, setActiveYearbook] = useState<Yearbook | null>(null);

  // Derive available years from team data
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(team.map(m => m.year)));
    return years.sort((a, b) => b - a); // Sort descending (latest first)
  }, [team]);

  // Default to the latest year if available, otherwise 2025
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || new Date().getFullYear());

  const filteredTeam = useMemo(() => {
    return team.filter(m => m.year === selectedYear);
  }, [team, selectedYear]);

  // Reusable SVG Component for Journey Visualization
  const JourneyPath = ({ journey }: { journey: string[] }) => {
    const count = journey.length;
    const width = Math.max(600, count * 150); // Ensure minimal width per node
    const height = 200;
    const spacing = width / (count + 1);
    
    let d = `M ${spacing} 100`;
    for(let i = 1; i < count; i++) {
        const x = spacing * (i + 1);
        const cp1x = spacing * i + spacing / 2;
        const cp2x = spacing * (i + 1) - spacing / 2;
        // Alternating wave pattern
        const yOffset = i % 2 === 0 ? -40 : 40;
        d += ` C ${cp1x} ${100 + yOffset}, ${cp2x} ${100 - yOffset}, ${x} 100`;
    }

    return (
      <div className="relative w-full overflow-hidden py-10 bg-hive-blue/5 dark:bg-white/5 rounded-3xl">
        <div className="overflow-x-auto no-scrollbar">
           <svg viewBox={`0 0 ${width} ${height}`} style={{ width: `${width}px`, height: `${height}px` }} className="min-w-full">
             <defs>
               <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#FFAA0D" />
                 <stop offset="100%" stopColor="#DB3069" />
               </linearGradient>
               <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
             </defs>
             
             {/* Path Line */}
             <path 
               d={d} 
               fill="none" 
               stroke="url(#journeyGradient)" 
               strokeWidth="4" 
               strokeLinecap="round"
               filter="url(#glow)"
               className="animate-pulse"
             />

             {/* Nodes */}
             {journey.map((step, idx) => {
               const x = spacing * (idx + 1);
               return (
                 <g key={idx} className="group/node cursor-pointer">
                   {/* Outer Glow Circle */}
                   <circle cx={x} cy={100} r="14" fill="#030A37" stroke="#FFAA0D" strokeWidth="2" className="group-hover/node:fill-hive-gold transition-colors duration-300" />
                   
                   {/* Inner Dot */}
                   <circle cx={x} cy={100} r="6" fill="#FFAA0D" className="group-hover/node:scale-150 transition-transform duration-300 origin-center" />
                   
                   {/* Label */}
                   <text 
                     x={x} 
                     y={idx % 2 === 0 ? 140 : 60} 
                     textAnchor="middle" 
                     className="fill-hive-blue dark:fill-white font-bold text-xs uppercase tracking-wider"
                     style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                   >
                     {step}
                   </text>
                 </g>
               );
             })}
           </svg>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2 md:hidden">Scroll horizontally to view path</p>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-6xl font-bold text-hive-blue dark:text-white mb-6 font-heading">Leadership & Team</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">The collective ambition driving BEE-IT HIVE's community, technical growth, and student success initiatives at Gandaki University.</p>
        
        {/* Year Filter & Yearbook Triggers */}
        <div className="mt-12 flex flex-col items-center gap-6">
           {/* Year Selector */}
           <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex overflow-x-auto max-w-full no-scrollbar">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    selectedYear === year 
                      ? 'bg-white shadow-sm dark:bg-hive-blue text-hive-blue dark:text-white' 
                      : 'text-gray-500 hover:text-hive-blue dark:hover:text-white'
                  }`}
                >
                  Committee {year}
                </button>
              ))}
           </div>

           {yearbooks.length > 0 && (
             <div className="flex flex-wrap justify-center gap-4">
                {yearbooks.map(yb => (
                  <button 
                    key={yb.id}
                    onClick={() => setActiveYearbook(yb)}
                    className="inline-flex items-center gap-2 bg-hive-gold text-hive-blue px-6 py-3 rounded-2xl font-bold hover:bg-white hover:text-hive-blue transition-all shadow-xl shadow-hive-gold/10 border-2 border-transparent hover:border-hive-blue text-sm"
                  >
                     <i className="fa-solid fa-book-open"></i> {yb.year} Yearbook
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
        {filteredTeam.length > 0 ? (
          filteredTeam.map((member, idx) => (
            <div 
              key={member.id} 
              className="bg-white dark:bg-white/5 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-500"
              style={{ animationDelay: `${idx * 150}ms` }}
              onClick={() => setActiveMember(member)}
            >
              <div className="relative mb-8 flex justify-center">
                 <div className="absolute inset-0 bg-hive-gold/10 rounded-full scale-125 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="w-48 h-48 rounded-full border-4 border-hive-gold/10 relative z-10 overflow-hidden group-hover:border-hive-gold transition-all duration-500 group-hover:scale-105 bg-gray-200">
                   <PixelImage 
                     src={member.image} 
                     alt={member.name}
                     className="w-full h-full"
                     pixelSize={6}
                   />
                 </div>

                 <div className="absolute bottom-4 right-[20%] bg-white dark:bg-hive-blue text-hive-blue w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-20 border-4 border-hive-gold/20 font-bold group-hover:rotate-12 transition-transform">
                    <i className={`fa-solid ${idx === 0 ? 'fa-crown' : idx === 1 ? 'fa-user-tie' : 'fa-shield-halved'} text-hive-gold`}></i>
                 </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-1 group-hover:text-hive-gold transition-colors">{member.name}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-[0.25em] text-[11px] mb-6">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 italic mb-10 leading-relaxed px-4">"{member.message}"</p>
                <button 
                  className="w-full bg-hive-blue text-white py-4 rounded-3xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg active:scale-95"
                  onClick={(e) => { e.stopPropagation(); setActiveMember(member); }}
                >
                  View Journey Path
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem]">
             <p className="text-gray-400 font-bold uppercase tracking-widest">No members found for {selectedYear}</p>
          </div>
        )}
      </div>

      {/* STR-02: Member Journey Visualization Modal */}
      {activeMember && (
        <div className="fixed inset-0 z-[200] bg-hive-blue/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0b1129] max-w-4xl w-full rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col lg:flex-row border border-white/10 max-h-[90vh] lg:max-h-[800px]">
             <div className="lg:w-2/5 bg-hive-blue p-12 text-white flex flex-col justify-center items-center text-center relative shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-hive-gold/10 blur-[60px] rounded-full"></div>
                <img src={activeMember.image} className="w-48 h-48 rounded-full border-4 border-hive-gold mb-8 shadow-2xl" alt={activeMember.name} />
                <h2 className="text-3xl font-bold">{activeMember.name}</h2>
                <div className="mt-3">
                   <span className="text-hive-gold font-bold uppercase tracking-widest text-xs opacity-80 block">{activeMember.role}</span>
                   <span className="text-white/60 font-mono text-[10px] mt-1 block">Tenure: {activeMember.year}</span>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 w-full">
                  <p className="text-gray-300 italic text-sm leading-relaxed px-6">"{activeMember.message}"</p>
                </div>
             </div>
             
             <div className="lg:w-3/5 p-12 lg:p-16 flex flex-col justify-between bg-white dark:bg-transparent overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                   <div>
                     <h3 className="text-2xl font-bold text-hive-blue dark:text-white">Tenure Progression</h3>
                     <p className="text-sm text-gray-400 mt-1">Growth milestones within the BEE-IT HIVE organization.</p>
                   </div>
                   <button onClick={() => setActiveMember(null)} className="w-12 h-12 bg-gray-50 dark:bg-white/10 text-gray-400 hover:text-hive-blue hover:bg-gray-100 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-all text-xl">
                    <i className="fa-solid fa-xmark"></i>
                   </button>
                </div>

                <div className="mb-12">
                   {/* Render the reusable SVG component */}
                   <JourneyPath journey={activeMember.journey} />
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 flex items-center">
                      <i className="fa-solid fa-circle-info mr-4 text-hive-gold text-2xl"></i>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                        Every committee member's journey reflects our core commitment to student empowerment and technical excellence at Gandaki University.
                      </p>
                   </div>
                   <button 
                     onClick={() => setActiveMember(null)}
                     className="w-full bg-hive-blue text-white py-5 rounded-[2rem] font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl active:scale-95"
                   >
                     Close Visualization
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* STR-04: Digital Yearbook Modal */}
      {activeYearbook && (
         <div className="fixed inset-0 z-[250] bg-white dark:bg-[#020515] overflow-y-auto animate-in slide-in-from-bottom-20 duration-500">
            <div className="max-w-7xl mx-auto px-4 py-20 relative">
               <button 
                  onClick={() => setActiveYearbook(null)}
                  className="fixed top-8 right-8 z-50 w-14 h-14 bg-hive-blue text-white rounded-full flex items-center justify-center hover:bg-hive-gold transition-colors shadow-2xl"
               >
                  <i className="fa-solid fa-xmark text-xl"></i>
               </button>

               <div className="text-center mb-24">
                  <span className="text-hive-gold font-bold tracking-[0.5em] uppercase text-sm mb-4 block">Official Record</span>
                  <h1 className="text-5xl md:text-7xl font-bold text-hive-blue dark:text-white mb-6">Digital Yearbook {activeYearbook.year}</h1>
                  <div className="inline-block bg-hive-blue/5 dark:bg-white/10 px-8 py-3 rounded-full">
                     <span className="text-xl font-bold text-hive-blue dark:text-white font-redhat">Theme: {activeYearbook.theme}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                  <div className="space-y-8">
                     <h2 className="text-4xl font-bold text-hive-blue dark:text-white border-l-8 border-hive-gold pl-6">Executive Summary</h2>
                     <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                        {activeYearbook.executiveSummary}
                     </p>
                     <div className="grid grid-cols-1 gap-4">
                        {activeYearbook.highlights.map((highlight, idx) => (
                           <div key={idx} className="flex items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                 <i className="fa-solid fa-check"></i>
                              </div>
                              <span className="font-bold text-hive-blue dark:text-white">{highlight}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 h-[500px]">
                     {activeYearbook.collage.map((img, idx) => (
                        <div key={idx} className={`rounded-3xl overflow-hidden ${idx === 1 ? 'row-span-2' : ''}`}>
                           <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Memory" />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-hive-blue text-white rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  <i className="fa-solid fa-quote-left text-6xl text-hive-gold mb-8 opacity-50"></i>
                  <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight">
                     "This tenure wasn't just about events; it was about building a culture where every BIT student feels empowered to create."
                  </h2>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default TeamSection;
