import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { LanguageProvider } from "../context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nagalka Advokat | Адвокатська контора - послуги в рекламному праві",
  description: "Nagalka Advokat - спеціалізована адвокатська контора з питань рекламного права. Консультації, представництво у судах, договірна практика.",
  keywords: "адвокатська контора, рекламне право, юридичні послуги, консультації, Nagalka",
  authors: [{ name: "Nagalka Advokat" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://nagalka-advokat.ua",
    title: "Nagalka Advokat | Адвокатська контора",
    description: "Професійні юридичні послуги у сфері рекламного права",
    siteName: "Nagalka Advokat",
    images: [
      {
        url: "https://nagalka-advokat.ua/assets/images/Hover-image.png",
        width: 1200,
        height: 630,
        alt: "Nagalka Advokat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nagalka Advokat",
    description: "Адвокатська контора - послуги в рекламному праві",
    creator: "@nagalkaadvokat",
  },
  robots: "index, follow",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "https://nagalka-advokat.ua",
    languages: {
      "uk-UA": "https://nagalka-advokat.ua/uk",
      "en-US": "https://nagalka-advokat.ua/en",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
