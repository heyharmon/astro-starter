import { useState } from "react";

const MATERIALS = [
  "Aluminum",
  "Titanium",
  "Copper",
  "Stainless Steel",
  "Brass",
  "Carbon Steel",
  "Exotic Materials",
  "Other",
];

const fieldClass =
  "mt-2 block w-full border border-white/20 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-white/40 transition-colors focus:border-white focus:outline-none";
const labelClass = "block text-[13px] font-medium uppercase tracking-[0.5px] text-ink";

export default function ContactForm({ formspreeId }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [materials, setMaterials] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleMaterial = (m) =>
    setMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          materials: materials.join(", "),
        }),
      });

      if (response.ok) {
        setStatus("success");
        setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
        setMaterials([]);
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-white/15 bg-white/5 p-10 text-center">
        <p className="text-xl text-white">Request sent</p>
        <p className="mt-3 text-[15px] text-ink">
          Thanks for reaching out. We'll get back to you fast — usually within one business day.
        </p>
        <button
          type="button"
          className="btn-outline btn-outline-sm mt-7"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name <span className="text-white/60">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={form.firstName}
            onChange={update("firstName")}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name <span className="text-white/60">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={form.lastName}
            onChange={update("lastName")}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-white/60">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className={fieldClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Material type</legend>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {MATERIALS.map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2.5 text-[15px] text-ink">
              <input
                type="checkbox"
                checked={materials.includes(m)}
                onChange={() => toggleMaterial(m)}
                className="h-4 w-4 accent-white"
              />
              {m}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className={labelClass}>
          Tell us about your project <span className="text-white/60">*</span>
        </label>
        <textarea
          id="message"
          required
          rows="5"
          value={form.message}
          onChange={update("message")}
          className={`${fieldClass} resize-none`}
        ></textarea>
      </div>

      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-outline disabled:opacity-50">
        {status === "submitting" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
