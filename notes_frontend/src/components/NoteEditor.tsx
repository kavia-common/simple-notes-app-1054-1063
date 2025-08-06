"use client";
import React, { useState, useEffect } from "react";
import { Note } from "@/utils/types";

type Props = {
  note?: Note | null;
  loading?: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  disableDelete?: boolean;
  isNew?: boolean;
};

export default function NoteEditor({
  note,
  loading,
  onSave,
  onDelete,
  disableDelete,
  isNew,
}: Props) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id, note?.title, note?.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    await onSave(title.trim(), content.trim());
    setSaveLoading(false);
  };

  return (
    <form
      className="flex flex-col w-full"
      style={{ maxWidth: "600px", margin: "0 auto" }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <input
        className="note-title-input"
        required
        minLength={1}
        maxLength={100}
        placeholder="Note title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={!!loading}
      />
      <textarea
        className="note-content-input"
        required
        minLength={1}
        maxLength={5000}
        placeholder="Write your note here..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={!!loading}
        style={{ marginBottom: "1.2rem", minHeight: 160 }}
      />
      <div className="form-btn-row">
        <button
          type="submit"
          className="btn btn-accent"
          disabled={loading || saveLoading}
        >
          {isNew ? "Create" : "Save"}
        </button>
        {!isNew && onDelete && (
          <button
            type="button"
            className="btn"
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              color: "#ef4444",
            }}
            onClick={onDelete}
            disabled={disableDelete}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
