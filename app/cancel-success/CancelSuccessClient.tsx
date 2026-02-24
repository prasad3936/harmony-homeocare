"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CancelSuccessClient() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const waLink = searchParams.get("wa");

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="text-6xl mb-6 text-red-500">❌</div>

          <h1 className="text-3xl font-bold mb-4">Appointment Cancelled</h1>

          <p className="text-slate-600 mb-4">
            Your appointment{" "}
            <span className="font-semibold text-red-600">{code}</span> has been
            cancelled successfully.
          </p>

          <p className="text-slate-500 mb-8">
            Please inform the doctor so they can remove it.
          </p>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition mb-4"
            >
              📲 Notify Doctor on WhatsApp
            </a>
          )}

          <Link
            href="/"
            className="inline-block bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-900 transition"
          >
            Go Home
          </Link>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare
      </footer>
    </main>
  );
}
