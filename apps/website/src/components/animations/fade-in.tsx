"use client";

import { createContext, useContext, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const FadeInStaggerContext = createContext(false);

const viewport = {
  once: true,
  margin: "0px 0px -150px",
  amount: 0.1,
};

const createVariants = (shouldReduceMotion: boolean) => ({
  hidden: {
    opacity: 0,
    y: shouldReduceMotion ? 0 : 20,
    scale: shouldReduceMotion ? 1 : 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
});

// Enhanced transition with spring physics
const createTransition = (delay = 0) => ({
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1,
  delay,
  opacity: { duration: 0.4 },
  scale: { duration: 0.3 },
});

const FadeIn = ({
  delay = 0,
  direction = "up",
  distance = 20,
  duration = 0.4,
  ...props
}: any) => {
  const shouldReduceMotion = useReducedMotion();
  const isInStaggerGroup = useContext(FadeInStaggerContext);

  // Memoize variants based on direction and distance
  const variants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    const getTransform = () => {
      switch (direction) {
        case "up":
          return { y: distance };
        case "down":
          return { y: -distance };
        case "left":
          return { x: distance };
        case "right":
          return { x: -distance };
        default:
          return { y: distance };
      }
    };

    return {
      hidden: {
        opacity: 0,
        scale: 0.95,
        ...getTransform(),
      },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      },
    };
  }, [shouldReduceMotion, direction, distance]);

  // Memoize transition
  const transition = useMemo(
    () => (shouldReduceMotion ? { duration: 0.2 } : createTransition(delay)),
    [shouldReduceMotion, delay]
  );

  return (
    <motion.div
      variants={variants}
      transition={transition}
      // Performance optimizations
      style={{
        willChange: "opacity, transform",
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport,
          })}
      {...props}
    />
  );
};

export const FadeInStagger = ({
  faster = false,
  delayChildren = 0,
  staggerDirection = "normal",
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Memoize stagger transition
  const staggerTransition = useMemo(() => {
    const baseDelay = faster ? 0.08 : 0.15;

    return shouldReduceMotion
      ? { duration: 0.2 }
      : {
          staggerChildren: baseDelay,
          delayChildren,
          staggerDirection: staggerDirection === "reverse" ? -1 : 1,
        };
  }, [faster, delayChildren, staggerDirection, shouldReduceMotion]);

  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={staggerTransition}
        // Performance optimizations
        style={{
          willChange: "auto",
          contain: "layout style paint",
        }}
        {...props}
      />
    </FadeInStaggerContext.Provider>
  );
};

// Enhanced slide variants for different directions
export const SlideIn = ({ direction = "left", distance = 50, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    const transforms = {
      left: { x: -distance },
      right: { x: distance },
      up: { y: distance },
      down: { y: -distance },
    };

    return {
      hidden: {
        opacity: 0,
        ...transforms[direction as keyof typeof transforms],
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
      },
    };
  }, [shouldReduceMotion, direction, distance]);

  return (
    <motion.div
      variants={variants}
      transition={shouldReduceMotion ? { duration: 0.2 } : createTransition()}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      style={{
        willChange: "opacity, transform",
        backfaceVisibility: "hidden",
      }}
      {...props}
    />
  );
};

// Scale animation variant
export const ScaleIn = ({ scale = 0.8, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : scale,
      },
      visible: {
        opacity: 1,
        scale: 1,
      },
    }),
    [shouldReduceMotion, scale]
  );

  return (
    <motion.div
      variants={variants}
      transition={shouldReduceMotion ? { duration: 0.2 } : createTransition()}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      style={{
        willChange: "opacity, transform",
        backfaceVisibility: "hidden",
      }}
      {...props}
    />
  );
};

export default FadeIn;
