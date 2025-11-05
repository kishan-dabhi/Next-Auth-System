"use client";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full space-y-6 transition-all duration-300 hover:bg-white/15 hover:border-white/30">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md">
          Next.js Auth Portal
        </h1>
        <p className="text-gray-300 text-sm">
          Secure authentication made simple. Sign up or log in to continue.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-all shadow-md hover:shadow-indigo-500/40"
          >
            <UserPlus size={18} /> Register
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-800 rounded-lg font-medium transition-all shadow-md hover:shadow-slate-500/40"
          >
            <LogIn size={18} /> Login
          </Link>
        </div>

        <p className="text-xs text-gray-400 pt-2">
          Built with ❤️ using Next.js + Tailwind CSS
        </p>
      </div>
    </div>
  );
}
