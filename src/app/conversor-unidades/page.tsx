"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Constantes didáticas
const AVOGADRO = 6.022e23; // partículas/mol
const V_MOLAR = 22.4; // L/mol (CNTP)

type Unit = "mol" | "g" | "L" | "particulas";

export default function ConversorUnidadesPage() {
  const [massaMolar, setMassaMolar] = useState("18.0"); // ex: H2O
  const [valor, setValor] = useState("1");
  const [unidade, setUnidade] = useState<Unit>("mol");

  const [resultado, setResultado] = useState<{
    mol?: number;
    g?: number;
    L?: number;
    particulas?: number;
  } | null>(null);

  const [erro, setErro] = useState<string | null>(null);

  const converter = () => {
    setErro(null);
    setResultado(null);

    const mm = parseFloat(massaMolar.replace(",", "."));
    const v = parseFloat(valor.replace(",", "."));

    if (isNaN(mm) || mm <= 0) {
      setErro("Informe uma massa molar válida (em g/mol).");
      return;
    }
    if (isNaN(v)) {
      setErro("Informe um valor numérico válido.");
      return;
    }

    let mol: number;

    switch (unidade) {
      case "mol":
        mol = v;
        break;
      case "g":
        mol = v / mm;
        break;
      case "L":
        mol = v / V_MOLAR;
        break;
      case "particulas":
        mol = v / AVOGADRO;
        break;
      default:
        mol = v;
    }

    const g = mol * mm;
    const L = mol * V_MOLAR;
    const particulas = mol * AVOGADRO;

    setResultado({ mol, g, L, particulas });
  };

  const format = (num?: number) =>
    num === undefined
      ? ""
      : num.toExponential
      ? Math.abs(num) >= 1e5 || Math.abs(num) <= 1e-3
        ? num.toExponential(3)
        : num.toFixed(3)
      : num.toString();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400/80">
            Apoio para exercícios de Química
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400">
            Conversor de Unidades Químicas
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Converta entre mol, gramas, litros (CNTP) e número de partículas
            usando a massa molar da substância. Ideal para estequiometria e
            preparação de aulas.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 backdrop-blur"
        >
          {/* Massa molar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Massa molar (g/mol)
            </label>
            <input
              value={massaMolar}
              onChange={(e) => setMassaMolar(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                         placeholder:text-slate-500 text-sm md:text-base"
              placeholder="Ex: 18,0 para H2O"
            />
            <p className="text-xs text-slate-400 mt-1">
              Use a massa molar da substância (H₂O ≈ 18 g/mol, CO₂ ≈ 44 g/mol,
              etc.).
            </p>
          </div>

          {/* Valor + unidade */}
          <div className="grid md:grid-cols-[2fr,1fr] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Valor
              </label>
              <input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           placeholder:text-slate-500 text-sm md:text-base"
                placeholder="Ex: 2,5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Unidade de entrada
              </label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as Unit)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
              >
                <option value="mol">mol</option>
                <option value="g">g (gramas)</option>
                <option value="L">L (CNTP)</option>
                <option value="particulas">partículas</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={converter}
            className="mt-6 w-full md:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 
                       font-semibold shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition"
          >
            Converter
          </motion.button>

          <div className="mt-6 min-h-[4rem]">
            {erro && <p className="text-sm text-red-400">{erro}</p>}

            {resultado && !erro && (
              <div className="grid md:grid-cols-2 gap-3 text-sm md:text-base">
                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Quantidade em mol
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.mol)} mol
                  </p>
                </div>

                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Massa
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.g)} g
                  </p>
                </div>

                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Volume (CNTP)
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.L)} L
                  </p>
                </div>

                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Número de partículas
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.particulas)} partículas
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-xs text-slate-500 text-center">
          *Considera volume molar de {V_MOLAR} L·mol⁻¹ (CNTP) e constante de
          Avogadro
          {` ≈ ${AVOGADRO.toExponential(3)} partículas·mol⁻¹.`}
        </p>
      </div>
    </main>
  );
}
