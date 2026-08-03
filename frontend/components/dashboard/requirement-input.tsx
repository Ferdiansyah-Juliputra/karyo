"use client";

export default function RequirementInput() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <label className="font-semibold">
        Job Requirements
      </label>

      <textarea
        rows={12}
        placeholder="Paste the job description from LinkedIn, JobStreet, Kalibrr, etc..."
        className="mt-3 w-full rounded-xl border p-4"
      />

      <button
        className="mt-6 h-12 w-full rounded-xl bg-emerald-600 text-white"
      >
        Analyze Resume
      </button>

    </div>
  );
}