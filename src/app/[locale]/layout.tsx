import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import {
  Instrument_Sans,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import "../globals.css";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const fontSans = Instrument_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://yasinhessnawi.online";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: "Yasin Hessnawi", template: "%s | Yasin Hessnawi" },
    description: t("description"),
    icons: { icon: "/favicon.ico" },
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: { en: "/", no: "/no", "x-default": "/" },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: locale === "en" ? "/" : `/${locale}`,
      siteName: "Yasin Hessnawi",
      locale: locale === "no" ? "nb_NO" : "en_US",
      type: "website",
      images: ["/me.JPG"],
    },
    twitter: { title: "Yasin Hessnawi", card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as never)) notFound();
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale === "no" ? "nb" : "en"}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen bg-bg font-sans text-fg antialiased",
          fontDisplay.variable,
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          value={{ light: "theme-light", dark: "theme-dark" }}
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[90]" />
      </body>
    </html>
  );
}
