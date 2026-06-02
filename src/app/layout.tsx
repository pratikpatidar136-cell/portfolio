import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AETHER | Creative Director, 3D Designer & Cinematic Video Editor",
  description: "A premium interactive 3D portfolio showcasing high-fidelity cinematic video production, abstract 3D motion graphics, and advanced visual effects.",
  keywords: ["video editor", "3d motion graphics", "vfx", "cinematic editing", "creative director", "graphics design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full bg-[#030303] text-[#f4f4f5] selection:bg-indigo-500/30 selection:text-white flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}


