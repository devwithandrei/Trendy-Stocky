import { Urbanist } from 'next/font/google';
import Head from 'next/head';
import AgeVerification from '@/components/AgeVerification';

import ModalProvider from '@/providers/modal-provider';
import ToastProvider from '@/providers/toast-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import './globals.css';

const font = Urbanist({ subsets: ['latin'] });

export const metadata = {
  title: 'Trendy Stocky',
  description: 'Trendy Stocky - The place for all your purchases.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <html lang="en">
        <body className={font.className}>
          {/* Include AgeVerification component */}
          <AgeVerification />

          <ToastProvider />
          <ModalProvider />
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
};

export default RootLayout;
