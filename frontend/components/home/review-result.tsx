"use client";

import {
  Award,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ReviewLoadingOverlay from "./review-loading-overlay";
import type { ReviewResultData } from "@/types/review";

interface ReviewResultProps {
  loading: boolean;
  result: ReviewResultData | null;
}

const ease = [0.22, 1, 0.36, 1] as const;

function useAnimatedScore(
  target: number,
  enabled: boolean,
  duration = 1200
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min(
        (time - start) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setValue(Math.round(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [target, enabled, duration]);

  return value;
}

function useStreamReveal(
  text: string,
  enabled: boolean,
  wordsPerTick = 2,
  interval = 35
) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!enabled) return;

    const words = text.trim().split(/\s+/);
    let index = 0;

    const timer = window.setInterval(() => {
      if (index >= words.length) {
        window.clearInterval(timer);
        return;
      }

      const nextWords = words.slice(
        0,
        Math.min(
          index + wordsPerTick,
          words.length
        )
      );

      setDisplayed(nextWords.join(" "));
      index += wordsPerTick;
    }, interval);

    return () => window.clearInterval(timer);
  }, [text, enabled, wordsPerTick, interval]);

  return displayed;
}

function RevealItem({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.li
      initial={{
        opacity: 0,
        y: 8,
        filter: "blur(4px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.35,
        delay,
        ease,
      }}
    >
      {children}
    </motion.li>
  );
}

