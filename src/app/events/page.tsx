"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Tier = "free" | "silver" | "gold" | "platinum";
const tierOrder: Tier[] = ["free", "silver", "gold", "platinum"];

interface Event {
    id: string;
    title: string;
    description: string;
    image_url: string;
    event_date: string;
    tier: Tier;
}

export default function EventsPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not signed in
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace("/");
        }
    }, [isLoaded, isSignedIn, router]);

    // Fetch events once we know the user is signed in
    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            const { data, error: sbErr } = await supabase
                .from("events")
                .select("*")
                .order("event_date", { ascending: true });

            if (sbErr) {
                console.error(sbErr);
                setError(sbErr.message);
                setEvents([]);
            } else {
                setEvents(data || []);
            }
            setLoading(false);
        };

        fetchEvents();
    }, [isLoaded, isSignedIn]);

    // Render guards
    if (!isLoaded) {
        return <p className='p-4'>Checking authentication…</p>;
    }
    if (!isSignedIn) {
        return null; //  redirecting
    }
    if (loading) {
        // skeleton grid
        return (
            <div className='p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className='h-64 border rounded-lg bg-gray-200 animate-pulse'
                    />
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <p className='p-4 text-red-600'>Whoops, something went wrong: {error}</p>
        );
    }

    // Determine which events are locked
    const userTier = (user.publicMetadata.tier as Tier) || "free";
    const userIdx = tierOrder.indexOf(userTier);

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map((e) => {
    const eventIdx = tierOrder.indexOf(e.tier);
    const isLocked = eventIdx > userIdx;

    return (
      <div
        key={e.id}
        className={`
          relative
          border border-gray-200
          rounded-lg
          overflow-hidden
          bg-white
          shadow
          duration-200
          hover:shadow-lg
          hover:-translate-y-1
          group
        `}
      >
        <div className="overflow-hidden">
          <img
            src={e.image_url}
            alt={e.title}
            className="
              w-full h-40 object-cover
              transition-transform duration-200
              group-hover:scale-105
            "
          />
        </div>
        <div className="p-4">
          <h2 className="font-semibold text-lg">{e.title}</h2>
          <p className="text-sm text-gray-600">
            {new Date(e.event_date).toLocaleDateString()}
          </p>
          <span
            className={`
              inline-block mt-2 px-2 py-1 text-xs font-medium rounded
              ${
                e.tier === 'free'
                  ? 'bg-gray-100 text-gray-800'
                  : e.tier === 'silver'
                  ? 'bg-blue-100 text-blue-800'
                  : e.tier === 'gold'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-purple-100 text-purple-800'
              }
            `}
          >
            {e.tier.toUpperCase()}
          </span>
          <p className="mt-2 text-gray-800">{e.description}</p>
        </div>

        {isLocked && (
          <div className="
            absolute inset-0
            bg-white/75 backdrop-blur
            flex flex-col items-center justify-center p-4
          ">
            <p className="mb-2 text-center font-semibold">
              Upgrade to {e.tier.toUpperCase()} to access this event
            </p>
            <button
              onClick={() => router.push('/upgrade')}
              className="
                px-4 py-2
                border border-gray-300
                rounded
                bg-white hover:bg-gray-100
                transition-colors duration-150
              "
            >
              Upgrade
            </button>
          </div>
        )}
      </div>
    );
  })}
</div>


    );
}
