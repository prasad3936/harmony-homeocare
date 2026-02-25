"use client";

import { useState } from "react";

type Appointment = {
  confirmation_code: string;
  patient_name: string;
  mobile: string;
  appointment_date: string;
  slot_time: string;
  status: "RESERVED" | "CONFIRMED" | "CANCELLED" | "DONE";
  meeting_link?: string;
};

export default function StatusPage() {
  const [code, setCode] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${code}`);
    const data = await res.json();

    setAppointment(data);
    setLoading(false);
  };

  const cancelAppointment = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cancel/${appointment?.confirmation_code}`,
      { method: "POST" },
    );

    alert("Appointment Cancelled");
    setAppointment(null);
  };

  const statusColor = {
    RESERVED: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    DONE: "bg-blue-100 text-blue-700",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-linear-to-r from-teal-700 to-emerald-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Check Appointment Status</h1>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          {/* FORM */}
          <form
            onSubmit={checkStatus}
            className="flex gap-4 mb-8 flex-col md:flex-row"
          >
            <input
              type="text"
              placeholder="Enter Confirmation Number (e.g. MB-20260207-0001)"
              required
              className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              type="submit"
              className="bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-800 transition"
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </form>

          {/* RESULT */}
          {appointment && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Appointment Details</h2>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-slate-500">Confirmation No</p>
                  <p className="font-semibold">
                    {appointment.confirmation_code}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Patient Name</p>
                  <p>{appointment.patient_name}</p>
                </div>

                <div>
                  <p className="text-slate-500">Mobile</p>
                  <p>{appointment.mobile}</p>
                </div>

                <div>
                  <p className="text-slate-500">Date</p>
                  <p>{appointment.appointment_date}</p>
                </div>

                <div>
                  <p className="text-slate-500">Time</p>
                  <p>{appointment.slot_time}</p>
                </div>

                <div>
                  <p className="text-slate-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[appointment.status]}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>

              {/* STATUS LOGIC */}

              {appointment.status === "RESERVED" && (
                <div className="space-y-4">
                  <p className="text-yellow-700 bg-yellow-50 p-4 rounded-xl">
                    ⏳ Your slot is temporarily reserved. Please complete
                    payment to confirm.
                  </p>

                  <button
                    onClick={cancelAppointment}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}

              {appointment.status === "CONFIRMED" && (
                <div className="space-y-4">
                  <p className="text-green-700 bg-green-50 p-4 rounded-xl">
                    ✅ Your appointment is confirmed.
                  </p>

                  <div>
                    <p className="font-semibold">Meeting Link:</p>
                    {appointment.meeting_link ? (
                      <a
                        href={appointment.meeting_link}
                        target="_blank"
                        className="text-teal-600 underline"
                      >
                        Join Consultation
                      </a>
                    ) : (
                      <p>Will be shared shortly via WhatsApp.</p>
                    )}
                  </div>

                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/appointment/pdf/${appointment.confirmation_code}`}
                    target="_blank"
                    className="inline-block bg-teal-700 text-white px-6 py-2 rounded-xl hover:bg-teal-800 transition"
                  >
                    📄 Download Receipt
                  </a>
                </div>
              )}

              {appointment.status === "CANCELLED" && (
                <p className="text-red-700 bg-red-50 p-4 rounded-xl">
                  ❌ This appointment has been cancelled.
                </p>
              )}

              {appointment.status === "DONE" && (
                <p className="text-blue-700 bg-blue-50 p-4 rounded-xl">
                  🩺 Consultation completed. Thank you for choosing Harmony
                  HomeoCare.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare • Online Homeopathy Consultation
      </footer>
    </main>
  );
}
