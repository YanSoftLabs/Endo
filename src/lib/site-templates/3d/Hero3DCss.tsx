"use client";

import { motion } from "framer-motion";

export function Hero3DCss({ primaryColor, accentColor }: { primaryColor: string; accentColor: string }) {
  return (
    <div className="relative h-[320px] perspective-[1000px]">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-2xl border border-white/20 backdrop-blur-sm"
          style={{ background: `linear-gradient(135deg, ${primaryColor}${i === 0 ? "cc" : "66"}, ${accentColor}${i === 0 ? "99" : "44"})`, transform: `translateZ(${i * 40}px) rotateX(${5 + i * 3}deg) rotateY(${-8 + i * 4}deg)` }}
          animate={{ y: [0, -10, 0], rotateY: [-8 + i * 4, -4 + i * 4, -8 + i * 4] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
