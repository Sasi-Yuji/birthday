import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../lib/utils"

const AnimatedText = React.forwardRef(
  ({
    text,
    duration = 0.5,
    delay = 0.1,
    replay = true,
    className,
    textClassName,
    underlineClassName,
    as: Component = "h1",
    underlineGradient = "from-blue-500 via-purple-500 to-pink-500",
    underlineHeight = "h-1",
    underlineOffset = "bottom-0",
    onFirstLetterRef,
    onLastLetterRef,
    ...props
  }, ref) => {
    const letters = Array.from(text)
    const capturedFirst = React.useRef(null);
    const capturedLast = React.useRef(null);

    const firstLetterRef = React.useCallback((node) => {
      if (node && node !== capturedFirst.current) {
        capturedFirst.current = node;
        if (onFirstLetterRef) onFirstLetterRef(node);
      }
    }, [onFirstLetterRef]);

    const lastLetterRef = React.useCallback((node) => {
      if (node && node !== capturedLast.current) {
        capturedLast.current = node;
        if (onLastLetterRef) onLastLetterRef(node);
      }
    }, [onLastLetterRef]);

    const container = {
      hidden: { 
        opacity: 0 
      },
      visible: {
        opacity: 1,
        transition: { 
          staggerChildren: 0.65, /* Very slow, majestic letter stagger reveal */
          delayChildren: delay 
        }
      }
    }

    const child = {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "tween",
          ease: "easeOut",
          duration: 1.5 /* Slow motion float up taking 1.5 seconds per letter */
        }
      },
      hidden: {
        opacity: 0,
        y: 30,
        transition: {
          type: "tween",
          ease: "easeIn",
          duration: 1.2
        }
      }
    }

    const lineVariants = {
      hidden: {
        width: "0%",
        left: "50%"
      },
      visible: {
        width: "100%",
        left: "0%",
        transition: {
          delay: letters.length * 0.72, /* Smoothly wait for the extremely slow reveal to complete */
          duration: 2.2,                /* Extremely slow, luxurious drawing motion */
          ease: "easeOut"
        }
      }
    }

    return (
      <div 
        ref={ref} 
        className={cn("flex flex-col items-center justify-center gap-2", className)}
        {...props}
      >
        <div className="relative inline-block w-fit overflow-visible">
          <motion.div
            as={Component}
            style={{ display: "flex", whiteSpace: "nowrap" }}
            variants={container}
            initial="hidden"
            animate={replay ? "visible" : "hidden"}
            className={cn(textClassName)}
          >
            {letters.map((letter, index) => {
              const isFirst = index === 0;
              const isLast = index === letters.length - 1;
              return (
                <motion.span 
                  key={index} 
                  ref={isFirst ? firstLetterRef : (isLast ? lastLetterRef : null)}
                  variants={child} 
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              );
            })}
          </motion.div>

          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "absolute left-0 right-0",
              underlineHeight,
              underlineOffset,
              "bg-gradient-to-r",
              underlineGradient,
              underlineClassName
            )}
          />
        </div>
      </div>
    )
  }
)
AnimatedText.displayName = "AnimatedText"

export { AnimatedText }
