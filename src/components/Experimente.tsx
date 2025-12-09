"use client";
import { motion } from "framer-motion";

export default function Experimente() {
  const miniApps = [
    {
      title: "Balanceador de Equações",
      desc: "Mini app interativo de balanceamento.",
    },
    {
      title: "Conversor de Unidades",
      desc: "Converta mol, g, L e partículas rapidamente.",
    },
  ];

  return (
    <section className="max-w-4xl w-full py-20 px-6 text-center">
      <h2 className="text-4xl font-bold mb-10 text-blue-400">Experimente</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {miniApps.map((app, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-700 hover:border-blue-400 transition"
          >
            <h3 className="text-xl font-bold mb-2 text-blue-300">
              {app.title}
            </h3>
            <p className="text-gray-300">{app.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
