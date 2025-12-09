"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type UnidadeQuantidade = "g" | "mol";

export default function CalculadoraEstequiometriaPage() {
  const [coefReagente, setCoefReagente] = useState("1");
  const [coefProduto, setCoefProduto] = useState("1");
  const [mmReagente, setMmReagente] = useState("18.0"); // exemplo: H2O
  const [mmProduto, setMmProduto] = useState("18.0");

  const [valorReagente, setValorReagente] = useState("1");
  const [unidadeReagente, setUnidadeReagente] =
    useState<UnidadeQuantidade>("mol");

  const [resultado, setResultado] = useState<{
    nReagente: number;
    nProduto: number;
    mProduto: number;
  } | null>(null);

  const [erro, setErro] = useState<string | null>(null);

  const calcular = () => {
    setErro(null);
    setResultado(null);

    const a = parseFloat(coefReagente.replace(",", "."));
    const b = parseFloat(coefProduto.replace(",", "."));
    const mmR = parseFloat(mmReagente.replace(",", "."));
    const mmP = parseFloat(mmProduto.replace(",", "."));
    const vR = parseFloat(valorReagente.replace(",", "."));

    if ([a, b, mmR, mmP, vR].some((v) => isNaN(v) || v <= 0)) {
      setErro("Preencha todos os campos com valores numéricos válidos.");
      return;
    }

    // mols do reagente informado
    const nReagente = unidadeReagente === "mol" ? vR : vR / mmR;

    // relação estequiométrica: aR -> bP
    const nProduto = (b / a) * nReagente;

    const mProduto = nProduto * mmP;

    setResultado({ nReagente, nProduto, mProduto });
  };

  const format = (num?: number) =>
    num === undefined
      ? ""
      : Math.abs(num) >= 1e5 || Math.abs(num) <= 1e-3
      ? num.toExponential(3)
      : num.toFixed(3);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400/80">
            Estequiometria na prática
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400">
            Calculadora de Estequiometria
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Informe a proporção entre reagente e produto, as massas molares e a
            quantidade de reagente. A calculadora fornece a quantidade de
            produto formada em mol e em gramas.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 backdrop-blur"
        >
          {/* Proporção estequiométrica */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Proporção estequiométrica (aR → bP)
            </label>
            <div className="flex items-center gap-2">
              <input
                value={coefReagente}
                onChange={(e) => setCoefReagente(e.target.value)}
                className="w-20 bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
              />
              <span className="text-slate-300 text-sm md:text-base">
                mol de reagente →
              </span>
              <input
                value={coefProduto}
                onChange={(e) => setCoefProduto(e.target.value)}
                className="w-20 bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
              />
              <span className="text-slate-300 text-sm md:text-base">
                mol de produto
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Exemplo: na reação 2H₂ + O₂ → 2H₂O, temos a = 2 (H₂) e b = 2
              (H₂O).
            </p>
          </div>

          {/* Massas molares */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Massa molar do reagente (g/mol)
              </label>
              <input
                value={mmReagente}
                onChange={(e) => setMmReagente(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
                placeholder="Ex: 2,0 para H₂"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Massa molar do produto (g/mol)
              </label>
              <input
                value={mmProduto}
                onChange={(e) => setMmProduto(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
                placeholder="Ex: 18,0 para H₂O"
              />
            </div>
          </div>

          {/* Quantidade de reagente */}
          <div className="grid md:grid-cols-[2fr,1fr] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Quantidade de reagente
              </label>
              <input
                value={valorReagente}
                onChange={(e) => setValorReagente(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
                placeholder="Ex: 5,0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Unidade
              </label>
              <select
                value={unidadeReagente}
                onChange={(e) =>
                  setUnidadeReagente(e.target.value as UnidadeQuantidade)
                }
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                           text-sm md:text-base"
              >
                <option value="mol">mol</option>
                <option value="g">g (gramas)</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={calcular}
            className="mt-6 w-full md:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 
                       font-semibold shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition"
          >
            Calcular produto formado
          </motion.button>

          <div className="mt-6 min-h-[4rem]">
            {erro && <p className="text-sm text-red-400">{erro}</p>}

            {resultado && !erro && (
              <div className="grid md:grid-cols-3 gap-3 text-sm md:text-base">
                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Mol de reagente usado
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.nReagente)} mol
                  </p>
                </div>
                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Mol de produto formado
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.nProduto)} mol
                  </p>
                </div>
                <div className="bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Massa de produto formada
                  </p>
                  <p className="text-cyan-300 font-semibold">
                    {format(resultado.mProduto)} g
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-xs text-slate-500 text-center">
          *Cálculos baseados na relação estequiométrica aR → bP e nas massas
          molares informadas. Não considera reagente limitante com mais de um
          reagente.
        </p>
      </div>
    </main>
  );
}
