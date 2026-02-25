"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CancelSuccessClient() {
  const params = useSearchParams();

  const code = params.get("code");
  const waLink = params.get("wa");

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Appointment Cancelled</h1>

        <p className="mb-6">
          Appointment <b>{code}</b> cancelled successfully.
        </p>

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            className="bg-green-500 text-white px-6 py-3 rounded-xl block mb-4"
          >
            Notify Doctor
          </a>
        )}

        <Link href="/" className="bg-slate-800 text-white px-6 py-3 rounded-xl">
          Go Home
        </Link>
      </div>
    </main>
  );
}
