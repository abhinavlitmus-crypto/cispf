import type { Metadata } from "next";
import EventsListing from "@/components/sections/events/EventsListing/EventsListing";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events | Canada-India Strategic Partnership Forum",
  description: "Upcoming and past events from the Canada-India Strategic Partnership Forum.",
};

// Re-read admin portal content at most every 5 minutes.
export const revalidate = 300;

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <main>
        <EventsListing events={events} />
        <JoinUs />
      </main>
    </>
  );
}
