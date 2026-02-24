"use client";

import { useState } from "react";

type Appointment = {
  confirmation_code: string;
  appointment_date: string;
  slot_time: string;
  status: "RESERVED" | "CONFIRMED" | "CANCELLED" | "DONE";
};

export default function HistoryPage() {
  const [mobile, setMobile] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Proper modern typing
  const fetchHistory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/history/${mobile}`);

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (code: string) => {
    if (!confirm("Cancel appointment?")) return;

    try {
      // ✅ Correct backend route (based on our Express setup)
      await fetch(`http://localhost:5000/api/status/cancel/${code}`, {
        method: "POST",
      });

      // Instead of router.refresh, re-fetch history
      fetchHistory({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    } catch (err) {
      console.error("Cancel failed");
    }
  };

  const statusStyles: Record<Appointment["status"], string> = {
    RESERVED: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    DONE: "bg-blue-100 text-blue-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO */}
      <section className="bg-linear-to-r from-teal-700 to-emerald-500 text-white py-14 text-center">
        <h1 className="text-3xl font-bold">Appointment History</h1>
      </section>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
        {/* SEARCH FORM */}
        <div className="bg-white p-6 rounded-3xl shadow mb-8">
          <form
            onSubmit={fetchHistory}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Enter Mobile Number"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <button
              type="submit"
              className="bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-800 transition"
            >
              {loading ? "Loading..." : "View History"}
            </button>
          </form>
        </div>

        {/* RESULTS */}
        {appointments.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>

            {appointments.map((a) => (
              <div
                key={a.confirmation_code}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold">{a.confirmation_code}</p>
                    <p className="text-sm text-slate-500">
                      {a.appointment_date} • {a.slot_time}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[a.status]
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="flex gap-4 mt-4 flex-wrap">
                  {/* ✅ Correct PDF route */}
                  <a
                    href={`http://localhost:5000/api/pdf/${a.confirmation_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 text-sm font-medium hover:underline"
                  >
                    📄 Download PDF
                  </a>

                  {a.status === "RESERVED" && (
                    <button
                      onClick={() => cancelAppointment(a.confirmation_code)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare • Online Homeopathy Consultation
      </footer>
    </main>
  );
}
