"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const faqs = [
  {
    question: "Do I need to pay to start learning?",
    answer:
      "No. Every course has at least one free preview lesson you can take before enrolling, so you know exactly what you're paying for.",
  },
  {
    question: "How do quizzes and lesson unlocking work?",
    answer:
      "Each lesson can have a short quiz. Passing it unlocks the next lesson in the course — progress is sequential and tracked automatically, retry attempts are unlimited.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Paid courses are purchased through Kaspi Pay. Your course unlocks automatically the moment the payment is confirmed.",
  },
  {
    question: "Is my progress saved automatically?",
    answer:
      "Yes — every completed lesson and quiz score is saved to your account as you go, so you can pick up exactly where you left off on any device.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24 sm:py-28">
      <ScrollReveal className="text-center">
        <span className="text-xs font-medium tracking-wide text-brand uppercase">FAQ</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Questions, answered
        </h2>
      </ScrollReveal>

      <div className="mt-10 flex flex-col divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ${open ? "rotate-180 text-brand" : ""}`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
