import { Note } from "@/utils/types";

/**
 * Helper to check API URL config for all note requests.
 */
function getApiUrl(): string {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined. Please set it in your .env file.");
    throw new Error("NEXT_PUBLIC_API_URL is missing.");
  }
  return process.env.NEXT_PUBLIC_API_URL;
}

// PUBLIC_INTERFACE
export async function getNotes(token: string, search?: string): Promise<Note[]> {
  let url = getApiUrl() + "/notes";
  if (search) url += "?search=" + encodeURIComponent(search);
  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) return [];
  return await res.json();
}

// PUBLIC_INTERFACE
export async function getNote(token: string, id: string): Promise<Note | null> {
  const res = await fetch(getApiUrl() + `/notes/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) return null;
  return await res.json();
}

// PUBLIC_INTERFACE
export async function createNote(token: string, title: string, content: string): Promise<Note | null> {
  const res = await fetch(getApiUrl() + "/notes", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) return null;
  return await res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(token: string, id: string, title: string, content: string): Promise<Note | null> {
  const res = await fetch(getApiUrl() + `/notes/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) return null;
  return await res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(token: string, id: string): Promise<boolean> {
  const res = await fetch(getApiUrl() + `/notes/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });
  return res.ok;
}
