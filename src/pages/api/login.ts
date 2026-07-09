import type { APIRoute } from "astro";
import { createAdminSessionToken } from "../../utils/adminSession";

const COOKIE_NAME = "admin_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;

type LoginPayload = {
  username?: unknown;
  password?: unknown;
};

export const prerender = false;

const isLoginPayload = (value: unknown): value is LoginPayload =>
  typeof value === "object" && value !== null;

const normalizeCredential = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export const POST: APIRoute = async ({ request, cookies }) => {
  let username = "";
  let password = "";

  try {
    const body: unknown = await request.json();
    if (!isLoginPayload(body)) {
      return new Response(JSON.stringify({ ok: false }), { status: 401 });
    }

    username = normalizeCredential(body.username);
    password = normalizeCredential(body.password);
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  const adminUser = normalizeCredential(import.meta.env.ADMIN_USER);
  const adminPass = normalizeCredential(import.meta.env.ADMIN_PASS);
  const publicAdminUser = normalizeCredential(import.meta.env.PUBLIC_ADMIN_USER);
  const publicAdminPass = normalizeCredential(import.meta.env.PUBLIC_ADMIN_PASS);

  if (!adminUser || !adminPass) {
    if (publicAdminUser || publicAdminPass) {
      console.warn(
        "Admin login rejected: PUBLIC_ADMIN_USER/PUBLIC_ADMIN_PASS are set, but admin credentials must use ADMIN_USER/ADMIN_PASS.",
      );
    }
    console.warn("Admin login rejected: ADMIN_USER or ADMIN_PASS is not configured.");
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  if (username !== adminUser || password !== adminPass) {
    console.warn("Admin login rejected: submitted credentials did not match configured values.");
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  cookies.set(COOKIE_NAME, createAdminSessionToken(adminPass), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ONE_DAY_SECONDS,
    path: "/",
  });

  return Response.json({ ok: true });
};
