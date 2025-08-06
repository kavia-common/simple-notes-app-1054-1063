"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import NoteEditor from "@/components/NoteEditor";
import { Note } from "@/utils/types";
import {
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "@/services/notesService";
import { useRouter } from "next/navigation";

export default function NotesAppPage() {
  const { user, isLoading } = useAuth();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [mainLoading, setMainLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const router = useRouter();

  // Auth loading state / redirect
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
    // eslint-disable-next-line
  }, [user, isLoading]);

  const handleSelectNote = async (note: Note) => {
    if (!user) return;
    setMainLoading(true);
    const n = await getNote(user.token, note.id);
    setSelectedNote(n);
    setIsNew(false);
    setMainLoading(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsNew(true);
  };

  const handleSave = async (title: string, content: string) => {
    if (!user) return;
    setMainLoading(true);
    if (isNew) {
      const newNote = await createNote(user.token, title, content);
      setSelectedNote(newNote);
      setIsNew(false);
    } else if (selectedNote) {
      const updated = await updateNote(user.token, selectedNote.id, title, content);
      setSelectedNote(updated);
    }
    setMainLoading(false);
  };

  const handleDelete = async () => {
    if (!user || !selectedNote) return;
    setMainLoading(true);
    await deleteNote(user.token, selectedNote.id);
    setSelectedNote(null);
    setIsNew(true);
    setMainLoading(false);
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  return (
    <section className="note-layout">
      <Sidebar
        onSelectNote={handleSelectNote}
        selectedNoteId={selectedNote?.id || null}
        onNewNote={handleNewNote}
      />
      <main className="main-content">
        {isNew ? (
          <NoteEditor
            isNew
            onSave={handleSave}
            loading={mainLoading}
          />
        ) : selectedNote ? (
          <>
            <div className="note-meta">
              Last updated:{" "}
              {new Date(selectedNote.updated_at).toLocaleString()}
            </div>
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onSave={handleSave}
              onDelete={handleDelete}
              loading={mainLoading}
            />
          </>
        ) : (
          <div style={{ color: "#64748b", marginTop: "2rem" }}>
            <h2>Select or create a note.</h2>
          </div>
        )}
      </main>
    </section>
  );
}
