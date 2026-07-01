import { put } from "@vercel/blob";

/**
 * Records Studio Harmon form submissions to a private Vercel Blob store.
 * Handles both the /start project intake and the /book call request,
 * keyed by the `form` field. One JSON object per submission.
 *
 * Requires BLOB_READ_WRITE_TOKEN (injected by the connected Blob store).
 * Retrieve submissions with: `vercel blob list submissions/`
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // Honeypot: real users never fill this hidden field. Pretend success, store nothing.
  if (body.hp_field) {
    return res.status(200).json({ ok: true });
  }

  const form = body.form === "book" ? "book" : "start";
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();

  if (!name || !email || !email.includes("@")) {
    return res
      .status(400)
      .json({ ok: false, error: "Name and a valid email are required." });
  }

  const receivedAt = new Date().toISOString();
  const record = {
    form,
    receivedAt,
    name,
    email,
    business: String(body.business || "").trim(),
    site: String(body.site || "").trim(),
    needs: Array.isArray(body.needs) ? body.needs : [],
    about: String(body.about || "").trim(),
    day: String(body.day || "").trim(),
    time: String(body.time || "").trim(),
    userAgent: req.headers["user-agent"] || "",
  };

  try {
    const stamp = receivedAt.replace(/[:.]/g, "-");
    const rand = Math.random().toString(36).slice(2, 8);
    await put(
      `submissions/${form}/${stamp}-${rand}.json`,
      JSON.stringify(record, null, 2),
      {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
      },
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("blob put failed", err);
    return res
      .status(500)
      .json({ ok: false, error: "Could not save. Please try again." });
  }
}
