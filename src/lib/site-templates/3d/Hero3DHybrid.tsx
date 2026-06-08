"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Hero3DFull = dynamic(() => import("./Hero3DFull").then((m) => m.Hero3DFull), { ssr: false, loading: () => <div className="h-[320px] animate-pulse bg-white/10 rounded-2xl" /> });

export function Hero3DHybrid({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative">
      <Hero3DFull primaryColor={primaryColor} secondaryColor={secondaryColor} />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
    </motion.div>
  );
}
