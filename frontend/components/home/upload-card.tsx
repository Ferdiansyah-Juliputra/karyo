"use client";

import { useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";

interface UploadCardProps {
  onFileChange: (file: File | null) => void;
  resumeFilename?: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadCard({
  onFileChange,
  resumeFilename,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("Maximum file size is 10 MB.");
      return;
    }

    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0] ?? null;
        handleFile(droppedFile);
      }}
      className={`group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
        isDragging
          ? "scale-[1.02] border-indigo-500 bg-indigo-50"
          : file || resumeFilename
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          handleFile(selected);

          // supaya upload file yang sama tetap trigger onChange
          e.target.value = "";
        }}
      />

      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full transition ${
          file
            ? "bg-emerald-100"
            : isDragging
            ? "bg-indigo-100"
            : "bg-slate-100 group-hover:bg-indigo-100"
        }`}
      >
        {file || resumeFilename ? (
          <FileText className="h-8 w-8 text-emerald-600" />
        ) : (
          <Upload className="h-8 w-8 text-slate-600" />
        )}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-800">
        {file || resumeFilename ? "Resume Uploaded" : "Upload Your Resume"}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {file
          ? file.name
          : resumeFilename
          ? resumeFilename
          : "Drag & drop your PDF here or click to browse"}
      </p>

      {!file && !resumeFilename ? (
        <p className="mt-2 text-xs text-slate-400">
          PDF only • Maximum 10 MB
        </p>
      ) : (
        <div
          className="mt-6 flex justify-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            Replace
          </button>

          <button
            type="button"
            onClick={removeFile}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}