export default function ReviewResult({
  result,
  loading,
}: ReviewResultProps) {
  const [revealStarted, setRevealStarted] =
    useState(false);

  const [visibleSections, setVisibleSections] =
    useState({
      summary: false,
      strengths: false,
      missingSkills: false,
      recommendations: false,
    });

  const strengthsRef = useRef<HTMLDivElement>(null);
  const missingSkillsRef =
    useRef<HTMLDivElement>(null);
  const recommendationsRef =
    useRef<HTMLDivElement>(null);

  /*
   * RESET REVEAL STATE
   *
   * Runs whenever a new review starts or
   * the result disappears.
   */
  
  /*
   * AUTO SCROLL
   *
   * Scroll only when the newly revealed
   * section is below the viewport.
   */
  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!ref.current) return;

    const rect =
      ref.current.getBoundingClientRect();

    const bottomPadding = 80;

    if (
      rect.bottom >
      window.innerHeight - bottomPadding
    ) {
      window.scrollTo({
        top:
          window.scrollY +
          rect.top -
          window.innerHeight * 0.18,
        behavior: "smooth",
      });
    }
  };

  /*
   * WATCH SECTION REVEALS
   */
  useEffect(() => {
    if (!revealStarted) return;

    if (visibleSections.strengths) {
      scrollToSection(strengthsRef);
      return;
    }

    if (visibleSections.missingSkills) {
      scrollToSection(missingSkillsRef);
      return;
    }

    if (visibleSections.recommendations) {
      scrollToSection(recommendationsRef);
    }
  }, [
    visibleSections.strengths,
    visibleSections.missingSkills,
    visibleSections.recommendations,
    revealStarted,
  ]);

  /*
   * PROGRESSIVE REVEAL SEQUENCE
   */
  useEffect(() => {
    if (!result || loading) return;

    const timers = [
      window.setTimeout(() => {
        setRevealStarted(true);
      }, 250),

      window.setTimeout(() => {
        setVisibleSections((prev) => ({
          ...prev,
          summary: true,
        }));
      }, 1500),

      window.setTimeout(() => {
        setVisibleSections((prev) => ({
          ...prev,
          strengths: true,
        }));
      }, 3000),

      window.setTimeout(() => {
        setVisibleSections((prev) => ({
          ...prev,
          missingSkills: true,
        }));
      }, 3600),

      window.setTimeout(() => {
        setVisibleSections((prev) => ({
          ...prev,
          recommendations: true,
        }));
      }, 4200),
    ];

    return () => {
      timers.forEach((timer) =>
        window.clearTimeout(timer)
      );
    };
  }, [result, loading]);

  /*
   * SCORE INFORMATION
   */
  const scoreInfo = useMemo(() => {
    if (!result) return null;

    if (result.ats_score >= 85) {
      return {
        label: "Excellent match",
        text:
          "Your resume aligns strongly with this role.",
        color: "#10b981",
        soft: "bg-emerald-50",
        textColor: "text-emerald-700",
      };
    }

    if (result.ats_score >= 70) {
      return {
        label: "Good match",
        text:
          "Your resume is a solid match with some room to improve.",
        color: "#eab308",
        soft: "bg-yellow-50",
        textColor: "text-yellow-700",
      };
    }

    if (result.ats_score >= 50) {
      return {
        label: "Moderate match",
        text:
          "There are several areas that could be strengthened.",
        color: "#f97316",
        soft: "bg-orange-50",
        textColor: "text-orange-700",
      };
    }

    return {
      label: "Needs improvement",
      text:
        "Your resume could be better aligned with this role.",
      color: "#ef4444",
      soft: "bg-red-50",
      textColor: "text-red-700",
    };
  }, [result]);

  const animatedScore = useAnimatedScore(
    result?.ats_score ?? 0,
    revealStarted
  );

  const summaryText = useStreamReveal(
    result?.summary ?? "",
    visibleSections.summary
  );

  /*
   * LOADING ONLY
   */
  if (loading && !result) {
    return (
      <div className="relative min-h-125 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <ReviewLoadingOverlay />
      </div>
    );
  }

  if (!result || !scoreInfo) {
    return null;
  }

  const radius = 74;
  const circumference = 2 * Math.PI * radius;

  const progress =
    (animatedScore / 100) * circumference;

  return (
    <div className="relative">
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease,
        }}
        className="relative space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: revealStarted ? 1 : 0.45,
            y: revealStarted ? 0 : 8,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Award className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Resume Analysis
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                AI-generated review based on your resume
                and job description.
              </p>
            </div>
          </div>
        </motion.div>

        {/* SCORE */}
        <AnimatePresence>
          {revealStarted && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.55,
                ease,
              }}
              className={`relative overflow-hidden rounded-3xl ${scoreInfo.soft} p-6`}
            >
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-start">
                {/* SCORE RING */}
                <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
                  <svg
                    className="absolute inset-0 h-full w-full -rotate-90"
                    viewBox="0 0 180 180"
                  >
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-white/70"
                    />

                    <motion.circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke={scoreInfo.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{
                        strokeDashoffset:
                          circumference,
                      }}
                      animate={{
                        strokeDashoffset:
                          circumference - progress,
                      }}
                      transition={{
                        duration: 0.1,
                        ease: "linear",
                      }}
                    />
                  </svg>

                  <div className="relative text-center">
                    <motion.div
                      key={animatedScore}
                      initial={{
                        opacity: 0.5,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.12,
                      }}
                      className="text-5xl font-bold tracking-tight text-slate-800"
                    >
                      {animatedScore}
                    </motion.div>

                    <div className="text-sm font-medium text-slate-400">
                      / 100
                    </div>
                  </div>
                </div>

                {/* SCORE DESCRIPTION */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center gap-3 sm:justify-start">
                    <p className="text-sm font-semibold text-slate-500">
                      ATS Score
                    </p>

                    {animatedScore >= result.ats_score && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.95,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.4,
                        }}
                      >
                        <div
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${scoreInfo.textColor} bg-white/70`}
                        >
                          {scoreInfo.label}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                    {scoreInfo.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUMMARY */}
        <AnimatePresence>
          {visibleSections.summary && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease,
              }}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />

                <h3 className="font-semibold text-slate-800">
                  Summary
                </h3>
              </div>

              <p className="min-h-18 whitespace-pre-wrap leading-7 text-slate-600">
                {summaryText}

                {summaryText.length <
                  result.summary.length && (
                  <motion.span
                    animate={{
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                    className="ml-1 inline-block h-4 w-0.5 bg-emerald-500 align-middle"
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INSIGHTS */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* STRENGTHS */}
          <AnimatePresence>
            {visibleSections.strengths && (
              <motion.div
                ref={strengthsRef}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  ease,
                }}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" />

                  <h3 className="font-semibold text-emerald-700">
                    Strengths
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-slate-700">
                  {result.strengths.map(
                    (item, index) => (
                      <RevealItem
                        key={index}
                        delay={index * 0.12}
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                          <span>{item}</span>
                        </div>
                      </RevealItem>
                    )
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MISSING SKILLS */}
          <AnimatePresence>
            {visibleSections.missingSkills && (
              <motion.div
                ref={missingSkillsRef}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  ease,
                }}
                className="rounded-2xl border border-orange-200 bg-orange-50 p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <CircleAlert className="text-orange-600" />

                  <h3 className="font-semibold text-orange-700">
                    Missing Skills
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-slate-700">
                  {result.missing_skills.map(
                    (item, index) => (
                      <RevealItem
                        key={index}
                        delay={index * 0.12}
                      >
                        <div className="flex items-start gap-2">
                          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />

                          <span>{item}</span>
                        </div>
                      </RevealItem>
                    )
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RECOMMENDATIONS */}
          <AnimatePresence>
            {visibleSections.recommendations && (
              <motion.div
                ref={recommendationsRef}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  ease,
                }}
                className="rounded-2xl border border-blue-200 bg-blue-50 p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="text-blue-600" />

                  <h3 className="font-semibold text-blue-700">
                    Recommendations
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-slate-700">
                  {result.recommendations.map(
                    (item, index) => (
                      <RevealItem
                        key={index}
                        delay={index * 0.12}
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                          <span>{item}</span>
                        </div>
                      </RevealItem>
                    )
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ANALYZING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="absolute inset-0 z-20 overflow-hidden rounded-3xl"
          >
            <ReviewLoadingOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}