import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/query-provider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buildspace - Learn by building projects",
  description: "Gamified learning platform for developers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(inter.className, "font-sans", geist.variable)}
      >
        <body className="min-h-full flex flex-col">
          <QueryProvider>{children}</QueryProvider></body>
      </html>
    </ClerkProvider>
  );
}
