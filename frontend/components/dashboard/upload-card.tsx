"use client";

export default function UploadCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed bg-white p-10 text-center">

      <h3 className="text-xl font-semibold">
        Upload Resume
      </h3>

      <p className="mt-2 text-gray-500">
        PDF only
      </p>

      <input
        type="file"
        accept=".pdf"
        className="mt-6"
      />

    </div>
  );
}