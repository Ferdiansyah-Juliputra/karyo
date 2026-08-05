"use client";

import { useState } from "react";
import { Briefcase, Loader2, Sparkles } from "lucide-react";

export default function RequirementInput() {
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!requirements.trim()) return;

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirements,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume.");
      }

      const result = await response.json();
      console.log(result);

      // nanti simpan ke state atau kirim ke parent component
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3">
          <Briefcase className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <h3 className="font-semibold text-slate-800">
            Job Requirements
          </h3>

          <p className="text-sm text-slate-500">
            Paste the complete job description from LinkedIn,
            JobStreet, Kalibrr, or any job portal.
          </p>
        </div>
      </div>

      <textarea
        rows={12}
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        placeholder={`Example:

• 2+ years of experience with React or Next.js
• Experience with Python / Flask
• Strong SQL and database design skills
• Familiar with REST APIs
• Excellent communication and teamwork
• Bachelor's degree in Computer Science`}
        className="w-full resize-none rounded-2xl border border-slate-300 p-4 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !requirements.trim()}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Analyze Resume
          </>
        )}
      </button>

    </div>
  );
}