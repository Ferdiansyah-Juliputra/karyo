"use client";

import {
  Award,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
} from "lucide-react";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReviewLoadingOverlay from "./review-loading-overlay";
import type { ReviewResultData } from "@/types/review";

interface ReviewResultProps {
  loading: boolean;
  result: ReviewResultData | null;
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: .35,
    },
  },
};


export default function ReviewResult({
  result,
  loading,
}: ReviewResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [stage, setStage] = useState(0);
    useEffect(() => {
      if (loading || !result) return;

      const timers = [
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 700),
        setTimeout(() => setStage(3), 1200),
        setTimeout(() => setStage(4), 1700),
        setTimeout(() => setStage(5), 2200),
      ];

      return () => timers.forEach(clearTimeout);
    }, [loading, result]);

    useEffect(() => {
      if (stage < 1 || !result) return;

      const duration = 800;
      const start = performance.now();

      let frame: number;

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);

        setDisplayScore(
          Math.round(progress * result.ats_score)
        );

        if (progress < 1) {
          frame = requestAnimationFrame(animate);
        }
      };

      frame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(frame);
    }, [stage, result]);
    
  const getColor = (score: number) => {
    if (score >= 85)
      return {
        color: "bg-emerald-500",
        badge: "Excellent",
        badgeColor: "bg-emerald-100 text-emerald-700",
      };

    if (score >= 70)
      return {
        color: "bg-yellow-500",
        badge: "Good",
        badgeColor: "bg-yellow-100 text-yellow-700",
      };

    if (score >= 50)
      return {
        color: "bg-orange-500",
        badge: "Fair",
        badgeColor: "bg-orange-100 text-orange-700",
      };

    return {
      color: "bg-red-500",
      badge: "Poor",
      badgeColor: "bg-red-100 text-red-700",
    };
  };

  if (loading && !result) {
     return (
      <div className="relative min-h-125 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <ReviewLoadingOverlay />
      </div>
     )
  }

  if (!result) return null;

  const score = getColor(result.ats_score);
  const showOverlay = loading;

  return (
    <div className="relative">
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Resume Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-generated review based on your resume and job description.
            </p>
          </div>
        </div>

          {stage >= 1 && (
          <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-slate-50 p-6"
          >
              <div className="flex items-center justify-between">

              <div>
                  <p className="text-sm text-slate-500">
                  ATS Score
                  </p>

                  <motion.h1
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 14,
                  }}
                  className="mt-1 text-5xl font-bold text-slate-800"
                  >
                  {displayScore}
                  <span className="ml-1 text-2xl text-slate-400">
                      /100
                  </span>
                  </motion.h1>
              </div>

              <div className="flex flex-col items-end gap-3">

              {stage >= 2 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${score.badgeColor}`}
                >
                  {score.badge}
                </motion.span>
              )}

                  <motion.div
                  initial={{
                      scale: 0.75,
                      rotate: -12,
                  }}
                  animate={{
                      scale: 1,
                      rotate: 0,
                  }}
                  transition={{
                      type: "spring",
                      stiffness: 240,
                      damping: 12,
                  }}
                  >
                  <Award className="h-9 w-9 text-emerald-500" />
                  </motion.div>

              </div>

              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                  className={`${score.color} h-full rounded-full`}
                  initial={{
                  width: 0,
                  }}
                  animate={{
                  width: `${result.ats_score}%`,
                  }}
                  transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                  boxShadow: "0 0 10px rgba(16,185,129,.35)",
                  }}
              />
              </div>
          </motion.div>
          )}

          {stage >= 2 && (
          <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-slate-200 p-5"
          >
              <h3 className="mb-3 font-semibold text-slate-800">
              Summary
              </h3>

              <p className="leading-7 text-slate-600">
              {result.summary}
              </p>
          </motion.div>
          )}

      {stage >= 3 && (
      <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid gap-5 lg:grid-cols-3"
      >
          {/* Strengths */}
          <div className="h-full rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" />
              <h3 className="font-semibold text-emerald-700">
              Strengths
              </h3>
          </div>

          <ul className="space-y-2 text-sm text-slate-700">
              {result.strengths.map((item, index) => (
              <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                  delay: index * 0.15,
                  duration: 0.25,
                  }}
              >
              <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{item}</span>
              </div>
              </motion.li>
              ))}
          </ul>
          </div>

          {/* Missing Skills */}
          <div className="h-full rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <div className="mb-4 flex items-center gap-2">
              <CircleAlert className="text-orange-600" />
              <h3 className="font-semibold text-orange-700">
              Missing Skills
              </h3>
          </div>

          {stage >= 4 ? (
              <ul className="space-y-2 text-sm text-slate-700">
              {result.missing_skills.map((item, index) => (
                  <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                      delay: index * 0.15,
                      duration: 0.25,
                  }}
                  >
                  <div className="flex items-start gap-2">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                  <span>{item}</span>
                  </div>
                  </motion.li>
              ))}
              </ul>
          ) : (
              <div className="space-y-3">
              <div className="h-4 w-[82%] animate-pulse rounded bg-orange-200" />
              <div className="h-4 w-[63%] animate-pulse rounded bg-orange-200" />
              <div className="h-4 w-[91%] animate-pulse rounded bg-orange-200" />
              </div>
          )}
          </div>

          {/* Recommendations */}
          <div className="h-full rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="text-blue-600" />
              <h3 className="font-semibold text-blue-700">
              Recommendations
              </h3>
          </div>

          {stage >= 5 ? (
              <ul className="space-y-2 text-sm text-slate-700">
              {result.recommendations.map((item, index) => (
                  <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                      delay: index * 0.15,
                      duration: 0.25,
                  }}
                  >
                  <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                  </div>
                  </motion.li>
              ))}
              </ul>
          ) : (
              <div className="space-y-3">
              <div className="h-4 w-4/5 animate-pulse rounded bg-blue-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-blue-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-blue-200" />
              </div>
          )}
          </div>
      </motion.div>
      )}
      </div>
      <AnimatePresence>
        {showOverlay && (
          <ReviewLoadingOverlay />
        )}
      </AnimatePresence>
    </div>
  );
}