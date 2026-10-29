import type { Metadata } from "next";
import { onest } from "@/lib/fonts";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import ReactQueryProvider from "@/constants/queryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CISPF",
  description: "The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${onest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <Header />
          <div className="relative flex flex-1 flex-col">
            {children}
            <Footer />
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
