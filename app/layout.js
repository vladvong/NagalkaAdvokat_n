import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop/BackToTop";
import { LanguageProvider } from "../context/LanguageContext";
import BinotelWidget from "../components/BinotelWidget/BinotelWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ярослав Нагалка - Адвокат Київ | Захист бізнесу та фізичних осіб",
  description: "Ярослав Нагалка - адвокат у Києві з 8+ роками досвіду. Захищаю інтереси бізнесу та фізичних осіб у судах, переговорах та адміністративних процедурах. Спори, кримінальні справи, податкові перевірки.",
  keywords: "Ярослав Нагалка адвокат, адвокат Київ, захист бізнесу, судові спори, кримінальні провадження, податкові консультації, юридичні послуги Київ",
  authors: [{ name: "Ярослав Нагалка" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://advokatnagalka.com.ua",
    title: "Ярослав Нагалка - Адвокат у Києві | Захист інтересів бізнесу",
    description: "Понад 8 років досвіду в захисті бізнесу та фізичних осіб. Судові спори, кримінальні провадження, податкові перевірки. Комплексні рішення для зменшення ризиків.",
    siteName: "Ярослав Нагалка Адвокат",
    images: [
      {
        url: "https://advokatnagalka.com.ua/assets/images/Hover-image.webp",
        width: 1200,
        height: 630,
        alt: "Ярослав Нагалка - Адвокат у Києві",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ярослав Нагалка - Адвокат Київ",
    description: "Адвокат у Києві з досвідом 8+ років. Захист бізнесу та фізичних осіб у судах, переговорах та адміністративних процедурах.",
    creator: "@nagalkaadvokat",
  },
  robots: "index, follow",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "https://advokatnagalka.com.ua",
    languages: {
      "uk-UA": "https://advokatnagalka.com.ua/uk",
      "en-US": "https://advokatnagalka.com.ua/en",
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
          <BinotelWidget />
          {children}
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
