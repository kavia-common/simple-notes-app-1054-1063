"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getNotes } from "@/services/notesService";
import { Note } from "@/utils/types";

type SidebarProps = {
  onSelectNote: (note: Note) => void;
  selectedNoteId: string | null;
  onNewNote: () => void;
};

export default function Sidebar({
  onSelectNote,
  selectedNoteId,
  onNewNote,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function refreshNotes(searchQuery?: string) {
    if (!user) return;
    setLoading(true);
    const notesList = await getNotes(user.token, searchQuery);
    setNotes(notesList);
    setLoading(false);
  }

  useEffect(() => {
    refreshNotes();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      refreshNotes(search);
    }, 370);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [search]);

  return (
    <aside className="sidebar">
      <span className="sidebar-header">📝 Simple Notes</span>
      <button className="btn btn-accent" onClick={onNewNote}>
        + New Note
      </button>
      <input
        className="sidebar-search"
        placeholder="Search notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Search notes by title"
      />
      <div className="note-list">
        {loading ? (
          <span style={{ color: "#64748b", padding: "0.6rem" }}>Loading...</span>
        ) : (
          <>
            {notes.length === 0 && (
              <span style={{ color: "#64748b", fontSize: "1rem", padding: "0.6rem" }}>
                No notes found
              </span>
            )}
            {notes.map((note) => (
              <button
                key={note.id}
                className={
                  "note-list-item" +
                  (selectedNoteId === note.id ? " selected" : "")
                }
                onClick={() => onSelectNote(note)}
              >
                {note.title || <em>(Untitled)</em>}
              </button>
            ))}
          </>
        )}
      </div>
      {user ? (
        <div className="sidebar-user">
          <span style={{ fontWeight: 500 }}>{user.name || user.email}</span>
          <button
            className="btn"
            style={{ background: "var(--color-secondary)" }}
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link className="btn" href="/login">
          Login
        </Link>
      )}
    </aside>
  );
}
