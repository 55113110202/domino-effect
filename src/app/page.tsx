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

  // Show card with overlap - next card visible while current card falling
  const opacity = useTransform(cardProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const rotateX = useTransform(cardProgress, [0, 1], [0, -90]);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y = useTransform(cardProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      style={{
        rotateX,
        opacity,
        scale,
        y,
        transformStyle: "preserve-3d",
        transformOrigin: "bottom center",
      }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div
        ref={containerRef}
        className="relative h-[500vh]" // Extended height for scroll effect
      >
        {/* Hero Section */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

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
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Content Sections */}
        <div className="relative z-10">
          {images.map((_, index) => (
            <div key={index} className="h-screen flex items-center justify-center">
              <div className="text-center text-white">
                <motion.h2
                  className="text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Section {index + 1}
                </motion.h2>
                <motion.p
                  className="text-xl text-white/80 max-w-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  This is section {index + 1} content. Scroll to see the domino effect in action!
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
