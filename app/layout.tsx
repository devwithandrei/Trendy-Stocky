import { Urbanist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { StoreProvider } from "@/contexts/store-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import "./globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: 'Trendy-Stocky',
  description: 'Best Store Ever',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <html lang="en">
        <body className={font.className}>
          <StoreProvider>
            <WishlistProvider>
              <ToastProvider />
              <ModalProvider />
              <Navbar />
              {children}
              <Footer />
              <SpeedInsights />
            </WishlistProvider>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
