export const contactAddress = {
  lines: ["145 King St W, Suite 720", "Toronto, ON M5H 1J8 Canada"],
  query: "145 King St W, Suite 720, Toronto, ON M5H 1J8, Canada",
};

export const contactMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(contactAddress.query)}&z=11&output=embed`;
export const contactMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress.query)}`;

// TODO: Replace the placeholder phone numbers and email addresses with approved contact details.
export const contactPeople = [
  { name: "Maha Siddiqui", role: "Director, Policy and Strategy, CISPF", phone: "+1 (778) 266-2701", email: "msiddiqui@cispf.org" },
  // { name: "Oindrilla Ray", role: "Intern, CISPF", phone: "+91 0909090909", email: "example@domain.com" },
];
