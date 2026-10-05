export type EventCategory = "upcoming" | "past";

export type EventGalleryImage = {
  src: string;
  alt: string;
};

export type EventItem = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href?: string;
  detailTitle?: string;
  gallery?: EventGalleryImage[];
};

const executiveRoundtable: EventItem = {
  id: "past-1",
  title: "Executive Roundtable with High Commissioner Chris Cooter",
  detailTitle: "Executive Roundtable",
  summary:
    "We brought together senior business and policy leaders in Toronto for an Executive Roundtable with Christopher Cooter, Canada’s High Commissioner to India. The discussion examined how renewed policy coordination, commercial engagement, and institutional trust could support a more stable Canada–India relationship. Participants considered the broader effects of bilateral relations on trade, investment, talent mobility, and community connections. The event helped establish a foundation for continued engagement in Canada and demonstrated the value of candid, senior-level dialogue.",
  image: "/event/img21.jpg",
  imageAlt: "Business and policy leaders in discussion around the table at the Executive Roundtable",
  date: "2026-06-04",
  dateLabel: "June 4, 2026",
  href: "/events/past-1",
  gallery: [
    { src: "/event/img22.jpg", alt: "Participants seated at the table listening during the Executive Roundtable" },
    { src: "/event/img23.jpg", alt: "Senior leaders in conversation over lunch at the Executive Roundtable" },
    { src: "/event/img24.jpg", alt: "Participants gathered for a group photo after the Executive Roundtable" },
  ],
};

const calgaryRoundtable: EventItem = {
  id: "past-2",
  title: "India Roundtable at Calgary Stampede",
  detailTitle: "India Roundtable at Calgary Stampede",
  summary:
    "CISPF Board Member, Gaurav Verma and Director, Policy and Strategy, Maha Siddiqui participated in an India Roundtable held on the sidelines of Alberta’s biggest annual event, Calgary Stampede. The discussion was organized by Invest Alberta and addressed by India’s High Commissioner to Ottawa, Dinesh Patnaik. Alberta’s trust on creating a tech hub in Calgary was channeled through the discussion that look at avenues that are open for India’s IT services.",
  image: "/event/img1.jpg",
  imageAlt: "Delegates in cowboy hats gathered for a group photo at the India Roundtable during Calgary Stampede",
  date: "2026-07-07",
  dateLabel: "July 7, 2026",
  href: "/events/past-2",
  gallery: [
    { src: "/event/img2.jpg", alt: "Three attendees standing together in front of the stage at the Calgary Stampede" },
    { src: "/event/img3.jpg", alt: "Two attendees in conversation on the sidelines of the Calgary Stampede" },
    { src: "/event/img4.jpg", alt: "Guests, one in a cowboy hat, discussing business opportunities" },
  ],
};

function createPlaceholderEvents(category: EventCategory, count: number): EventItem[] {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const date = category === "upcoming" ? "2026-11-11" : "2025-08-11";

    return {
      id: `${category}-${category === "past" ? number + 2 : number}`,
      title: category === "upcoming" ? "Upcoming event" : "Past event",
      summary: "Event details will be added soon.",
      image: "/Image/placeholder-image-3.jpg",
      imageAlt: "Placeholder image for an event",
      date,
      dateLabel: category === "upcoming" ? "Nov 11, 2026" : "Aug 11, 2025",
    };
  });
}

export const eventItems: Record<EventCategory, EventItem[]> = {
  upcoming: createPlaceholderEvents("upcoming", 16),
  past: [executiveRoundtable, calgaryRoundtable, ...createPlaceholderEvents("past", 14)],
};
