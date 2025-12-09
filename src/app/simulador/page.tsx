"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ElementSymbol = "H" | "C" | "O" | "N" | "Cl";

type Atom = {
  id: number;
  element: ElementSymbol;
  x: number;
  y: number;
};

type Bond = {
  id: number;
  from: number;
  to: number;
  order: 1 | 2 | 3;
};

type MoleculePreset = {
  id: string;
  name: string;
  formula: string;
  description: string;
  atoms: Atom[];
  bonds: Bond[];
  notes: string;
};

const ELEMENT_STYLE: Record<
  ElementSymbol,
  { name: string; color: string; border: string }
> = {
  H: { name: "Hidrogênio", color: "fill-cyan-400", border: "stroke-cyan-200" },
  C: { name: "Carbono", color: "fill-zinc-200", border: "stroke-zinc-50" },
  O: { name: "Oxigênio", color: "fill-red-400", border: "stroke-red-100" },
  N: {
    name: "Nitrogênio",
    color: "fill-indigo-400",
    border: "stroke-indigo-100",
  },
  Cl: { name: "Cloro", color: "fill-lime-400", border: "stroke-lime-100" },
};

// Coordenadas em um canvas 400x260 (viewBox)
const MOLECULES: MoleculePreset[] = [
  {
    id: "water",
    name: "Água",
    formula: "H₂O",
    description: "Molécula angular, com oxigênio central e dois hidrogênios.",
    atoms: [
      { id: 1, element: "O", x: 200, y: 120 },
      { id: 2, element: "H", x: 150, y: 180 },
      { id: 3, element: "H", x: 250, y: 180 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 1 },
      { id: 2, from: 1, to: 3, order: 1 },
    ],
    notes:
      "A água possui geometria angular (em V). Os pares de elétrons não ligantes no oxigênio empurram as ligações O–H, gerando um ângulo de aproximadamente 104,5°.",
  },
  {
    id: "carbon-dioxide",
    name: "Dióxido de carbono",
    formula: "CO₂",
    description: "Molécula linear, com carbono central e duas ligações duplas.",
    atoms: [
      { id: 1, element: "O", x: 120, y: 130 },
      { id: 2, element: "C", x: 200, y: 130 },
      { id: 3, element: "O", x: 280, y: 130 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 2 },
      { id: 2, from: 2, to: 3, order: 2 },
    ],
    notes:
      "O CO₂ é linear (180°). O carbono faz duas ligações duplas, uma com cada oxigênio, mantendo a soma de elétrons e a neutralidade da molécula.",
  },
  {
    id: "methane",
    name: "Metano",
    formula: "CH₄",
    description: "Molécula tetraédrica, aqui representada em projeção 2D.",
    atoms: [
      { id: 1, element: "C", x: 200, y: 130 },
      { id: 2, element: "H", x: 140, y: 80 },
      { id: 3, element: "H", x: 260, y: 80 },
      { id: 4, element: "H", x: 150, y: 190 },
      { id: 5, element: "H", x: 250, y: 190 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 1 },
      { id: 2, from: 1, to: 3, order: 1 },
      { id: 3, from: 1, to: 4, order: 1 },
      { id: 4, from: 1, to: 5, order: 1 },
    ],
    notes:
      "O metano é um exemplo clássico de geometria tetraédrica (109,5°). Na projeção 2D vemos uma aproximação da distribuição dos átomos ao redor do carbono.",
  },
  {
    id: "ammonia",
    name: "Amônia",
    formula: "NH₃",
    description:
      "Molécula trigonal piramidal, com N central e três H ao redor.",
    atoms: [
      { id: 1, element: "N", x: 200, y: 110 },
      { id: 2, element: "H", x: 150, y: 170 },
      { id: 3, element: "H", x: 250, y: 170 },
      { id: 4, element: "H", x: 200, y: 70 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 1 },
      { id: 2, from: 1, to: 3, order: 1 },
      { id: 3, from: 1, to: 4, order: 1 },
    ],
    notes:
      "A amônia possui geometria trigonal piramidal. O par de elétrons não ligante em N provoca repulsão adicional, alterando o ângulo ideal de 109,5° para algo em torno de 107°.",
  },
  {
    id: "hcl",
    name: "Cloreto de hidrogênio",
    formula: "HCl",
    description:
      "Molécula diatômica simples, importante como modelo de ligação polar.",
    atoms: [
      { id: 1, element: "H", x: 150, y: 130 },
      { id: 2, element: "Cl", x: 260, y: 130 },
    ],
    bonds: [{ id: 1, from: 1, to: 2, order: 1 }],
    notes:
      "O HCl é polar: o cloro é mais eletronegativo que o hidrogênio, puxando a densidade eletrônica e gerando um dipolo permanente.",
  },
  {
    id: "oxygen",
    name: "Oxigênio molecular",
    formula: "O₂",
    description: "Molécula diatômica formada por dois átomos de oxigênio.",
    atoms: [
      { id: 1, element: "O", x: 170, y: 130 },
      { id: 2, element: "O", x: 230, y: 130 },
    ],
    bonds: [{ id: 1, from: 1, to: 2, order: 2 }],
    notes:
      "O O₂ é essencial para a respiração aeróbia e participa em inúmeras reações de oxidação. A ligação é formalmente dupla, mas o tratamento completo envolve conceitos de orbital molecular.",
  },
  {
    id: "nitrogen",
    name: "Nitrogênio molecular",
    formula: "N₂",
    description:
      "Molécula diatômica com forte ligação tripla entre os nitrogênios.",
    atoms: [
      { id: 1, element: "N", x: 170, y: 130 },
      { id: 2, element: "N", x: 230, y: 130 },
    ],
    bonds: [{ id: 1, from: 1, to: 2, order: 3 }],
    notes:
      "A molécula de N₂ apresenta uma ligação tripla muito forte, o que explica sua baixa reatividade em condições normais e o papel de destaque na atmosfera.",
  },
  {
    id: "ozone",
    name: "Ozônio",
    formula: "O₃",
    description:
      "Molécula triatômica de oxigênio com estrutura angular e ressonância.",
    atoms: [
      { id: 1, element: "O", x: 150, y: 140 },
      { id: 2, element: "O", x: 200, y: 90 },
      { id: 3, element: "O", x: 250, y: 140 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 2 },
      { id: 2, from: 2, to: 3, order: 1 },
    ],
    notes:
      "O ozônio é fundamental na estratosfera, absorvendo radiação UV. Sua estrutura real é descrita por ressonância, com a deslocalização das ligações entre os átomos de oxigênio.",
  },
  {
    id: "carbon-monoxide",
    name: "Monóxido de carbono",
    formula: "CO",
    description:
      "Molécula diatômica tóxica, com ligação forte entre C e O e caráter de coordenação.",
    atoms: [
      { id: 1, element: "C", x: 170, y: 130 },
      { id: 2, element: "O", x: 230, y: 130 },
    ],
    bonds: [{ id: 1, from: 1, to: 2, order: 3 }],
    notes:
      "O CO é incolor e inodoro, porém altamente tóxico. Competindo com o O₂ pela hemoglobina, forma carboxi-hemoglobina, reduzindo o transporte de oxigênio no sangue.",
  },
  {
    id: "ethanol",
    name: "Etanol",
    formula: "C₂H₆O",
    description:
      "Molécula orgânica com grupo álcool – utilizada como combustível e em bebidas alcoólicas.",
    atoms: [
      { id: 1, element: "C", x: 150, y: 130 },
      { id: 2, element: "C", x: 210, y: 130 },
      { id: 3, element: "O", x: 270, y: 120 },
      { id: 4, element: "H", x: 140, y: 70 },
      { id: 5, element: "H", x: 120, y: 170 },
      { id: 6, element: "H", x: 180, y: 180 },
      { id: 7, element: "H", x: 210, y: 70 },
      { id: 8, element: "H", x: 240, y: 170 },
      { id: 9, element: "H", x: 300, y: 150 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 1 },
      { id: 2, from: 2, to: 3, order: 1 },
      { id: 3, from: 1, to: 4, order: 1 },
      { id: 4, from: 1, to: 5, order: 1 },
      { id: 5, from: 1, to: 6, order: 1 },
      { id: 6, from: 2, to: 7, order: 1 },
      { id: 7, from: 2, to: 8, order: 1 },
      { id: 8, from: 3, to: 9, order: 1 },
    ],
    notes:
      "O etanol possui um grupo hidroxila (–OH) ligado a um carbono saturado. É um exemplo clássico de álcool primário, muito usado em discussões de polaridade, solubilidade e combustão.",
  },
  {
    id: "acetic-acid",
    name: "Ácido acético",
    formula: "CH₃COOH",
    description:
      "Principal componente do vinagre, é um ácido carboxílico simples.",
    atoms: [
      { id: 1, element: "C", x: 130, y: 140 }, // CH3
      { id: 2, element: "C", x: 190, y: 130 }, // carbonila
      { id: 3, element: "O", x: 250, y: 100 }, // carbonila O
      { id: 4, element: "O", x: 250, y: 170 }, // OH O
      { id: 5, element: "H", x: 100, y: 90 },
      { id: 6, element: "H", x: 90, y: 160 },
      { id: 7, element: "H", x: 150, y: 190 },
      { id: 8, element: "H", x: 290, y: 180 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 1 },
      { id: 2, from: 2, to: 3, order: 2 },
      { id: 3, from: 2, to: 4, order: 1 },
      { id: 4, from: 1, to: 5, order: 1 },
      { id: 5, from: 1, to: 6, order: 1 },
      { id: 6, from: 1, to: 7, order: 1 },
      { id: 7, from: 4, to: 8, order: 1 },
    ],
    notes:
      "O ácido acético apresenta o grupo carboxila (–COOH), típico de ácidos carboxílicos. A presença da carbonila e da hidroxila no mesmo carbono torna o H da hidroxila mais ácido.",
  },
  {
    id: "benzene",
    name: "Benzeno",
    formula: "C₆H₆",
    description:
      "Molécula aromática em anel, com ressonância e ligações equivalentes.",
    atoms: [
      { id: 1, element: "C", x: 200, y: 70 },
      { id: 2, element: "C", x: 260, y: 100 },
      { id: 3, element: "C", x: 260, y: 160 },
      { id: 4, element: "C", x: 200, y: 190 },
      { id: 5, element: "C", x: 140, y: 160 },
      { id: 6, element: "C", x: 140, y: 100 },
      { id: 7, element: "H", x: 200, y: 35 },
      { id: 8, element: "H", x: 300, y: 90 },
      { id: 9, element: "H", x: 300, y: 170 },
      { id: 10, element: "H", x: 200, y: 225 },
      { id: 11, element: "H", x: 100, y: 170 },
      { id: 12, element: "H", x: 100, y: 90 },
    ],
    bonds: [
      { id: 1, from: 1, to: 2, order: 2 },
      { id: 2, from: 2, to: 3, order: 1 },
      { id: 3, from: 3, to: 4, order: 2 },
      { id: 4, from: 4, to: 5, order: 1 },
      { id: 5, from: 5, to: 6, order: 2 },
      { id: 6, from: 6, to: 1, order: 1 },
      { id: 7, from: 1, to: 7, order: 1 },
      { id: 8, from: 2, to: 8, order: 1 },
      { id: 9, from: 3, to: 9, order: 1 },
      { id: 10, from: 4, to: 10, order: 1 },
      { id: 11, from: 5, to: 11, order: 1 },
      { id: 12, from: 6, to: 12, order: 1 },
    ],
    notes:
      "O benzeno é o protótipo dos compostos aromáticos. As ligações C–C são equivalentes na descrição moderna, representando uma deslocalização de elétrons π pelo anel.",
  },
];

