'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useClerk } from '@clerk/nextjs';

export default function Header() {
  const { signOut } = useClerk();

  return (
    <header className="absolute top-4 right-4 flex items-center gap-2 z-50">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-cyan-500 text-white px-3 py-1.5 rounded-4xl hover:opacity-90 transition">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="bg-cyan-500 text-white px-3 py-1.5 rounded-4xl hover:opacity-90 transition">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            {/* User profile image and dropdown */}
            <UserButton
                afterSignOutUrl="/sign-in"
            />

            {/* Custom sign-out option */}
            <button
              onClick={() => signOut()} // import { useClerk } from '@clerk/nextjs';
              className="bg-cyan-500 text-white px-3 py-1.5 rounded-4xl hover:opacity-90 transition"
            >
              Sign Out
            </button>
          </SignedIn>
    </header>
  );
}
