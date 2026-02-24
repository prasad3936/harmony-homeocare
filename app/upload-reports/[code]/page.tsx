"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function UploadReportsPage() {
  const { code } = useParams();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("report", file);

    await fetch(`http://localhost:5000/api/upload/${code}`, {
      method: "POST",
      body: formData,
    });

    alert("Uploaded successfully");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          📤 Upload Medical Reports
        </h1>

        <p className="text-center text-slate-600 mb-6">
          Confirmation No:
          <span className="font-semibold text-teal-700 ml-2">{code}</span>
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition"
          >
            Upload Reports
          </button>
        </form>
      </div>
    </main>
  );
}
