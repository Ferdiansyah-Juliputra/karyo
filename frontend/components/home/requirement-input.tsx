"use client";

import { Briefcase, Loader2, Sparkles } from "lucide-react";

interface RequirementInputProps {
  requirement: string;
  onRequirementChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  hasResume: boolean;
}

export default function RequirementInput({
  requirement,
  onRequirementChange,
  onAnalyze,
  loading,
  hasResume,
}: RequirementInputProps) {
  const canAnalyze = hasResume && requirement.trim().length > 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3">
          <Briefcase className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Job Requirements
          </h2>

          <p className="text-sm text-slate-500">
            Paste the full job description from LinkedIn, JobStreet,
            Kalibrr, or any other job portal.
          </p>
        </div>
      </div>

      <textarea
        rows={14}
        value={requirement}
        onChange={(e) => onRequirementChange(e.target.value)}
        placeholder={`Example

Responsibilities
• Build scalable React / Next.js applications
• Collaborate with backend engineers
• Develop REST APIs

Requirements
• 2+ years of React or Next.js experience
• Experience with Python / Flask
• Strong SQL skills
• Good communication skills
• Bachelor's degree in Computer Science`}
        className="w-full resize-none rounded-2xl border border-slate-300 p-4 text-sm leading-7 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>Paste the complete job description.</span>
        <span>{requirement.length} characters</span>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading || !canAnalyze}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:active:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            {hasResume ? "Analyze Resume" : "Upload Resume First"}
          </>
        )}
      </button>

      {!hasResume && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Upload your resume first, then click <strong>Analyze Resume</strong>.
        </div>
      )}
    </div>
  );
}