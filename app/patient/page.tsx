"use client";

import { useState, useEffect } from "react";

type Slot = {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
};

export default function PatientPage() {
  const [consultType, setConsultType] = useState("FIRST");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState({
    patient_name: "",
    mobile: "",
    address: "",
  });

  // 🔥 Fetch slots from backend (Flask API)
  useEffect(() => {
    fetch("process.env.NEXT_PUBLIC_API_URL/api/patient/slots") // change later
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("process.env.NEXT_PUBLIC_API_URL/api/patient/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        consultation_type: consultType,
        slot_id: selectedSlot,
      }),
    });

    const result = await response.json();
    alert(result.message || "Appointment Reserved!");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-linear-to-r from-teal-700 to-emerald-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">Book Your Appointment</h1>
        <p className="opacity-90">Online Homeopathy Consultation</p>
      </section>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PATIENT DETAILS */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Patient Details</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, patient_name: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Mobile Number"
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />

                <textarea
                  placeholder="Postal Address"
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>

            {/* CONSULTATION TYPE */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Consultation Type</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { value: "FIRST", label: "First Consultation", price: 500 },
                  { value: "FOLLOWUP", label: "Follow-up", price: 300 },
                ].map((item) => (
                  <div
                    key={item.value}
                    onClick={() => setConsultType(item.value)}
                    className={`cursor-pointer border rounded-2xl p-6 shadow-sm transition ${
                      consultType === item.value
                        ? "border-teal-600 bg-teal-50"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    <p className="text-teal-600 font-bold text-xl mt-2">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SLOT SELECTION */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Select Available Slot
              </h2>

              <select
                required
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select a slot</option>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.slot_date} • {s.start_time} - {s.end_time}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition"
            >
              Reserve Appointment
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare • Online Homeopathy Consultation
      </footer>
    </main>
  );
}
