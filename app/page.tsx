import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-800">
      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919588460141?text=Hello%20Dr.%20Shweta%2C%20I%20would%20like%20to%20know%20more%20about%20your%20homeopathy%20consultation%20services."
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
      >
        💬
      </a>

      {/* HERO */}
      <section className="bg-linear-to-r from-teal-700 to-emerald-500 text-white py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Harmony HomeoCare
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Natural Healing Through Personalized Online Consultation
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/patient"
              className="bg-white text-teal-700 px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
            >
              Book Appointment
            </Link>
            <Link
              href="/status"
              className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-teal-700 transition"
            >
              Check Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* DOCTOR PROFILE */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <Image
              src="/doctor.jpg"
              alt="Doctor"
              width={400}
              height={400}
              className="rounded-3xl shadow-2xl"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Your Doctor</h2>

            <h3 className="text-xl font-semibold mb-2">
              Dr. Shweta Chandrakant Zungare
            </h3>

            <p className="text-slate-600 mb-4">
              BHMS • CCH • CGO • 3+ Years Experience
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
              Specialized in chronic diseases, allergies, skin disorders,
              migraine, and lifestyle conditions.
            </p>

            <p className="text-slate-700">
              Holistic, root-cause treatment using classical homeopathy.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "Select Slot",
                desc: "Choose an available consultation time.",
              },
              {
                title: "Reserve Spot",
                desc: "Your slot is temporarily reserved.",
              },
              {
                title: "Pay via UPI",
                desc: "Complete payment and send proof.",
              },
              {
                title: "Consult Online",
                desc: "Join using meeting link after confirmation.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-slate-50 p-8 rounded-3xl shadow-md hover:shadow-xl transition"
              >
                <div className="text-teal-600 text-3xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">Clinic & Care</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {["/clinic1.jpg", "/clinic2.jpg", "/clinic3.jpg"].map(
              (img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt="Clinic"
                  width={400}
                  height={300}
                  className="rounded-3xl shadow-lg hover:scale-105 transition"
                />
              ),
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">What Patients Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Significant improvement in my ulcers.",
              "Very calm and detailed consultation.",
              "Online consult felt personal and effective.",
            ].map((text, index) => (
              <div
                key={index}
                className="bg-slate-50 p-8 rounded-3xl shadow-md"
              >
                <p className="text-slate-700 italic">“{text}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-teal-700 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Start Your Healing Journey Today
        </h2>

        <Link
          href="/patient"
          className="bg-white text-teal-700 px-10 py-4 rounded-2xl font-semibold shadow hover:shadow-lg transition"
        >
          Book Appointment
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Harmony HomeoCare • Online Homeopathy Consultation
      </footer>
    </main>
  );
}
