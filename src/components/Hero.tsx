"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import ScientificSymbolsBackground from "./ScientificSymbolsBackground";
import SocialIcons from "./SocialIcons";

export default function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);

  // Pequena animação flutuante da foto
  useAnimationFrame(() => {
    if (photoRef.current) {
      const t = Date.now() * 0.002;
      photoRef.current.style.transform = `translateY(${Math.sin(t) * 10}px)`;
    }
  });

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center min-h-screen w-full overflow-hidden px-6 bg-gray-900">
      {/* Fundo 3D */}
      <ScientificSymbolsBackground />

      {/* Conteúdo textual */}
      <div className="flex-1 text-center md:text-left z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-xl"
        >
          Adauto Marques
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-xl mt-6 text-cyan-200"
        >
          Professor de Química e Matemática | Programador Full Stack
        </motion.p>

        {/* Ícones sociais */}
        <div className="mt-6">
          <SocialIcons />
        </div>
      </div>

      {/* Foto flutuante */}
      <motion.div
        ref={photoRef}
        initial={{ scale: 0.8, opacity: 0, x: 50 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-8 md:mt-0 w-60 h-60 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_20px_cyan] z-10"
      >
        <img
          src="/eu.png"
          alt="Adauto Marques"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </section>
  );
}
