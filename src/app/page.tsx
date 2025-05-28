"use client";

import { useEffect, useState } from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useRouter } from "next/navigation";

// import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";

interface ReactMdeViewer {
  markdown: string;
}

function ReactMdeViewer({ markdown }: { markdown: string }) {
  const [selectedTab] = useState<"preview">("preview"); // Force "preview" mode
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <div className="react-mde preview-only">
      <ReactMde
        value={markdown}
        onChange={() => {}} // noop
        selectedTab={selectedTab}
        onTabChange={() => {}} // noop
        generateMarkdownPreview={(md) =>
          Promise.resolve(converter.makeHtml(md))
        }
        childProps={{
          writeButton: { style: { display: "none" } },
          previewButton: { style: { display: "none" } },
          textArea: { style: { display: "none" }, readOnly: true },
        }}
      />
    </div>
  );
}

export default function MarkdownEditor() {
  const [value, setValue] = useState("# Hello\nWrite some markdown!");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const router = useRouter();

  const converter = new Showdown.Converter({ tables: true });

  const handlePreview = () => {
    localStorage.setItem("markdown", value);
    router.push("/preview");
  };

  console.log(">> value", value);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(md) =>
          Promise.resolve(converter.makeHtml(md))
        }
      />
      <button
        onClick={handlePreview}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Preview
      </button>
      <ReactMdeViewer markdown={value} />
    </div>
  );
}
