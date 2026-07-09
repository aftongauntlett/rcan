import type { APIRoute } from "astro";

const COOKIE_NAME = "admin_session";

export const prerender = false;

export const POST: APIRoute = ({ cookies }) => {
  cookies.delete(COOKIE_NAME, {
    path: "/",
  });

  return Response.json({ ok: true });
};
