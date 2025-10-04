"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";

// Unsplash images for the domino effect
const images = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
];

interface DominoCardProps {
  image: string;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}

function DominoCard({ image, index, totalCards, scrollYProgress }: DominoCardProps) {
  // Create a more precise scroll range for each card
  const start = index / totalCards;
  const end = (index + 1) / totalCards;

  const cardProgress = useTransform(
    scrollYProgress,
    [start, end],
    [0, 1]
  );

  // Card stays visible at 1 until it starts falling, then fades out
  const opacity = useTransform(cardProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0]);
  
  // Rotate from 0 to 90 degrees (falling backward towards the next card)
  const rotateX = useTransform(cardProgress, [0, 1], [0, 90]);
  
  // Keep scale constant for deck effect
  const scale = useTransform(cardProgress, [0, 1], [1, 1]);
  
  // Cards slide down as they rotate - positive value to slide down
  const y = useTransform(cardProgress, [0, 1], [0, 200]);
  
  // Z-index to ensure proper stacking - higher index = on top
  const zIndex = totalCards - index;
  
  // Initial stacking offset for deck appearance - using negative to stack downward
  const initialOffset = -index * 4; // Negative offset to stack cards below each other

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      style={{
        rotateX,
        opacity,
        scale,
        y,
        zIndex,
        top: `${initialOffset}px`,
        transformStyle: "preserve-3d",
        transformOrigin: "top center",
        filter: `drop-shadow(0 ${20 + index * 5}px ${30 + index * 10}px rgba(0, 0, 0, 0.3))`,
      }}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-200/20">
        <Image
          src={image}
          alt={`Domino card ${index + 1}`}
          fill
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothScrollYProgress = useSpring(scrollYProgress, springConfig);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div
        ref={containerRef}
        className="relative h-[500vh]" // Extended height for scroll effect
      >
        {/* Hero Section */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-white/30" />

          {/* Hero Text */}
          <div className="absolute top-20 left-0 right-0 text-center z-20">
            <h1 className="text-6xl font-bold text-gray-900">
              Domino Effect
            </h1>
          </div>

          {/* 3D Perspective Container */}
          <div className="relative w-full max-w-4xl mx-auto px-4">
            <div className="relative h-[600px] [perspective:1000px]">
              <div className="relative w-full h-full [transform-style:preserve-3d]">
                {images.map((image, index) => (
                  <DominoCard
                    key={index}
                    image={image}
                    index={index}
                    totalCards={images.length}
                    scrollYProgress={smoothScrollYProgress}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-600/70 rounded-full mt-2 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
