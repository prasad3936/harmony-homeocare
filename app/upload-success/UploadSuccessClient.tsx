"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function UploadSuccessClient() {
  const params = useSearchParams();

  const code = params.get("code");

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4">
          Report Uploaded Successfully
        </h1>

        <p className="mb-6">
          Medical reports uploaded for appointment:
          <br />
          <b>{code}</b>
        </p>

        <Link href="/" className="bg-slate-800 text-white px-6 py-3 rounded-xl">
          Go Home
        </Link>
      </div>
    </main>
  );
}
