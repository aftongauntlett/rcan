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

export const POST: APIRoute = async ({ request, cookies }) => {
  let username = "";
  let password = "";

  try {
    const body: unknown = await request.json();
    if (!isLoginPayload(body)) {
      return new Response(JSON.stringify({ ok: false }), { status: 401 });
    }

    username = typeof body.username === "string" ? body.username : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  const adminUser = String(import.meta.env.ADMIN_USER ?? "");
  const adminPass = String(import.meta.env.ADMIN_PASS ?? "");

  if (!adminUser || !adminPass || username !== adminUser || password !== adminPass) {
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
