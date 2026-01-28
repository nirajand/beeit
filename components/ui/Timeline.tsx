import React, { useRef, useEffect, useState, useMemo } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils";
import { Button } from "./Button";
import { ArrowLeft, ZoomIn } from "lucide-react";

export interface TimelineEntry {
  year: string;
  title: string;
  category: string;
  content: React.ReactNode;
}

const getCategoryStyles = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('hackathon')) return {
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]'
  };
  if (cat.includes('workshop')) return {
    bg: 'bg-green-500',
    border: 'border-green-400',
    shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]'
  };
  if (cat.includes('collaboration')) return {
    bg: 'bg-orange-500',
    border: 'border-orange-400',
    shadow: 'shadow-[0_0_10px_rgba(249,115,22,0.5)]'
  };
  // Default (Social, etc)
  return {
    bg: 'bg-hive-gold',
    border: 'border-hive-gold/50',
    shadow: 'shadow-[0_0_10px_rgba(255,170,13,0.5)]'
  };
};

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  
  // Group data by year
  const groupedData = useMemo(() => {
    const groups: Record<string, TimelineEntry[]> = {};
    data.forEach(entry => {
      if (!groups[entry.year]) groups[entry.year] = [];
      groups[entry.year].push(entry);
    });
    // Sort years descending
    return Object.entries(groups).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  }, [data]);

  const activeData = useMemo(() => {
    if (!selectedYear) return [];
    return groupedData.find(([year]) => year === selectedYear)?.[1] || [];
  }, [selectedYear, groupedData]);

  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, selectedYear]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white dark:bg-[#020515] font-sans md:px-10" ref={containerRef}>
      
      <AnimatePresence mode="wait">
        {!selectedYear ? (
          <motion.div 
            key="year-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto py-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
              {groupedData.map(([year, entries]) => (
                <motion.div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-hive-gold/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ZoomIn className="w-24 h-24 text-hive-blue dark:text-white" />
                  </div>
                  
                  <h3 className="text-6xl font-black text-hive-blue dark:text-white mb-4 font-heading group-hover:text-hive-gold transition-colors">
                    {year}
                  </h3>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                      <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                        {entries.length} Milestones
                      </span>
                    </div>
                    
                    {/* Visual Markers Preview */}
                    <div className="flex gap-2 pt-2">
                      {entries.slice(0, 5).map((entry, idx) => {
                        const styles = getCategoryStyles(entry.category);
                        return (
                          <div 
                            key={idx} 
                            className={cn("w-3 h-3 rounded-full", styles.bg, styles.shadow)} 
                            title={entry.category}
                          />
                        );
                      })}
                      {entries.length > 5 && <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-white/20 text-[8px] flex items-center justify-center font-bold text-gray-500">+</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timeline-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="sticky top-24 z-50 px-4 md:px-0 mb-12 max-w-7xl mx-auto flex items-center justify-between">
               <Button 
                 onClick={() => setSelectedYear(null)}
                 variant="secondary"
                 className="gap-2 pl-4 rounded-xl"
               >
                 <ArrowLeft className="w-4 h-4" /> Back to Years
               </Button>
               <span className="text-4xl font-black text-hive-gold font-heading drop-shadow-sm">{selectedYear}</span>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
              {activeData.map((item, index) => {
                const styles = getCategoryStyles(item.category);
                
                return (
                  <div key={index} className="flex justify-start pt-20 md:pt-40 md:gap-10">
                    <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                      <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-[#0b1129] flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 z-50">
                        <div className={cn("h-3 w-3 rounded-full border", styles.bg, styles.border, styles.shadow)} />
                      </div>
                      <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl font-bold text-neutral-500 dark:text-neutral-400 font-heading leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    <div className="relative pl-20 pr-4 md:pl-4 w-full">
                      <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-400 font-heading">
                        {item.title}
                      </h3>
                      {item.content}
                    </div>
                  </div>
                );
              })}
              
              <div
                style={{ height: height + "px" }}
                className="absolute left-[31px] top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
              >
                <motion.div
                  style={{ height: heightTransform, opacity: opacityTransform }}
                  className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                >
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-20 bg-gradient-to-t from-hive-gold to-transparent blur-md"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