function drawBondLines(
  bond: Bond,
  atoms: Atom[]
): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset: { dx: number; dy: number };
} {
  const from = atoms.find((a) => a.id === bond.from)!;
  const to = atoms.find((a) => a.id === bond.to)!;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const offsetAmount = 6;
  const perpX = -uy * offsetAmount;
  const perpY = ux * offsetAmount;

  return {
    x1: from.x,
    y1: from.y,
    x2: to.x,
    y2: to.y,
    offset: { dx: perpX, dy: perpY },
  };
}

function MoleculeCanvas({ molecule }: { molecule: MoleculePreset }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className="w-full h-64 md:h-72 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-700 shadow-inner"
    >
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill="url(#bgGlow)" />

      {/* Ligações */}
      {molecule.bonds.map((bond) => {
        const base = drawBondLines(bond, molecule.atoms);
        const { x1, y1, x2, y2, offset } = base;

        const lines = [];
        if (bond.order === 1) {
          lines.push(
            <line
              key={`${bond.id}-single`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#94a3b8"
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        } else if (bond.order === 2) {
          lines.push(
            <line
              key={`${bond.id}-double-1`}
              x1={x1 + offset.dx}
              y1={y1 + offset.dy}
              x2={x2 + offset.dx}
              y2={y2 + offset.dy}
              stroke="#e2e8f0"
              strokeWidth={3}
              strokeLinecap="round"
            />,
            <line
              key={`${bond.id}-double-2`}
              x1={x1 - offset.dx}
              y1={y1 - offset.dy}
              x2={x2 - offset.dx}
              y2={y2 - offset.dy}
              stroke="#64748b"
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        } else if (bond.order === 3) {
          lines.push(
            <line
              key={`${bond.id}-triple-1`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e2e8f0"
              strokeWidth={3.5}
              strokeLinecap="round"
            />,
            <line
              key={`${bond.id}-triple-2`}
              x1={x1 + offset.dx}
              y1={y1 + offset.dy}
              x2={x2 + offset.dx}
              y2={y2 + offset.dy}
              stroke="#94a3b8"
              strokeWidth={2.5}
              strokeLinecap="round"
            />,
            <line
              key={`${bond.id}-triple-3`}
              x1={x1 - offset.dx}
              y1={y1 - offset.dy}
              x2={x2 - offset.dx}
              y2={y2 - offset.dy}
              stroke="#94a3b8"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          );
        }

        return lines;
      })}

      {/* Átomos */}
      {molecule.atoms.map((atom) => {
        const style = ELEMENT_STYLE[atom.element];
        return (
          <g key={atom.id}>
            <circle
              cx={atom.x + 4}
              cy={atom.y + 6}
              r={20}
              fill="black"
              opacity={0.45}
            />
            <circle
              cx={atom.x}
              cy={atom.y}
              r={20}
              className={`${style.color} ${style.border}`}
              strokeWidth={2}
            />
            <ellipse
              cx={atom.x - 6}
              cy={atom.y - 8}
              rx={10}
              ry={7}
              fill="white"
              opacity={0.35}
            />
            <text
              x={atom.x}
              y={atom.y + 4}
              textAnchor="middle"
              className="fill-slate-900 font-bold text-sm"
            >
              {atom.element}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function SimuladorMolecularPage() {
  const [selectedId, setSelectedId] = useState<string>(MOLECULES[0].id);
  const molecule = MOLECULES.find((m) => m.id === selectedId)!;

  const elementCount = molecule.atoms.reduce<Record<string, number>>(
    (acc, atom) => {
      acc[atom.element] = (acc[atom.element] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-5xl w-full space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400/80">
            Visualização de estruturas moleculares
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400">
            Simulador de Moléculas
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Explore moléculas em um ambiente visual: veja átomos, ligações
            simples, duplas e triplas, geometria aproximada e comentários
            didáticos.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 space-y-6"
        >
          <div className="grid md:grid-cols-[1.4fr,1fr] gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Escolha uma molécula para visualizar
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 text-sm md:text-base"
              >
                {MOLECULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.formula})
                  </option>
                ))}
              </select>

              <p className="mt-3 text-sm text-slate-300">
                <span className="font-semibold">{molecule.name}</span> —{" "}
                {molecule.description}
              </p>

              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400">
                Fórmula
              </p>
              <p className="text-lg md:text-xl font-semibold text-slate-50">
                {molecule.formula}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">
                Composição
              </p>
              <ul className="space-y-1 text-sm text-slate-200">
                {Object.entries(elementCount).map(([el, q]) => {
                  const sym = el as ElementSymbol;
                  const style = ELEMENT_STYLE[sym];
                  return (
                    <li key={el} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full ${style.color} border border-slate-100/60`}
                        />
                        <span className="font-semibold">
                          {el} — {style.name}
                        </span>
                      </div>
                      <span className="text-cyan-300 font-mono">
                        {q} átomo(s)
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">
              Visualização
            </p>
            <MoleculeCanvas molecule={molecule} />
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-1">
              Interpretação estrutural
            </p>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              {molecule.notes}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              *Representação qualitativa, pensada para apoiar discussões sobre
              geometria molecular, polaridade e ligações em sala de aula.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
