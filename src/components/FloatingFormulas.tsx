"use client";
import { motion } from "framer-motion";

const formulas = ["H₂O", "NaCl", "CH₄", "C₆H₁₂O₆", "O₂", "CO₂", "NH₃", "H₂SO₄"];

export default function FloatingFormulas() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {formulas.map((formula, index) => (
        <motion.span
          key={index}
          className="absolute text-gray-500 text-2xl formula select-none"
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
          }}
        >
          {formula}
        </motion.span>
      ))}
    </div>
  );
}
