import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Page } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Timeline } from './ui/Timeline';
import { BackgroundLines } from './ui/BackgroundLines';
import { ShimmerButton } from './ui/ShimmerButton';
import { VelocityScroll } from './ui/scroll-based-velocity';
import { LOGO_URL } from '../constants';

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

interface HomeSectionProps {
  onPageChange: (page: Page) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ onPageChange }) => {
  const { milestones, articles } = useData();

  // Map timeline data for the Timeline component with Categories for markers
  const timelineData = milestones.map(milestone => ({
    year: milestone.year.toString(),
    title: milestone.milestone,
    category: milestone.category,
    content: (
      <div>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4 text-xs md:text-sm border-l-2 border-gray-200 dark:border-white/10 pl-4">
          {milestone.summary}
        </p>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="text-[9px] md:text-[10px] uppercase tracking-wider border-gray-200 dark:border-white/20 font-bold">
             {milestone.category}
           </Badge>
        </div>
      </div>
    )
  }));

  // Get latest 3 published articles
  const latestArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const HeroContent = () => (
    <div className="relative z-20 max-w-5xl mx-auto text-center px-4 pt-20">
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-6"
      >
        <Badge variant="gold" className="px-4 py-1.5 text-xs uppercase tracking-widest bg-hive-gold/10 text-hive-gold border-hive-gold/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,170,13,0.3)]">
          BIT Students Club
        </Badge>
      </MotionDiv>
      
      <MotionH1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-8xl font-black text-hive-blue dark:text-white mb-6 md:mb-8 leading-tight md:leading-none font-heading tracking-tight drop-shadow-2xl"
      >
        Tech Minds,<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-hive-gold to-yellow-500">Future Finds.</span>
      </MotionH1>
      
      <MotionP 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-xl text-gray-600 dark:text-gray-200 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-medium drop-shadow-md px-2"
      >
        The official digital ecosystem of BEE-IT HIVE at <span className="font-brand-uni font-bold text-hive-blue dark:text-white">Gandaki University</span>. We are building the next generation of innovators in Nepal.
      </MotionP>
      
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <ShimmerButton 
          className="shadow-[0_0_30px_rgba(255,170,13,0.3)] w-full sm:w-auto" 
          shimmerColor="#FFAA0D" 
          background="#030A37"
          onClick={() => onPageChange(Page.Events)}
        >
          <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">Explore Events <i className="fa-solid fa-arrow-right"></i></span>
        </ShimmerButton>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={() => onPageChange(Page.About)} 
          className="w-full sm:w-auto rounded-[16px] text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all bg-white/50 dark:bg-white/5 backdrop-blur-md border border-hive-blue/20 dark:border-white/20 hover:border-hive-gold dark:hover:border-hive-gold text-hive-blue dark:text-white shadow-lg"
        >
          About Us
        </Button>
      </MotionDiv>
    </div>
  );

  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-white dark:bg-[#030A37] transition-colors duration-500 pt-16 md:pt-0">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
            <BackgroundLines className="h-full w-full">
              <img 
                src="https://guic.gurcii.edu.np/wp-content/uploads/2024/10/media1712999178.jpg" 
                alt="Gandaki University" 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Subtle Overlay for readability */}
              <div className="absolute inset-0 bg-white/75 dark:bg-[#030A37]/85 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#030A37] dark:via-transparent dark:to-transparent"></div>
            </BackgroundLines>
        </div>

        {/* Background Lines Effect */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30 dark:opacity-40">
           <BackgroundLines className="bg-transparent h-full w-full">
              <div />
           </BackgroundLines>
        </div>

        {/* Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-hive-gold/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-hive-blue/20 dark:bg-white/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none z-0" />

        <HeroContent />
      </section>

      {/* Velocity Scroll Marquee */}
      <div className="py-6 md:py-8 bg-hive-gold/10 dark:bg-hive-blue/20 border-y border-hive-gold/20 backdrop-blur-sm relative z-20">
         <VelocityScroll 
           text="BEE-IT HIVE • GANDAKI UNIVERSITY • BIT PROGRAM • INNOVATION • COMMUNITY •" 
           default_velocity={2}
           direction='right'
           className="text-hive-blue/80 dark:text-white/20 text-2xl md:text-5xl font-black tracking-tighter"
         />
      </div>


      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-[#020515] border-b border-gray-100 dark:border-white/5 transition-colors duration-500 relative z-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 text-center">
               {[
                 { label: "Active Members", value: "500+" },
                 { label: "Events Hosted", value: "12+" },
                 { label: "Projects Shipped", value: "25+" },
                 { label: "Industry Partners", value: "5" }
               ].map((stat, i) => (
                 <div key={i} className="space-y-1 md:space-y-2">
                    <h3 className="text-3xl md:text-5xl font-black text-hive-blue dark:text-white">{stat.value}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Milestones (Timeline Component) */}
      <section className="py-16 md:py-20 bg-white dark:bg-[#020515]">
        <div className="text-center mb-8 md:mb-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-hive-blue dark:text-white font-heading mb-4">Our Journey</h2>
          <div className="h-1 w-20 bg-hive-gold mx-auto rounded-full"></div>
        </div>
        <Timeline data={timelineData} />
      </section>

      {/* Latest Insights Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-[#0b1129]/50 border-y border-gray-100 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-hive-blue dark:text-white font-heading mb-2">Latest Insights</h2>
                    <p className="text-gray-500 dark:text-gray-400">Fresh perspectives and technical deep-dives from our community.</p>
                </div>
                <Button variant="outline" onClick={() => onPageChange(Page.Articles)} className="hidden md:flex bg-white dark:bg-white/5 hover:bg-hive-gold/10 hover:text-hive-blue border-gray-200 dark:border-white/10">
                    View All Articles <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestArticles.map((article, idx) => (
                    <div 
                        key={article.id}
                        onClick={() => onPageChange(Page.Articles)}
                        className="group cursor-pointer flex flex-col gap-4"
                    >
                        <div className="aspect-[16/9] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative border border-gray-100 dark:border-white/5">
                            <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge variant="ghost" className="bg-white/90 dark:bg-black/60 backdrop-blur text-hive-blue dark:text-white font-bold shadow-sm text-[10px] uppercase tracking-wider">
                                    {article.tags[0]}
                                </Badge>
                            </div>
                        </div>
                        <div className="px-2">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                                <span>{new Date(article.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
                                <span className="w-1 h-1 rounded-full bg-hive-gold"></span>
                                <span>{article.readTime}</span>
                            </div>
                            <h3 className="text-xl font-bold text-hive-blue dark:text-white leading-tight mb-3 group-hover:text-hive-gold transition-colors font-heading">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {article.excerpt}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-hive-blue dark:group-hover:text-white transition-colors">
                                By {article.author}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 md:hidden">
                <Button variant="outline" onClick={() => onPageChange(Page.Articles)} className="w-full">
                    View All Articles
                </Button>
            </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-[#020515]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-8 md:mb-12">
               <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-hive-blue dark:text-white font-heading mb-2">Hive On The Gram</h2>
                  <p className="text-gray-500 text-sm md:text-base">Latest captures from our community.</p>
               </div>
               <a href="https://instagram.com/beeit.hive" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-2 text-hive-blue dark:text-white font-bold uppercase tracking-widest hover:text-hive-gold transition-colors text-xs">
                  Follow Us <i className="fa-solid fa-arrow-right"></i>
               </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
               {[
                  'https://picsum.photos/seed/insta1/400/400',
                  'https://picsum.photos/seed/insta2/400/400',
                  'https://picsum.photos/seed/insta3/400/400',
                  'https://picsum.photos/seed/insta4/400/400'
               ].map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square cursor-pointer">
                     <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Instagram Post" />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i className="fa-brands fa-instagram text-2xl md:text-3xl text-white"></i>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
               <a href="https://instagram.com/beeit.hive" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-hive-blue text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">
                  Follow Us
               </a>
            </div>
         </div>
      </section>

      {/* Powered By Section */}
      <section className="py-12 bg-white dark:bg-[#020515] border-t border-gray-100 dark:border-white/5 relative z-20 overflow-hidden">
        <div className="text-center mb-8">
           <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Powered By & Built With</p>
        </div>
        
        <div className="w-full">
           <VelocityScroll default_velocity={3} className="py-2" rows={1} direction='left'>
              <div className="flex items-center gap-16 md:gap-24 px-8 opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                 {/* Gandaki University */}
                 <div className="h-12 md:h-16 w-auto flex items-center justify-center">
                    <img 
                      src="https://www.gandakiuniversity.edu.np/wp-content/uploads/2023/01/logo-gu-new.png" 
                      className="h-full w-auto object-contain filter-none" 
                      alt="Gandaki Uni" 
                    />
                 </div>
                 {/* GitHub */}
                 <i className="fa-brands fa-github text-4xl md:text-5xl text-gray-700 dark:text-white"></i>
                 
                 {/* Docker */}
                 <i className="fa-brands fa-docker text-4xl md:text-5xl text-[#2496ED]"></i>

                 {/* Git */}
                 <i className="fa-brands fa-git-alt text-4xl md:text-5xl text-[#F05032]"></i>
                 
                 {/* Figma */}
                 <i className="fa-brands fa-figma text-4xl md:text-5xl text-[#F24E1E]"></i>
                 
                 {/* v0 */}
                 <div className="h-8 md:h-10 w-auto flex items-center justify-center">
                    <img 
                      src="https://images.seeklogo.com/logo-png/60/2/v0-logo-png_seeklogo-605781.png" 
                      className="h-full w-auto object-contain dark:invert" 
                      alt="v0" 
                    />
                 </div>
                 
                 {/* ShadCN */}
                 <div className="h-8 md:h-10 w-auto flex items-center justify-center">
                    <img 
                      src="https://images.seeklogo.com/logo-png/51/2/shadcn-ui-logo-png_seeklogo-519786.png" 
                      className="h-full w-auto object-contain dark:invert" 
                      alt="ShadCN" 
                    />
                 </div>
                 
                 {/* React */}
                 <i className="fa-brands fa-react text-4xl md:text-5xl text-[#61DAFB] animate-spin-slow"></i>
              </div>
           </VelocityScroll>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
