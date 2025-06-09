// index.ts
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { TeslaFleetProvider } from "./lib/TeslaFleet";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Initialize Tesla Fleet provider
const tesla = new TeslaFleetProvider(
  Bun.env.TESLA_CLIENT_ID!,
  Bun.env.TESLA_CLIENT_SECRET!,
  Bun.env.TESLA_REDIRECT_URI!
);

// In-memory session store (use Redis/database in production)
interface UserSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: Date;
}

const userSessions = new Map<string, UserSession>();

// Helper to generate secure random strings
const generateSecureRandom = () => crypto.randomUUID();

// Home page with authentication status
app.get("/", async (c) => {
  const sessionId = getCookie(c, "session_id");
  const session = sessionId ? userSessions.get(sessionId) : null;
  const isAuthenticated = session && session.expiresAt > new Date();

  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tesla Fleet API Demo</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .auth-section { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .vehicle-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
          .vehicle-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
          .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 5px; }
          .button:hover { background: #0056b3; }
          .danger { background: #dc3545; }
          .danger:hover { background: #c82333; }
        </style>
      </head>
      <body>
        <h1>Tesla Fleet API Demo</h1>

        <div class="auth-section">
          <h2>Authentication Status</h2>
          ${isAuthenticated
            ? `<p>✅ Connected to Tesla</p>
               <a href="/logout" class="button danger">Disconnect</a>`
            : `<p>❌ Not connected to Tesla</p>
               <a href="/auth/tesla" class="button">Connect with Tesla</a>`
          }
        </div>

        ${isAuthenticated
          ? `<div>
               <h2>Quick Actions</h2>
               <a href="/api/me" class="button">My Profile</a>
               <a href="/api/vehicles" class="button">My Vehicles</a>
               <a href="/dashboard" class="button">Dashboard</a>
             </div>`
          : ''
        }

        <div>
          <h2>API Endpoints</h2>
          <ul>
            <li><code>GET /api/me</code> - User profile</li>
            <li><code>GET /api/vehicles</code> - List vehicles</li>
            <li><code>GET /api/vehicles/:id/data</code> - Vehicle data</li>
            <li><code>GET /api/vehicles/:id/charge</code> - Charge state</li>
            <li><code>POST /api/vehicles/:id/wake</code> - Wake vehicle</li>
            <li><code>POST /api/vehicles/:id/charge/start</code> - Start charging</li>
            <li><code>POST /api/vehicles/:id/charge/stop</code> - Stop charging</li>
            <li><code>POST /api/vehicles/:id/charge/limit</code> - Set charge limit</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Initiate OAuth flow
app.get("/auth/tesla", async (c) => {
  const state = generateSecureRandom();
  const codeVerifier = generateSecureRandom();

  // Store OAuth state securely (use session store in production)
  setCookie(c, "oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600 // 10 minutes
  });
  setCookie(c, "code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600 // 10 minutes
  });

  const authUrl = tesla.createAuthUrl(state, ["vehicle_device_data", "vehicle_location"]);
  return c.redirect(authUrl.toString());
});

// Handle OAuth callback
app.get("/auth/tesla/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  // Check for OAuth errors
  if (error) {
    return c.html(`
      <h1>Authentication Error</h1>
      <p>Error: ${error}</p>
      <p>Description: ${c.req.query("error_description") || "Unknown error"}</p>
      <a href="/">Go back</a>
    `, 400);
  }

  const storedState = getCookie(c, "oauth_state");
  const codeVerifier = getCookie(c, "code_verifier");

  if (!code || !state || state !== storedState || !codeVerifier) {
    return c.html(`
      <h1>Invalid Request</h1>
      <p>The authentication request was invalid or expired.</p>
      <a href="/">Go back</a>
    `, 400);
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await tesla.validateAuthorizationCode("https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token",code, null);

    // Get user info
    const userInfo = await tesla.getMe(tokens.accessToken());

    // Create session
    const sessionId = generateSecureRandom();
    const expiresAt = new Date(Date.now() + (tokens.expiresIn || 3600) * 1000);

    userSessions.set(sessionId, {
      accessToken: tokens.accessToken(),
      refreshToken: tokens.refreshToken() || "",
      userId: userInfo.email || userInfo.id,
      expiresAt,
    });

    // Set session cookie
    setCookie(c, "session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Clear OAuth cookies
    setCookie(c, "oauth_state", "", { maxAge: 0 });
    setCookie(c, "code_verifier", "", { maxAge: 0 });

    return c.redirect("/dashboard");
  } catch (error) {
    console.error("OAuth error:", error);
    return c.html(`
      <h1>Authentication Failed</h1>
      <p>Failed to authenticate with Tesla. Please try again.</p>
      <a href="/">Go back</a>
    `, 500);
  }
});

// Auth middleware
const requireAuth = async (c: any, next: any) => {
  const sessionId = getCookie(c, "session_id");
  const session = sessionId ? userSessions.get(sessionId) : null;

  if (!session || session.expiresAt <= new Date()) {
    if (sessionId) {
      userSessions.delete(sessionId);
    }
    return c.json({ error: "Authentication required" }, 401);
  }

  c.set("session", session);
  await next();
};

// Dashboard
app.get("/dashboard", requireAuth, async (c) => {
  const session = c.get("session");

  try {
    const vehicles = await tesla.getVehicles(session.accessToken);

    return c.html(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tesla Dashboard</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            .vehicle-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
            .vehicle-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .button { display: inline-block; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 5px; font-size: 14px; }
            .button:hover { background: #0056b3; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .online { background: #28a745; color: white; }
            .offline { background: #6c757d; color: white; }
            .asleep { background: #ffc107; color: black; }
          </style>
        </head>
        <body>
          <h1>Your Tesla Vehicles</h1>
          <div class="vehicle-grid">
            ${vehicles.response?.map((vehicle: any) => `
              <div class="vehicle-card">
                <h3>${vehicle.display_name}</h3>
                <p><strong>Model:</strong> ${vehicle.vehicle_name}</p>
                <p><strong>VIN:</strong> ${vehicle.vin}</p>
                <p><strong>Status:</strong> <span class="status ${vehicle.state}">${vehicle.state}</span></p>
                <div>
                  <a href="/api/vehicles/${vehicle.id}/data" class="button">View Data</a>
                  <a href="/api/vehicles/${vehicle.id}/charge" class="button">Charge State</a>
                  ${vehicle.state === 'asleep' ? `<a href="/api/vehicles/${vehicle.id}/wake" class="button">Wake Up</a>` : ''}
                </div>
              </div>
            `).join('') || '<p>No vehicles found</p>'}
          </div>
          <br>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
  } catch (error) {
    return c.html(`<h1>Error</h1><p>Failed to load vehicles: ${error}</p>`);
  }
});

// API Routes
app.get("/api/me", requireAuth, async (c) => {
  const session = c.get("session");

  try {
    const userInfo = await tesla.getMe(session.accessToken);
    return c.json(userInfo);
  } catch (error) {
    return c.json({ error: "Failed to fetch user info" }, 500);
  }
});

app.get("/api/vehicles", requireAuth, async (c) => {
  const session = c.get("session");

  try {
    const vehicles = await tesla.getVehicles(session.accessToken);
    return c.json(vehicles);
  } catch (error) {
    return c.json({ error: "Failed to fetch vehicles" }, 500);
  }
});

app.get("/api/vehicles/:id/data", requireAuth, async (c) => {
  const session = c.get("session");
  const vehicleId = c.req.param("id");
  const endpoints = c.req.query("endpoints")?.split(",");

  try {
    const data = await tesla.getVehicleData(session.accessToken, vehicleId, endpoints);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch vehicle data" }, 500);
  }
});

app.get("/api/vehicles/:id/charge", requireAuth, async (c) => {
  const session = c.get("session");
  const vehicleId = c.req.param("id");

  try {
    const chargeState = await tesla.getChargeState(session.accessToken, vehicleId);
    return c.json(chargeState);
  } catch (error) {
    return c.json({ error: "Failed to fetch charge state" }, 500);
  }
});

app.post("/api/vehicles/:id/wake", requireAuth, async (c) => {
  const session = c.get("session");
  const vehicleId = c.req.param("id");

  try {
    const result = await tesla.wakeVehicle(session.accessToken, vehicleId);
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to wake vehicle" }, 500);
  }
});

app.post("/api/vehicles/:id/charge/start", requireAuth, async (c) => {
  const session = c.get("session");
  const vehicleId = c.req.param("id");

  try {
    const result = await tesla.startCharging(session.accessToken, vehicleId);
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to start charging" }, 500);
  }
});

app.post("/api/vehicles/:id/charge/stop", requireAuth, async (c) => {
  const session = c.get("session");
  const vehicleId = c.req.param("id");

  try {
    const result = await tesla.stopCharging(session.accessToken, vehicleId);
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to stop charging" }, 500);
  }
});

app.post("/api/vehicles/:id/charge/limit", requireAuth, async (c) => {
  const session = c.get("session");
  const vehicleId = c.req.param("id");
  const body = await c.req.json();

  if (!body.percent || body.percent < 50 || body.percent > 100) {
    return c.json({ error: "Charge limit must be between 50 and 100" }, 400);
  }

  try {
    const result = await tesla.setChargeLimit(session.accessToken, vehicleId, body.percent);
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to set charge limit" }, 500);
  }
});

// Logout
app.get("/logout", (c) => {
  const sessionId = getCookie(c, "session_id");
  if (sessionId) {
    userSessions.delete(sessionId);
  }
  setCookie(c, "session_id", "", { maxAge: 0 });
  return c.redirect("/");
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
