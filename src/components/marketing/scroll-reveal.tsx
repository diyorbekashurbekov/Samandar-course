"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Shared "fade + rise into place" used for every landing section so scroll
// reveals feel like one consistent system rather than each section doing
// its own thing. `once: true` means it never re-triggers on scroll-back —
// a subtlety that keeps it feeling premium instead of gimmicky.
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
