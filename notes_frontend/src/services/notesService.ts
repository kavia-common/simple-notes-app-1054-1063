import { Note } from "@/utils/types";

// PUBLIC_INTERFACE
export async function getNotes(token: string, search?: string): Promise<Note[]> {
  let url = process.env.NEXT_PUBLIC_API_URL + "/notes";
  if (search) url += "?search=" + encodeURIComponent(search);
  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) return [];
  return await res.json();
}

// PUBLIC_INTERFACE
export async function getNote(token: string, id: string): Promise<Note | null> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/notes/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) return null;
  return await res.json();
}

// PUBLIC_INTERFACE
export async function createNote(token: string, title: string, content: string): Promise<Note | null> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/notes", {
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
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/notes/${id}`, {
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
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/notes/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });
  return res.ok;
}
