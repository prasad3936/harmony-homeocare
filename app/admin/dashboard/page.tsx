"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Appointment = {
  id: number;
  patient_name: string;
  appointment_date: string;
  slot_time: string;
  consultation_type: string;
  status: "RESERVED" | "CONFIRMED" | "CANCELLED" | "DONE";
  amount: number;
  meeting_link_final: string;
  payment_whatsapp_link: string;
  confirmation_whatsapp_link: string;
  report_count?: number;
  created_at?: string;
  updated_at?: string;
};

type Slot = {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: number;
};

type Stats = {
  total: number;
  reserved: number;
  confirmed: number;
  today: number;
  revenue: number;
};

type Settings = {
  default_amount: number;
  followup_amount: number;
  default_meeting_link: string;
  upi_link: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  /* ================= STATE ================= */

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    reserved: 0,
    confirmed: 0,
    today: 0,
    revenue: 0,
  });

  const [settings, setSettings] = useState<Settings>({
    default_amount: 0,
    followup_amount: 0,
    default_meeting_link: "",
    upi_link: "",
  });

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  /* ================= LOAD ================= */

  async function loadDashboard() {
    const res = await fetch("http://localhost:5000/api/admin/dashboard", {
      credentials: "include",
    });

    if (res.status === 401) {
      router.push("/admin");
      return;
    }

    const data = await res.json();

    setAppointments(data.appointments || []);
    setSlots(data.slots || []);
    setStats(data.stats || stats);
    setSettings(data.settings || settings);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredAppointments = appointments.filter((a) => {
    if (selectedDate && a.appointment_date !== selectedDate) return false;
    if (fromDate && a.appointment_date < fromDate) return false;
    if (toDate && a.appointment_date > toDate) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (typeFilter && a.consultation_type.toUpperCase() !== typeFilter)
      return false;
    return true;
  });

  /* ================= ACTIONS ================= */

  async function updateStatus(id: number, status: string) {
    await fetch(`http://localhost:5000/api/admin/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    loadDashboard();
  }

  async function updateMeeting(id: number, meeting: string) {
    await fetch(`http://localhost:5000/api/admin/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ meeting_link: meeting }),
    });
    loadDashboard();
  }

  async function sendReminder(id: number) {
    const res = await fetch(
      `http://localhost:5000/api/admin/send-reminder/${id}`,
      { method: "POST", credentials: "include" },
    );
    const data = await res.json();
    window.open(data.whatsappLink, "_blank");
  }

  async function addSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    await fetch("http://localhost:5000/api/admin/add-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        slot_date: fd.get("slot_date"),
        start_time: fd.get("start_time"),
        end_time: fd.get("end_time"),
      }),
    });

    form.reset();
    loadDashboard();
  }

  async function deleteSlot(id: number) {
    await fetch(`http://localhost:5000/api/admin/delete-slot/${id}`, {
      method: "POST",
      credentials: "include",
    });
    loadDashboard();
  }

  async function saveSettings() {
    await fetch("http://localhost:5000/api/admin/update-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(settings),
    });
    setShowSettings(false);
    loadDashboard();
  }

  /* ================= CALENDAR ================= */

  function nextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  }

  function prevMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  }

  function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    return days;
  }

  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-slate-100 p-8 space-y-12">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setViewMode("list")}
            className="bg-white px-4 py-2 rounded"
          >
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className="bg-white px-4 py-2 rounded"
          >
            Calendar
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-teal-700 text-white px-4 py-2 rounded"
          >
            Settings
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Stat label="Total" value={stats.total} />
        <Stat label="Reserved" value={stats.reserved} />
        <Stat label="Confirmed" value={stats.confirmed} />
        <Stat label="Today" value={stats.today} />
        <Stat label="Revenue" value={`₹${stats.revenue}`} />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-2xl shadow flex flex-wrap gap-4 items-end">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="RESERVED">Reserved</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="DONE">Done</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Types</option>
          <option value="FIRST">First</option>
          <option value="FOLLOWUP">Follow Up</option>
        </select>

        <button
          onClick={() => setSelectedDate(null)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Clear Day Filter
        </button>
      </div>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {filteredAppointments.map((a) => (
            <div key={a.id} className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold text-lg">{a.patient_name}</p>
                  <p className="text-sm text-gray-500">
                    {a.appointment_date} • {a.slot_time}
                  </p>
                  <p className="text-sm">
                    ₹{a.amount} • {a.consultation_type}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className="border px-3 py-1 rounded"
                  >
                    <option>RESERVED</option>
                    <option>CONFIRMED</option>
                    <option>CANCELLED</option>
                    <option>DONE</option>
                  </select>

                  <input
                    defaultValue={a.meeting_link_final}
                    onBlur={(e) => updateMeeting(a.id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  />

                  <div className="flex gap-3 text-sm flex-wrap">
                    <a
                      href={a.payment_whatsapp_link}
                      target="_blank"
                      className="text-yellow-600"
                    >
                      💰 Payment
                    </a>
                    <a
                      href={a.confirmation_whatsapp_link}
                      target="_blank"
                      className="text-green-600"
                    >
                      ✅ Confirm
                    </a>
                    <button
                      onClick={() => sendReminder(a.id)}
                      className="text-blue-600"
                    >
                      🔔 Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth}>←</button>
            <h2>{monthYear}</h2>
            <button onClick={nextMonth}>→</button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3 text-center font-semibold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {generateCalendar().map((day, i) => {
              const dateStr = day
                ? new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day,
                  )
                    .toISOString()
                    .split("T")[0]
                : null;
              const count = appointments.filter(
                (a) => a.appointment_date === dateStr,
              ).length;

              return (
                <div
                  key={i}
                  onClick={() => dateStr && setSelectedDate(dateStr)}
                  className="border p-2 min-h-[90px] cursor-pointer"
                >
                  {day && (
                    <>
                      <div className="font-semibold">{day}</div>
                      {count > 0 && (
                        <div className="text-xs text-teal-600">
                          {count} Appointments
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4">
                Appointments on {selectedDate}
              </h3>
              {filteredAppointments.map((a) => (
                <div key={a.id} className="border p-4 mb-4 rounded">
                  <p>{a.patient_name}</p>
                  <p className="text-sm">{a.slot_time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SLOTS SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Slots</h2>

        <form onSubmit={addSlot} className="flex gap-4 mb-6">
          <input
            type="date"
            name="slot_date"
            required
            className="border px-2 py-1"
          />
          <input
            type="time"
            name="start_time"
            required
            className="border px-2 py-1"
          />
          <input
            type="time"
            name="end_time"
            required
            className="border px-2 py-1"
          />
          <button className="bg-teal-700 text-white px-4 rounded">
            Add Slot
          </button>
        </form>

        <div className="grid md:grid-cols-4 gap-4">
          {slots.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded shadow">
              <p>{s.slot_date}</p>
              <p>
                {s.start_time}-{s.end_time}
              </p>
              <p className={s.is_booked ? "text-red-600" : "text-green-600"}>
                {s.is_booked ? "BOOKED" : "FREE"}
              </p>
              {!s.is_booked && (
                <button
                  onClick={() => deleteSlot(s.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
