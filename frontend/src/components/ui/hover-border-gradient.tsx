"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
  } & React.HTMLAttributes<HTMLElement>
>) => {
  return (
    <Tag
      className={cn(
        "relative inline-flex overflow-hidden p-[2px]",
        containerClassName
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #0066FF, #00C2FF, #0066FF, #00C2FF)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-full h-full bg-white",
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
};
