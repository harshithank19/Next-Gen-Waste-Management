// server/server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
console.log(" USING SUPABASE_URL =", process.env.SUPABASE_URL);


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-api-key"],
  })
);

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://bxwytdyeynpiymwezcdk.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const CREATE_DRIVER_API_KEY =
  process.env.CREATE_DRIVER_API_KEY || "my_local_admin_key_123";

if (!SERVICE_ROLE_KEY) {
  console.error(
    "❌ ERROR: SERVICE_ROLE_KEY (Supabase service_role key) is not set in .env"
  );
  process.exit(1);
}

// ✅ API: Create a new driver
app.post("/create-driver", async (req, res) => {
  console.log("📩 POST /create-driver received");

  const headerKeyRaw = req.headers["x-admin-api-key"];
  const headerKey =
    typeof headerKeyRaw === "string" ? headerKeyRaw.trim() : headerKeyRaw;
  const envKey =
    typeof CREATE_DRIVER_API_KEY === "string"
      ? CREATE_DRIVER_API_KEY.trim()
      : CREATE_DRIVER_API_KEY;

  if (!headerKey || headerKey !== envKey) {
    return res.status(401).json({
      error: "Unauthorized — invalid or missing x-admin-api-key",
      debug: { headerKeyPresent: !!headerKey, envKeyPresent: !!envKey },
    });
  }

  try {
    const { email, password, full_name } = req.body || {};
    if (!email || !password)
      return res
        .status(400)
        .json({ error: "email and password are required" });

    // ✅ Step 1: Create auth user (admin endpoint) — skip email rate limit
    const createUserResp = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
        // ⚡ email_confirm: false prevents rate-limit issues and avoids sending emails
        body: JSON.stringify({
          email,
          password,
          email_confirm: false,
          user_metadata: { full_name },
        }),
      }
    );

    const createdUser = await createUserResp.json();
    if (!createUserResp.ok) {
      console.error("❌ create auth user failed:", createdUser);
      return res.status(createUserResp.status).json({ error: createdUser });
    }

    const authUserId = createdUser.id;
    if (!authUserId) {
      return res.status(500).json({ error: "Auth user created but no id returned" });
    }

    // ✅ Step 2: Insert profile row with correct RLS-safe format
    const profileResp = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      // ⚡ Wrap object in array — Supabase REST API expects this format
      body: JSON.stringify([
        {
          id: authUserId,
          email,
          full_name: full_name || null,
          is_driver: true,
          is_admin: false,
          created_at: new Date().toISOString(),
        },
      ]),
    });

    const profileJson = await profileResp.json();

    if (!profileResp.ok) {
      // rollback auth user if profile insertion fails
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${authUserId}`, {
        method: "DELETE",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      }).catch(() => {});
      console.error("❌ profile insert failed:", profileJson);
      return res.status(profileResp.status).json({ error: profileJson });
    }

    // ✅ Step 3: Return success
    console.log("✅ Driver created successfully:", {
      user: createdUser,
      profile: profileJson,
    });

    return res.status(200).json({
      user: createdUser,
      profile: Array.isArray(profileJson) ? profileJson[0] : profileJson,
    });
  } catch (err) {
    console.error("💥 create-driver unexpected error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("🚀 create-driver API is running successfully!");
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () =>
  console.log(`✅ create-driver server listening at http://localhost:${PORT}`)
);
