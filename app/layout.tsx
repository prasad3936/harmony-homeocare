import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harmony HomeoCare | Online Homeopathy Consultation",
  description:
    "Consult experienced homeopathy doctor online. Book appointments, pay via UPI, and get personalized treatment.",
  keywords: [
    "homeopathy doctor online",
    "homeopathy consultation",
    "natural healing",
  ],
  authors: [{ name: "Harmony HomeoCare" }],
  openGraph: {
    title: "Harmony HomeoCare – Online Consultation",
    description: "Natural healing through expert homeopathy consultations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
