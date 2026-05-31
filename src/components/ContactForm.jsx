import { useState } from "react";

/**
 * Book-a-tour form (React island, hydrated client:idle).
 * Front-end only in the demo — wire `formspreeId` (from
 * site-meta.json) to a live Formspree form to go live. Styled via
 * the token-driven .form-card / .field classes in global.css, so it
 * re-skins with each theme.
 *
 * @param {{
 *   formspreeId?: string,
 *   title?: string,
 *   submitLabel?: string,
 *   note?: string,
 *   successMessage?: string,
 *   ageOptions?: string[],
 *   startOptions?: string[],
 * }} props
 */
export default function ContactForm({
  formspreeId,
  title = "Book a tour",
  submitLabel = "Request my tour",
  note = "",
  successMessage = "Thank you! We'll be in touch within one business day.",
  ageOptions = [],
  startOptions = [],
}) {
  const [form, setForm] = useState({
    parentName: "",
    phone: "",
    email: "",
    childAge: ageOptions[0] ?? "",
    preferredStart: startOptions[0] ?? "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("success");
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
      <div className="form-card">
        <h2>Tour requested</h2>
        <p className="form-success" role="status" aria-live="polite">{successMessage}</p>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: "1.2rem" }}
          onClick={() => {
            setForm({
              parentName: "",
              phone: "",
              email: "",
              childAge: ageOptions[0] ?? "",
              preferredStart: startOptions[0] ?? "",
              message: "",
            });
            setStatus("idle");
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <div className="field-row">
        <div className="field">
          <label htmlFor="parentName">Parent name</label>
          <input
            id="parentName"
            type="text"
            required
            placeholder="Your name"
            value={form.parentName}
            onChange={update("parentName")}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            placeholder="(555) 000-0000"
            value={form.phone}
            onChange={update("phone")}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@email.com"
          value={form.email}
          onChange={update("email")}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="childAge">Child's age</label>
          <select id="childAge" value={form.childAge} onChange={update("childAge")}>
            {ageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="preferredStart">Preferred start</label>
          <select
            id="preferredStart"
            value={form.preferredStart}
            onChange={update("preferredStart")}
          >
            {startOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Anything you'd like us to know?</label>
        <textarea
          id="message"
          rows="3"
          placeholder="Tell us a little about your family..."
          value={form.message}
          onChange={update("message")}
        />
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className="btn btn-primary form-submit"
        style={status === "submitting" ? { opacity: 0.6 } : undefined}
      >
        {status === "submitting" ? "Sending…" : submitLabel}
        <span className="arr">→</span>
      </button>

      {note && <p className="form-note">{note}</p>}
    </form>
  );
}
