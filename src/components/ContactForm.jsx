import { useState } from "react";

const FIELD_CLASS =
  "mt-2 block w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900";
const LABEL_CLASS = "block text-sm font-semibold text-neutral-900";

export default function ContactForm({ basinFormId }) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      // Basin (usebasin.com) headless form endpoint. Accept: application/json
      // makes Basin return a JSON result instead of a redirect for AJAX posts.
      const response = await fetch(`https://usebasin.com/f/${basinFormId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setStatus("success");
        setValues({ firstName: "", lastName: "", phone: "", email: "", message: "" });
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
      <div className="rounded-md border border-neutral-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-neutral-900">Message sent</p>
        <p className="mt-2 text-neutral-600">
          Thank you for reaching out. We'll get back to you soon.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-neutral-900 underline underline-offset-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={LABEL_CLASS}>
            First name
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={values.firstName}
            onChange={set("firstName")}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL_CLASS}>
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={values.lastName}
            onChange={set("lastName")}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={values.phone}
            onChange={set("phone")}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={set("email")}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={LABEL_CLASS}>
          Your question/message
        </label>
        <textarea
          id="message"
          rows="5"
          value={values.message}
          onChange={set("message")}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        Form secured by 256-bit SSL encryption
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary px-8 py-4 text-base disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send"}
        {status !== "submitting" && (
          <svg
            className="order-last ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        )}
      </button>
    </form>
  );
}
