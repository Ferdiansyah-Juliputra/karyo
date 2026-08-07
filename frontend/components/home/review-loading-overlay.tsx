"use client";

import { Check, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  "Reading your resume",
  "Matching job requirements",
  "Calculating ATS score",
  "Finding missing skills",
  "Preparing recommendations",
];

export default function ReviewLoadingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= steps.length - 1) return;

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [index]);

  const progress = ((index + 1) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white/80 to-teal-500/10 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [-4, 4, -4],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg"
          >
            <Sparkles className="h-7 w-7" />
          </motion.div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              AI Resume Analysis
            </h2>

            <p className="text-sm text-slate-500">
              Comparing your resume against the job requirements
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Processing</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.45,
              }}
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {steps.map((step, i) => {
            const completed = i < index;
            const active = i === index;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                className="flex items-center gap-3"
              >
                {completed ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                ) : active ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                    }}
                    className="h-6 w-6 rounded-full border-4 border-emerald-500"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-slate-300" />
                )}

                <span
                  className={`text-sm transition ${
                    completed || active
                      ? "font-medium text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-8 text-center text-sm text-slate-500"
          >
            {steps[index]}...
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}