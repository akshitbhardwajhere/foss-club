'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import BackgroundBlur from '@/components/shared/BackgroundBlur';
import PageHeader from '@/components/shared/PageHeader';
import EventCard from '@/components/cards/EventCard';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      <div className="max-w-6xl mx-auto w-full z-10">
        <PageHeader title={filter === 'completed' ? 'Past Events' : filter === 'upcoming' ? 'Upcoming Events' : 'All Events'} />

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-[#08B74F] text-black' : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'upcoming' ? 'bg-[#08B74F] text-black' : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'completed' ? 'bg-[#08B74F] text-black' : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#08B74F] border-t-transparent flex rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-zinc-400">No events found. Check back later.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.filter(evt => {
              const isPast = new Date(evt.date) < new Date();
              if (filter === 'upcoming') return !isPast;
              if (filter === 'completed') return isPast;
              return true;
            }).map((evt, i) => {
              const isPast = new Date(evt.date) < new Date();
              return <EventCard key={evt.id} event={evt} index={i} isPast={isPast} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
