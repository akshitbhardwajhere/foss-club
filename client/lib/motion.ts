import type { Variants } from "framer-motion";

interface StaggeredMotionOptions {
  childStagger?: number;
  childDelay?: number;
  itemOffsetY?: number;
  itemDuration?: number;
}

export interface StaggeredMotionPresets {
  containerVariants: Variants;
  itemVariants: Variants;
}

export function getStaggeredMotionPresets(
  options: StaggeredMotionOptions = {},
): StaggeredMotionPresets {
  const {
    childStagger = 0.1,
    childDelay = 0,
    itemOffsetY = 20,
    itemDuration = 0.5,
  } = options;

  return {
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: childStagger,
          delayChildren: childDelay,
        },
      },
    },
    itemVariants: {
      hidden: { opacity: 0, y: itemOffsetY },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: itemDuration,
        },
      },
    },
  };
}
