"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// --------- PARSER DE FÓRMULA QUÍMICA ---------

type ElementCounts = Record<string, number>;

function mergeCounts(base: ElementCounts, add: ElementCounts, factor = 1) {
  for (const el in add) {
    base[el] = (base[el] || 0) + add[el] * factor;
  }
}

function parseFormula(formula: string): ElementCounts {
  let i = 0;

  function parseGroup(): ElementCounts {
    const counts: ElementCounts = {};
    while (i < formula.length) {
      const ch = formula[i];

      if (ch === "(") {
        i++; // pula "("
        const inner = parseGroup();
        // depois do grupo, vem o multiplicador
        let numStr = "";
        while (i < formula.length && /[0-9]/.test(formula[i])) {
          numStr += formula[i++];
        }
        const mult = numStr ? parseInt(numStr, 10) : 1;
        mergeCounts(counts, inner, mult);
      } else if (ch === ")") {
        i++; // pula ")"
        break;
      } else if (/[A-Z]/.test(ch)) {
        let symbol = ch;
        i++;
        // letra minúscula opcional
        if (i < formula.length && /[a-z]/.test(formula[i])) {
          symbol += formula[i++];
        }
        // número opcional
        let numStr = "";
        while (i < formula.length && /[0-9]/.test(formula[i])) {
          numStr += formula[i++];
        }
        const mult = numStr ? parseInt(numStr, 10) : 1;
        counts[symbol] = (counts[symbol] || 0) + mult;
      } else {
        // caractere inesperado (espaço, etc.)
        i++;
      }
    }
    return counts;
  }

  return parseGroup();
}

// --------- MONTAGEM DA MATRIZ ---------

interface ParsedEquation {
  left: string[];
  right: string[];
  elements: string[];
  matrix: number[][];
}

function parseEquation(equation: string): ParsedEquation {
  const cleaned = equation.replace(/\s+/g, "").replace(/⇒|=>/g, "->");
  const [leftStr, rightStr] = cleaned.split("->");
  if (!leftStr || !rightStr) {
    throw new Error("Equação inválida. Use o formato: H2 + O2 -> H2O");
  }

  const left = leftStr.split("+");
  const right = rightStr.split("+");

  const allCompounds = [...left, ...right];

  const elementSet = new Set<string>();
  const compoundCounts: ElementCounts[] = [];

  for (const compound of allCompounds) {
    const counts = parseFormula(compound);
    compoundCounts.push(counts);
    Object.keys(counts).forEach((el) => elementSet.add(el));
  }

  const elements = Array.from(elementSet);
  const m = elements.length;
  const n = allCompounds.length;

  const matrix: number[][] = Array.from({ length: m }, () => Array(n).fill(0));

  elements.forEach((el, row) => {
    allCompounds.forEach((compound, col) => {
      const counts = compoundCounts[col][el] || 0;
      // reagentes positivos, produtos negativos
      const isRight = col >= left.length;
      matrix[row][col] = isRight ? -counts : counts;
    });
  });

  return { left, right, elements, matrix };
}

// --------- RESOLUÇÃO Ax = 0 (fixando última variável = 1) ---------

function gaussianSolve(A: number[][], b: number[]): number[] | null {
  const m = A.length;
  const n = A[0]?.length || 0;

  // cria matriz aumentada
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  // eliminação
  let row = 0;
  for (let col = 0; col < n && row < m; col++) {
    // acha o melhor pivô
    let pivot = row;
    for (let r = row + 1; r < m; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) {
        pivot = r;
      }
    }
    if (Math.abs(M[pivot][col]) < 1e-10) continue; // coluna quase zero

    // troca linha
    [M[row], M[pivot]] = [M[pivot], M[row]];

    // normaliza
    const pivotVal = M[row][col];
    for (let c = col; c <= n; c++) {
      M[row][c] /= pivotVal;
    }

    // zera abaixo
    for (let r = row + 1; r < m; r++) {
      const factor = M[r][col];
      for (let c = col; c <= n; c++) {
        M[r][c] -= factor * M[row][c];
      }
    }

    row++;
  }

  // retro-substituição
  const x = Array(n).fill(0);
  for (let r = m - 1; r >= 0; r--) {
    // acha primeira coluna não-zero
    let leadCol = -1;
    for (let c = 0; c < n; c++) {
      if (Math.abs(M[r][c]) > 1e-10) {
        leadCol = c;
        break;
      }
    }
    if (leadCol === -1) continue; // linha toda zero

    let sum = M[r][n]; // termo independente
    for (let c = leadCol + 1; c < n; c++) {
      sum -= M[r][c] * x[c];
    }
    x[leadCol] = sum / M[r][leadCol];
  }

  return x;
}

