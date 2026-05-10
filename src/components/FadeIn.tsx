import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none" | "scale";
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function staggerDelay(index: number, base = 80): number {
  return index * base;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 700,
  threshold = 0.08,
  once = true,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, once]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setHasAnimated(true), delay + duration);
    return () => clearTimeout(timer);
  }, [isVisible, delay, duration]);

  const getInitialTransform = (): string => {
    if (isVisible) return "translate3d(0,0,0) scale(1)";
    switch (direction) {
      case "up":    return "translate3d(0,40px,0) scale(1)";
      case "down":  return "translate3d(0,-40px,0) scale(1)";
      case "left":  return "translate3d(-40px,0,0) scale(1)";
      case "right": return "translate3d(40px,0,0) scale(1)";
      case "scale": return "translate3d(0,0,0) scale(0.92)";
      case "none":  return "translate3d(0,0,0) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1), transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
        transitionDelay: `${delay}ms`,
        willChange: hasAnimated ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
