
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./ui/Button";
import { Calendar } from "./ui/Calendar";
import { Popover } from "./ui/Popover";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  name?: string;
}

export function DateTimePicker({ date, setDate, className, name }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(date);

  useEffect(() => {
    if (date) {
      setSelectedDateTime(date);
    }
  }, [date]);

  const handleSelect = (day: Date | undefined) => {
    if (!day) {
      setSelectedDateTime(undefined);
      setDate(undefined);
      return;
    }
    const newDate = new Date(day);
    if (selectedDateTime) {
      newDate.setHours(selectedDateTime.getHours());
      newDate.setMinutes(selectedDateTime.getMinutes());
    } else {
        // Default to current time if no time selected previously
        const now = new Date();
        newDate.setHours(now.getHours());
        newDate.setMinutes(now.getMinutes());
    }
    setSelectedDateTime(newDate);
    setDate(newDate);
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!selectedDateTime) return;
    const newDate = new Date(selectedDateTime);
    if (type === "hour") {
      newDate.setHours(parseInt(value));
    } else {
      newDate.setMinutes(parseInt(value));
    }
    setSelectedDateTime(newDate);
    setDate(newDate);
  };

  return (
    <>
      <input type="hidden" name={name} value={selectedDateTime ? selectedDateTime.toISOString() : ''} />
      <Popover
        trigger={
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal rounded-xl h-12 border-gray-200 dark:border-white/10 dark:bg-white/5",
              !selectedDateTime && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-hive-gold shrink-0" />
            {selectedDateTime ? (
              <span className="text-hive-blue dark:text-white font-bold truncate">
                {/* Shortened date format to prevent truncation on smaller screens: "May 20, 2025 10:00 AM" */}
                {format(selectedDateTime, "MMM d, yyyy h:mm a")}
              </span>
            ) : (
              <span className="text-gray-400 truncate">Pick a date & time</span>
            )}
          </Button>
        }
        content={
          <div className="w-auto p-0 bg-white dark:bg-[#0b1129] rounded-xl overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDateTime}
              onSelect={handleSelect}
              initialFocus
              className="rounded-t-xl border-b border-gray-100 dark:border-white/5"
            />
            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    Time
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-hive-gold outline-none"
                    value={selectedDateTime ? selectedDateTime.getHours() : 0}
                    onChange={(e) => handleTimeChange("hour", e.target.value)}
                    disabled={!selectedDateTime}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400">:</span>
                  <select
                    className="bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-hive-gold outline-none"
                    value={selectedDateTime ? selectedDateTime.getMinutes() : 0}
                    onChange={(e) => handleTimeChange("minute", e.target.value)}
                    disabled={!selectedDateTime}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
