import localFont from "next/font/local";

export const onest = localFont({
  src: [
    { path: "../../public/static/Onest-Thin.ttf", weight: "100", style: "normal" },
    { path: "../../public/static/Onest-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../../public/static/Onest-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/static/Onest-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/static/Onest-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/static/Onest-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/static/Onest-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/static/Onest-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../../public/static/Onest-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-onest",
  display: "swap",
});
