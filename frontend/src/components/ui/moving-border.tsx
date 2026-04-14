"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: any;
  [key: string]: any;
}) => {
  return (
    <Component
      className={cn(
        "relative bg-transparent p-[1px] overflow-hidden",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #0066FF, #00C2FF, #0066FF)",
          backgroundSize: "200% 100%",
        }}
      >
        <motion.div
          className="h-full w-full"
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{
            duration: duration / 1000,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            background: "linear-gradient(90deg, #0066FF, #00C2FF, #0066FF)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      <div
        className={cn(
          "relative bg-white z-10 flex items-center justify-center w-full h-full",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};
