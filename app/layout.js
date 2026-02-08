import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop/BackToTop";
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
        url: "https://nagalka-advokat.ua/assets/images/Hover-image.webp",
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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VG4Z8YLFH3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-VG4Z8YLFH3');`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
          <BackToTop />
        </LanguageProvider>
        <Script
          id="binotel-widget"
          src="https://widgets.binotel.com/getcall/widgets/0g6n8j4sex72h4vne9ju.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
