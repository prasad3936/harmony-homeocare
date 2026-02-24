"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function UploadSuccessPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const code = searchParams.get("code");

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* CENTER CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6">✅</div>

          <h1 className="text-3xl font-bold mb-4">
            Reports Uploaded Successfully
          </h1>

          <p className="text-slate-600 mb-4">
            Thank you{" "}
            <span className="font-semibold text-teal-700">
              {name || "Patient"}
            </span>
            .
          </p>

          <p className="text-slate-600 mb-8">
            Your medical reports have been received for appointment{" "}
            <span className="font-semibold text-teal-700">{code}</span>.
          </p>

          <Link
            href="/"
            className="inline-block bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-800 transition"
          >
            Return Home
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare • Online Homeopathy Consultation
      </footer>
    </main>
  );
}
