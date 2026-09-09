import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f24] via-[#15143a] to-[#1a1f47] text-white">
      
      {/* Blue glow accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Main container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">

        {/* Auth content */}
        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-7 text-center sm:mb-8">

              <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/10">
                <img
                  src="/og-eventora.png"
                  alt="Eventora"
                  width={32}
                  height={22}
                  className="h-5 w-8 object-contain"
                />
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Create your Eventora account
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/70">
                Join Eventora to discover events, make bookings, and access
                your digital tickets.
              </p>
            </div>

            {/* Clerk card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_0_40px_rgba(59,130,246,0.20)] backdrop-blur-md sm:p-6">
              <div className="flex justify-center">
                <SignUp />
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}