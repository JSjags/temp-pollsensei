"use client";

import { useState } from "react";
import { generateMockEvents } from "@/lib/mock-calendar-events";
import { CalendarEvent, Mode } from "@/components/calendar/calendar-types";
import Calendar from "@/components/calendar/calendar";

export default function CalendarDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>(generateMockEvents());
  const [mode, setMode] = useState<Mode>("month");
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="p-2">
      <div className="rounded-lg bg-white border border-border">
        <Calendar
          events={events}
          setEvents={setEvents}
          mode={mode}
          setMode={setMode}
          date={date}
          setDate={setDate}
        />
      </div>
    </div>
  );
}