function balanceEquation(equation: string) {
  const { left, right, matrix } = parseEquation(equation);

  const m = matrix.length;
  const n = matrix[0]?.length || 0;

  if (n <= 1) {
    throw new Error("Equação muito simples ou inválida para balanceamento.");
  }

  // fixamos última variável = 1
  const A: number[][] = matrix.map((row) => row.slice(0, n - 1));
  const lastCol = matrix.map((row) => row[n - 1]);
  const b = lastCol.map((v) => -v); // A * x' = -últimaColuna

  const solution = gaussianSolve(A, b);
  if (!solution) {
    throw new Error("Não foi possível balancear esta equação.");
  }

  const coeffs = [...solution, 1];

  // transforma em inteiros
  const scaled = coeffs.map((v) => Math.round(v * 1000)); // escala
  // gcd
  const gcd = (a: number, b: number): number =>
    b === 0 ? Math.abs(a) : gcd(b, a % b);

  let g = scaled.reduce((acc, v) => gcd(acc, v), scaled[0] || 1);
  if (g === 0) g = 1;

  let integers = scaled.map((v) => v / g);

  // garante positivos
  const sign = integers.find((v) => v !== 0 && v < 0) ? -1 : 1;
  if (sign === -1) integers = integers.map((v) => -v);

  // evita zeros
  if (integers.some((v) => v === 0)) {
    throw new Error("Solução inválida encontrada.");
  }

  const leftCoeffs = integers.slice(0, left.length);
  const rightCoeffs = integers.slice(left.length);

  const formatSide = (compounds: string[], coeffs: number[]) =>
    compounds
      .map((c, i) => `${coeffs[i] === 1 ? "" : coeffs[i]}${c}`)
      .join(" + ");

  return {
    leftFormatted: formatSide(left, leftCoeffs),
    rightFormatted: formatSide(right, rightCoeffs),
    allCoeffs: integers,
  };
}

// --------- COMPONENTE DE UI ---------

export default function BalanceadorPage() {
  const [input, setInput] = useState("H2 + O2 -> H2O");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBalance = () => {
    try {
      setError(null);
      const result = balanceEquation(input);
      setOutput(`${result.leftFormatted} → ${result.rightFormatted}`);
    } catch (err: any) {
      setOutput(null);
      setError(err.message || "Erro ao balancear a equação.");
    }
  };

  const examples = [
    "H2 + O2 -> H2O",
    "Fe + O2 -> Fe2O3",
    "Al + O2 -> Al2O3",
    "C3H8 + O2 -> CO2 + H2O",
    "Na3PO4 + MgCl2 -> NaCl + Mg3(PO4)2",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400/80">
            Ferramenta para estudantes e professores
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400">
            Balanceador de Equações Químicas
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Digite uma equação química e obtenha automaticamente os coeficientes
            balanceados. Ideal para uso em sala de aula, listas de exercícios e
            materiais didáticos.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 backdrop-blur"
        >
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Equação química
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400
                       placeholder:text-slate-500 text-sm md:text-base"
            placeholder="Ex: C3H8 + O2 -> CO2 + H2O"
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setInput(ex)}
                className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-slate-600 
                           hover:border-cyan-400 hover:text-cyan-300 transition bg-slate-900/60"
              >
                {ex}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBalance}
            className="mt-6 w-full md:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 
                       font-semibold shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition"
          >
            Balancear equação
          </motion.button>

          <div className="mt-6 min-h-[3rem]">
            {output && (
              <p className="text-lg md:text-xl font-semibold text-cyan-300 break-words">
                {output}
              </p>
            )}
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>
        </motion.div>

        <p className="text-xs text-slate-500 text-center">
          *Esta ferramenta utiliza um algoritmo de resolução de sistemas
          lineares para encontrar os coeficientes inteiros que balanceiam a
          equação.
        </p>
      </div>
    </main>
  );
}
