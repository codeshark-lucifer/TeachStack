import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

const kantumruy = Kantumruy_Pro({
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kantumruy",
});

export const metadata: Metadata = {
  title: "TeachStack | ត្រៀមប្រឡង",
  description: "TeachStack Khmer - ប្រព័ន្ធសាកល្បងចំណេះដឹង សម្រាប់ត្រៀមប្រឡងចូលក្រសួង និងស្ថាប័នរដ្ឋ។",
  other: {
    "google-site-verification": "KXeyo7UtK2u-XPGbpyuVn5xtXZE6daXbd0bbGzFS1r0",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo1.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${kantumruy.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <main className="app-shell">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
