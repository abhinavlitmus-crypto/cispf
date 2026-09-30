import localFont from "next/font/local";

// Only the weights the UI uses (font-light/normal/medium/semibold), as WOFF2.
export const onest = localFont({
  src: [
    { path: "../../public/static/Onest-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/static/Onest-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/static/Onest-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/static/Onest-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-onest",
  display: "swap",
});
