import { type Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tiered Events',
  description: 'Discover events by membership tier',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto flex justify-end items-center p-4 gap-4">
                <SignedOut>
                  <SignInButton>
                    <button className="text-gray-700 hover:text-gray-900 transition">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-indigo-600 text-white rounded-full font-medium text-sm h-10 px-5 hover:bg-indigo-700 transition">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>

        </body>
      </html>
    </ClerkProvider>
  );
}
