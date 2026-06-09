// api/create-driver.js  (Vercel / Netlify serverless)
import fetch from "node-fetch";

const SUPABASE_URL = "https://bxwytdyeynpiymwezcdk.supabase.co";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY; // set in host env
const ADMIN_API_KEY = process.env.CREATE_DRIVER_API_KEY;     // set a short secret for frontend -> server auth

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // simple protection: require an admin key in header
  const clientKey = req.headers["x-admin-api-key"];
  if (!clientKey || clientKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { email, password, full_name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  if (!SERVICE_ROLE) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    // 1) create auth user (admin endpoint)
    const createUserResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name } }),
    });
    const createdUser = await createUserResp.json();
    if (!createUserResp.ok) return res.status(createUserResp.status).json({ error: createdUser });

    // 2) insert profile row with same id via REST
    const profileResp = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: createdUser.id,
        email,
        full_name: full_name || null,
        is_driver: true,
        created_at: new Date().toISOString(),
      }),
    });

    const profileJson = await profileResp.json();
    if (!profileResp.ok) {
      // rollback created auth user if profile insertion fails
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${createdUser.id}`, {
        method: "DELETE",
        headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
      }).catch(() => {});
      return res.status(profileResp.status).json({ error: profileJson });
    }

    // success
    return res.status(200).json({
      user: createdUser,
      profile: Array.isArray(profileJson) ? profileJson[0] : profileJson,
    });
  } catch (err) {
    console.error("create-driver error", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
