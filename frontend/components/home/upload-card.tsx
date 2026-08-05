"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300
        ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
            : file
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full transition
          ${
            file
              ? "bg-emerald-100"
              : isDragging
              ? "bg-indigo-100"
              : "bg-slate-100 group-hover:bg-indigo-100"
          }`}
      >
        {file ? (
          <FileText className="h-8 w-8 text-emerald-600" />
        ) : (
          <Upload className="h-8 w-8 text-slate-600" />
        )}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-800">
        {file ? "Resume Uploaded" : "Upload Your Resume"}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {file
          ? file.name
          : "Drag & drop your PDF here or click to browse"}
      </p>

      {!file && (
        <p className="mt-1 text-xs text-slate-400">
          PDF only • Maximum 10 MB
        </p>
      )}
    </div>
  );
}