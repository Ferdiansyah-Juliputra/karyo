"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";

import api from "@/lib/api";

import HomeLayout from "@/components/home/home-layout";
import UploadCard from "@/components/home/upload-card";
import RequirementInput from "@/components/home/requirement-input";
import ReviewResult from "@/components/home/review-result";
import type { ReviewResultData } from "@/types/review";

const ACTIVE_REVIEW_KEY = "activeReviewId";
const POLLING_INTERVAL = 1000;

export default function HomePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResultData | null>(null);
  const [requirementExpanded, setRequirementExpanded] = useState(true);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [reviewKey, setReviewKey] = useState(0);
  const [isRestored, setIsRestored] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const fetchReviewStatus = async (reviewId: string) => {
    try {
      const response = await api.get(`/review/${reviewId}`);
      const review = response.data.data;

      if (review.job_requirement) {
        setRequirement(review.job_requirement);
      }

      if (review.resume) {
        setResumeFilename(review.resume.filename);
      }

      if (review.status === "queued" || review.status === "processing") {
        setLoading(true);
        return false;
      }

      if (review.status === "completed") {
        setResult(review.data);
        setLoading(false);
        return true;
      }

      if (review.status === "failed") {
        setLoading(false);
        localStorage.removeItem(ACTIVE_REVIEW_KEY);
        console.error(review.error ?? "Review failed.");
        return true;
      }

      return false;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data ?? error.message
        );
      } else {
        console.error(error);
      }

      return false;
    }
  };

  const startPolling = (reviewId: string) => {
    stopPolling();

    pollingRef.current = setInterval(async () => {
      const finished = await fetchReviewStatus(reviewId);

      if (finished) {
        stopPolling();
      }
    }, POLLING_INTERVAL);
  };

  useEffect(() => {
    const activeReviewId = localStorage.getItem(
      ACTIVE_REVIEW_KEY
    );

    if (!activeReviewId) {
      return;
    }

    const restoreReview = async () => {
      setIsRestored(true);
      setLoading(true);
      setRequirementExpanded(false);

      const finished = await fetchReviewStatus(
        activeReviewId
      );

      if (!finished) {
        startPolling(activeReviewId);
      }
    };

    restoreReview();

    return () => {
      stopPolling();
    };
  }, []);

  const handleAnalyze = async () => {
    setIsRestored(false);
    if (!resumeFile || !requirement.trim()) {
      return;
    }

    stopPolling();

    setReviewKey((prev) => prev + 1);
    setRequirementExpanded(false);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("requirement", requirement);

      const response = await api.post(
        "/review",
        formData
      );

      const reviewId = response.data.review_id;

      if (!reviewId) {
        throw new Error(
          "Review ID was not returned by the server."
        );
      }

      localStorage.setItem(
        ACTIVE_REVIEW_KEY,
        reviewId
      );

      startPolling(reviewId);
    } catch (error: unknown) {
      setLoading(false);
      setRequirementExpanded(true);

      if (axios.isAxiosError(error)) {
        console.error("REVIEW REQUEST FAILED");
        console.error("status:", error.response?.status);
        console.error("data:", error.response?.data);
        console.error("message:", error.message);
        console.error("url:", error.config?.url);
      } else {
        console.error("UNKNOWN ERROR:", error);
      }
    }
  };

  return (
    <HomeLayout>
      <div className="mx-auto w-full max-w-350 space-y-6 px-8 py-8">

        <div>
          <h1 className="text-3xl font-bold">
            Resume Review
          </h1>

          <p className="text-gray-500">
            Upload your resume and paste the job description to begin.
          </p>
        </div>

        <UploadCard 
          onFileChange={setResumeFile}
          resumeFilename={resumeFilename}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <button
            onClick={() =>
              setRequirementExpanded(!requirementExpanded)
            }
            className="flex w-full items-center justify-between px-6 py-5 transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2">
                {requirementExpanded ? (
                  <ChevronDown className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-emerald-600" />
                )}
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-slate-800">
                  Job Requirements
                </h3>

                {!requirementExpanded && (
                  <p className="mt-1 text-sm text-slate-500">
                    {requirement.length} characters
                  </p>
                )}
              </div>
            </div>

            {result && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                Reviewed
              </span>
            )}
          </button>

          <AnimatePresence initial={false}>
            {requirementExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-200 p-6">
                  <RequirementInput
                    requirement={requirement}
                    onRequirementChange={setRequirement}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                    hasResume={!!resumeFile}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <AnimatePresence mode="wait">
          {(loading || result) && (
            <motion.div
              key="review-result"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{
                duration: 0.35,
                delay: 0.1,
              }}
            >
              <ReviewResult
                key={reviewKey}
                loading={loading}
                result={result}
                skipReveal={isRestored}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </HomeLayout>
  );
}