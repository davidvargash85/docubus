"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { ssr: false }
);

export default function MarkdownEditor() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch("/api/docs");
        const data = await res.json();
        if (res.ok) {
          setValue(data.content || "");
        } else {
          setError(data.error || "Failed to load content");
        }
      } catch (err) {
        console.error(">> err", err);
        setError("Error fetching content");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to save");
      }
    } catch {
      setError("Error saving content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || "")}
            height={400}
            preview="edit"
          />

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <h2 className="text-xl font-bold my-6">Live Preview</h2>
          <div data-color-mode="light">
            <MarkdownPreview source={value} />
          </div>
        </>
      )}
    </div>
  );
}
