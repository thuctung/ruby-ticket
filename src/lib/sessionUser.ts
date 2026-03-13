"use client";

export type SessionUser = {
  name: string;
  email?: string;
  role?: "admin" | "affiliate" | "agent" | "customer";
  avatarUrl?: string;
};

const STORAGE_KEY = "dnt.sessionUser";

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSessionUser(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (!user) window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("storage"));
}
