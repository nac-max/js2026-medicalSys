"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const wordsArray = words.split(" ");

  return (
    <div ref={ref} className={cn("", className)}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)" },
              visible: { opacity: 1, filter: "blur(0px)" },
            }}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
