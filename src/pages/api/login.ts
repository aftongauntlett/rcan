import type { APIRoute } from "astro";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "rcan-admin-authenticated";
const ONE_DAY_SECONDS = 60 * 60 * 24;

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let username = "";
  let password = "";

  try {
    const body = await request.json();
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

  cookies.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ONE_DAY_SECONDS,
    path: "/",
  });

  return Response.json({ ok: true });
};
