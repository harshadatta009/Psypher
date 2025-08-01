'use client';

import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // 1) Once we know who they are, immediately redirect if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/events');
    }
  }, [isLoaded, isSignedIn, router]);

  // 2) Show a fullscreen spinner while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 3) If the user *just* signed in, we’ve kicked off the redirect → show nothing
  if (isSignedIn) {
    return null;
  }

  // 4) Otherwise show your hero!
  return (
    <div className="bg-gray-50 py-16 min-h-screen flex items-center">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
          Welcome to Tiered Events
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          Unlock exclusive experiences tailored to your membership tier—from free
          community gatherings to platinum-level VIP events.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <SignUpButton>
            <button className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 transition">
              Get Started
            </button>
          </SignUpButton>
          <SignInButton>
            <button className="inline-block px-8 py-4 bg-white border-2 border-indigo-600 rounded-lg text-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
