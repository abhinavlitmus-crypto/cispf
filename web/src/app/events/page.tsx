import type { Metadata } from "next";
import EventsListing from "@/components/sections/events/EventsListing/EventsListing";
import JoinUs from "@/components/common/JoinUs/JoinUs";

export const metadata: Metadata = {
  title: "Events | Canada-India Strategic Partnership Forum",
  description: "Upcoming and past events from the Canada-India Strategic Partnership Forum.",
};

export default function EventsPage() {
  return (
    <>
      <main>
        <EventsListing />
      </main>
      <JoinUs />
    </>
  );
}
