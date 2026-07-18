import { useState } from "react";

const inputClasses =
  "mt-2 block w-full rounded-[5px] border border-neutral-300 bg-white px-4 py-3 text-sm text-teal-800 placeholder-neutral-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";
const labelClasses = "block text-sm font-semibold text-teal-800";

export default function EstimateForm({ formspreeId }) {
  const [fields, setFields] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    rooms: "1-2",
    floors: "1",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update(key) {
    return (e) => setFields({ ...fields, [key]: e.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("There was an error trying to send your message. Please try again later.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-teal-800">Thank you for your message. It has been sent.</p>
        <p className="mt-2 text-slate">We will contact you to schedule a date and time.</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="lastName" className={labelClasses}>Last name</label>
        <input id="lastName" type="text" required value={fields.lastName} onChange={update("lastName")} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="firstName" className={labelClasses}>First name</label>
        <input id="firstName" type="text" required value={fields.firstName} onChange={update("firstName")} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>Email address</label>
        <input id="email" type="email" required value={fields.email} onChange={update("email")} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>Phone number</label>
        <input id="phone" type="tel" required value={fields.phone} onChange={update("phone")} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="rooms" className={labelClasses}>Number of rooms in house</label>
        <select id="rooms" value={fields.rooms} onChange={update("rooms")} className={inputClasses}>
          <option value="1-2">1-2</option>
          <option value="3-4">3-4</option>
          <option value="5+">5+</option>
        </select>
      </div>

      <div>
        <label htmlFor="floors" className={labelClasses}>Number of floors in house including basement</label>
        <select id="floors" value={fields.floors} onChange={update("floors")} className={inputClasses}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-primary disabled:opacity-50">
        {status === "submitting" ? "Sending..." : "Request Estimate"}
      </button>
    </form>
  );
}
