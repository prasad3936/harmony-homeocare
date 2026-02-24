"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Report = {
  file_name: string;
  file_path: string;
};

export default function AdminReportsPage() {
  const params = useParams();
  const code = params.code as string;

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/reports/${code}`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code]);

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow px-6 py-4 text-center font-semibold">
        Medical Reports
      </header>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            📁 Medical Reports
          </h2>

          <p className="text-center text-slate-600 mb-8">
            Confirmation No:{" "}
            <span className="font-semibold text-teal-700">{code}</span>
          </p>

          {loading ? (
            <p className="text-center text-slate-500">Loading...</p>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((r, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-50 p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <span className="text-sm font-medium">{r.file_name}</span>
                  </div>

                  <a
                    href={`http://localhost:5000/${r.file_path}`}
                    target="_blank"
                    className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 bg-slate-50 p-6 rounded-xl">
              📭 No reports uploaded yet.
            </div>
          )}

          {/* Back Button */}
          <div className="mt-10 text-center">
            <Link
              href="/admin"
              className="inline-block text-teal-700 font-medium hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare • Online Homeopathy Consultation
      </footer>
    </main>
  );
}


