"use client";
import { motion } from "framer-motion";

export default function Projects() {
  const projects = [
    {
      title: "Simulador de Reações Químicas",
      description:
        "App interativo para visualizar e explorar reações químicas em aula.",
      link: "/simulador", // futuro
    },
    {
      title: "Calculadora de Estequiometria",
      description:
        "Ferramenta para cálculos de reagente, produto e massas em reações químicas.",
      link: "/calculadora-estequiometria",
    },
    {
      title: "Gerador de Exercícios de Química",
      description:
        "Gere automaticamente listas de exercícios e gabaritos para suas aulas.",
      link: "/gerador-exercicios", // 👈 AQUI VAI PRO GERADOR
    },
  ];

  const labs = [
    {
      title: "Balanceador de Equações",
      description: "Mini app interativo para balancear equações químicas.",
      link: "/balanceador-de-equacoes",
    },
    {
      title: "Conversor de Unidades",
      description: "Converta mol, gramas, litros (CNTP) e partículas.",
      link: "/conversor-unidades",
    },
  ];

  return (
    <section className="w-full bg-slate-950 py-20 px-6 text-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* PROJETOS */}
        <h2 className="text-4xl font-bold mb-14 text-center text-cyan-400">
          Projetos
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((proj, i) => (
            <a key={i} href={proj.link}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900/80 border border-slate-700 p-6 rounded-2xl 
                           shadow-xl backdrop-blur hover:border-cyan-400 
                           hover:shadow-cyan-500/30 transition cursor-pointer"
              >
                <h3 className="text-xl font-bold text-cyan-300 mb-3">
                  {proj.title}
                </h3>
                <p className="text-slate-300">{proj.description}</p>
              </motion.div>
            </a>
          ))}
        </div>

        {/* EXPERIMENTE */}
        <h2 className="text-3xl font-bold text-center text-cyan-400 mt-20 mb-10">
          Experimente
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {labs.map((lab, i) => (
            <a key={i} href={lab.link}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900/80 border border-slate-700 p-6 rounded-2xl 
                           shadow-xl backdrop-blur hover:border-cyan-400 
                           hover:shadow-cyan-500/30 transition cursor-pointer"
              >
                <h3 className="text-xl font-bold text-cyan-300 mb-3">
                  {lab.title}
                </h3>
                <p className="text-slate-300">{lab.description}</p>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
