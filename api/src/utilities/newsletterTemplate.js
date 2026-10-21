const moment = require('moment');

// Email clients (Gmail, Outlook) strip CSS variables and much of <style>,
// so colors are literal and key styles are inlined on each element.
const COLORS = {
    background: "#332a22",
    text: "#d1cbc5",
    muted: "#e0d9d2",
    accent: "#df3d00",
    border: "#62564a",
    faded: "#a99e93",
};

const SOCIALS = [
    { key: "facebook", label: "Facebook" },
    { key: "twitter", label: "X" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "whatsapp", label: "WhatsApp" },
];

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Mail clients block non-https images; Cloudinary uploads are stored as http://
function secureUrl(url = "") {
    return url.replace(/^http:\/\//i, "https://");
}

function renderSection(section) {
    const image = section.image
        ? `<img src="${escapeHtml(secureUrl(section.image))}" alt="${escapeHtml(section.title)}" width="360" style="display:block;width:100%;max-width:360px;height:auto;margin:0 0 24px;border:0;border-radius:6px;">`
        : "";
    const title = section.title
        ? `<h2 style="margin:0 0 25px;color:${COLORS.text};font-size:16px;font-weight:700;line-height:1.62;">${escapeHtml(section.title)}</h2>`
        : "";
    const description = section.description
        ? `<p style="margin:0 0 25px;color:${COLORS.muted};font-size:13px;line-height:2;">${escapeHtml(section.description).replace(/\n/g, "<br>")}</p>`
        : "";
    const button = section.buttonLink
        ? `<a href="${escapeHtml(section.buttonLink)}" class="story-link" target="_blank" rel="noopener noreferrer" style="display:block;width:100%;padding:12px 16px;border-radius:6px;background:${COLORS.accent};color:#1f1a16;font-size:13px;font-weight:700;text-align:center;text-decoration:none;">${escapeHtml(section.buttonText || "Full Story")}</a>`
        : "";

    return `
      <article class="story" style="margin-bottom:90px;">
        ${image}
        ${title}
        ${description}
        ${button}
      </article>`;
}

function renderSocials(socialLinks = {}) {
    const links = SOCIALS
        .filter(({ key }) => socialLinks[key])
        .map(({ key, label }) => `
        <a class="${key}" href="${escapeHtml(socialLinks[key])}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 4px 8px;padding:9px 11px;border:1px solid ${COLORS.border};border-radius:5px;color:${COLORS.muted};font-family:Arial,sans-serif;font-size:11px;text-decoration:none;">${label}</a>`)
        .join("");

    if (!links) return "";
    return `
      <h2 style="margin:0 0 18px;font-family:'DM Serif Display',Georgia,serif;font-size:19px;font-weight:400;color:${COLORS.text};">Follow &amp; Share CISPF</h2>
      <div class="social-share">${links}
      </div>`;
}

function renderNewsletter(newsletter = {}, { name } = {}) {
    const title = newsletter.title || "CISPF Daily";
    const date = moment(newsletter.date || new Date()).format("MMMM D, YYYY");
    const year = moment(newsletter.date || new Date()).format("YYYY");
    const greeting = name
        ? `<p style="margin:0 0 40px;color:${COLORS.muted};font-size:13px;">Hi ${escapeHtml(name)},</p>`
        : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet">
  <style>
    .story-link:hover { background: #f04a08 !important; }
    .social-share .facebook:hover { background: #1877f2 !important; border-color: #1877f2 !important; color: #fff !important; }
    .social-share .twitter:hover { background: #000 !important; border-color: #000 !important; color: #fff !important; }
    .social-share .linkedin:hover { background: #0a66c2 !important; border-color: #0a66c2 !important; color: #fff !important; }
    .social-share .whatsapp:hover { background: #25d366 !important; border-color: #25d366 !important; color: #17241b !important; }
    @media (max-width: 600px) {
      .newsletter { padding: 18px 22px 40px !important; }
      .story { margin-bottom: 76px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${COLORS.background};color:${COLORS.text};font-family:'Libre Baskerville',Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.background};">
    <tr>
      <td align="center" class="newsletter" style="padding:26px 20px 50px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:390px;">
          <tr>
            <td align="center" style="padding:25px 12px 60px;">
              <h1 style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:38px;font-weight:400;line-height:1.2;letter-spacing:-1px;color:${COLORS.text};">${escapeHtml(title)}</h1>
              <p style="margin:28px 0 0;font-size:15px;font-weight:700;color:${COLORS.text};">${date}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 15px;">
              ${greeting}
              ${(newsletter.sections || []).map(renderSection).join("")}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 15px 0;border-top:1px solid ${COLORS.border};">
              ${renderSocials(newsletter.socialLinks)}
              <p style="margin:24px 0 0;color:${COLORS.faded};font-family:Arial,sans-serif;font-size:10px;line-height:1.8;">© ${year} ${escapeHtml(title)}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { renderNewsletter };
