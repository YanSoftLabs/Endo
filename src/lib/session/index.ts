import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const SESSION_COOKIE = "vibe_session_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  const sessionId = uuidv4();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return sessionId;
}
