"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

type TipoExercicio =
  | "balanceamento"
  | "conversoes"
  | "estequiometria"
  | "combustao"
  | "limitante";

type Nivel = "facil" | "medio" | "dificil";

interface Exercicio {
  enunciado: string;
  resposta: string;
}

// ----------------- HELPERS GERAIS -----------------

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNum(n: number, casas = 3): string {
  const v = Number(n);
  if (!isFinite(v)) return "";
  const abs = Math.abs(v);
  if (abs >= 1e5 || abs <= 1e-3) return v.toExponential(3);
  return v.toFixed(casas);
}

// ----------------- GERAÇÃO: BALANCEAMENTO -----------------

function gerarBalanceamento(nivel: Nivel, quantidade: number): Exercicio[] {
  const baseFacil = [
    {
      bruta: "H₂ + O₂ → H₂O",
      balanceada: "2H₂ + O₂ → 2H₂O",
    },
    {
      bruta: "Na + Cl₂ → NaCl",
      balanceada: "2Na + Cl₂ → 2NaCl",
    },
    {
      bruta: "N₂ + H₂ → NH₃",
      balanceada: "N₂ + 3H₂ → 2NH₃",
    },
  ];

  const baseMedia = [
    {
      bruta: "Fe + O₂ → Fe₂O₃",
      balanceada: "4Fe + 3O₂ → 2Fe₂O₃",
    },
    {
      bruta: "Al + O₂ → Al₂O₃",
      balanceada: "4Al + 3O₂ → 2Al₂O₃",
    },
    {
      bruta: "C₃H₈ + O₂ → CO₂ + H₂O",
      balanceada: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
    },
  ];

  const baseDificil = [
    {
      bruta: "KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂",
      balanceada: "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂",
    },
    {
      bruta: "Na₃PO₄ + MgCl₂ → NaCl + Mg₃(PO₄)₂",
      balanceada: "2Na₃PO₄ + 3MgCl₂ → 6NaCl + Mg₃(PO₄)₂",
    },
  ];

  let pool = baseFacil;
  if (nivel === "medio") pool = baseFacil.concat(baseMedia);
  if (nivel === "dificil") pool = baseFacil.concat(baseMedia, baseDificil);

  const exs: Exercicio[] = [];

  for (let i = 0; i < quantidade; i++) {
    const eq = randomChoice(pool);
    exs.push({
      enunciado: `Balanceie a equação a seguir:\n${eq.bruta}`,
      resposta: eq.balanceada,
    });
  }

  return exs;
}

// ----------------- GERAÇÃO: CONVERSÕES -----------------

const AVOGADRO = 6.022e23; // partículas/mol
const V_MOLAR = 22.4; // L/mol (CNTP)

interface Substancia {
  nome: string;
  formula: string;
  mm: number;
}

const substancias: Substancia[] = [
  { nome: "água", formula: "H₂O", mm: 18 },
  { nome: "dióxido de carbono", formula: "CO₂", mm: 44 },
  { nome: "gás oxigênio", formula: "O₂", mm: 32 },
  { nome: "gás nitrogênio", formula: "N₂", mm: 28 },
  { nome: "cloreto de sódio", formula: "NaCl", mm: 58.5 },
];

type UnidadeBase = "mol" | "g" | "L" | "particulas";

function gerarConversoes(nivel: Nivel, quantidade: number): Exercicio[] {
  const exs: Exercicio[] = [];

  for (let i = 0; i < quantidade; i++) {
    const s = randomChoice(substancias);

    let unidadeOrigem: UnidadeBase = "mol";
    let unidadeDestino: UnidadeBase = "g";

    if (nivel === "facil") {
      unidadeOrigem = randomChoice(["mol", "g"]);
      unidadeDestino = unidadeOrigem === "mol" ? "g" : "mol";
    } else if (nivel === "medio") {
      unidadeOrigem = randomChoice(["mol", "g", "L"]);
      unidadeDestino = randomChoice(
        ["mol", "g", "L"].filter((u) => u !== unidadeOrigem)
      );
    } else {
      unidadeOrigem = randomChoice(["mol", "g", "L", "particulas"]);
      unidadeDestino = randomChoice(
        ["mol", "g", "L", "particulas"].filter((u) => u !== unidadeOrigem)
      );
    }

    const valorOrigem = randomInt(2, 50); // valor inteiro para ficar didático

    // converte tudo via mol
    let mol: number;
    if (unidadeOrigem === "mol") mol = valorOrigem;
    else if (unidadeOrigem === "g") mol = valorOrigem / s.mm;
    else if (unidadeOrigem === "L") mol = valorOrigem / V_MOLAR;
    else mol = valorOrigem / AVOGADRO;

    let valorDestino: number;
    let unidadeDestinoTexto: string;

    if (unidadeDestino === "mol") {
      valorDestino = mol;
      unidadeDestinoTexto = "mol";
    } else if (unidadeDestino === "g") {
      valorDestino = mol * s.mm;
      unidadeDestinoTexto = "g";
    } else if (unidadeDestino === "L") {
      valorDestino = mol * V_MOLAR;
      unidadeDestinoTexto = "L (CNTP)";
    } else {
      valorDestino = mol * AVOGADRO;
      unidadeDestinoTexto = "partículas";
    }

    const textoOrigem =
      unidadeOrigem === "mol"
        ? `${valorOrigem} mol`
        : unidadeOrigem === "g"
        ? `${valorOrigem} g`
        : unidadeOrigem === "L"
        ? `${valorOrigem} L (CNTP)`
        : `${valorOrigem} partículas`;

    const enunciado = `Para a substância ${s.nome} (${s.formula}), sabendo que sua massa molar é aproximadamente ${s.mm} g/mol, converta:\n${textoOrigem} → (${unidadeDestinoTexto}).`;

    const resposta = `${textoOrigem} de ${
      s.formula
    } corresponde a aproximadamente ${formatNum(
      valorDestino
    )} ${unidadeDestinoTexto}.`;

    exs.push({ enunciado, resposta });
  }

  return exs;
}

// ----------------- GERAÇÃO: ESTEQUIOMETRIA -----------------

function gerarEstequiometria(nivel: Nivel, quantidade: number): Exercicio[] {
  const reacoes = [
    {
      desc: "2H₂ + O₂ → 2H₂O",
      reagente: "H₂",
      produto: "H₂O",
      coefR: 2,
      coefP: 2,
      mmR: 2,
      mmP: 18,
    },
    {
      desc: "N₂ + 3H₂ → 2NH₃",
      reagente: "H₂",
      produto: "NH₃",
      coefR: 3,
      coefP: 2,
      mmR: 2,
      mmP: 17,
    },
    {
      desc: "C + O₂ → CO₂",
      reagente: "C",
      produto: "CO₂",
      coefR: 1,
      coefP: 1,
      mmR: 12,
      mmP: 44,
    },
  ];

  const exs: Exercicio[] = [];

  for (let i = 0; i < quantidade; i++) {
    const r = randomChoice(reacoes);
    const massaReagente =
      nivel === "facil"
        ? randomInt(2, 10)
        : nivel === "medio"
        ? randomInt(5, 30)
        : randomInt(10, 50);

    const nReagente = massaReagente / r.mmR;
    const nProduto = (r.coefP / r.coefR) * nReagente;
    const mProduto = nProduto * r.mmP;

    const enunciado = `Considere a reação:\n${r.desc}\n\nAdmitindo que o reagente ${r.reagente} está em quantidade limitada e que os demais estão em excesso, qual é a massa de ${r.produto} formada a partir de ${massaReagente} g de ${r.reagente}, assumindo rendimento de 100%?`;

    const resposta = `n(${r.reagente}) = ${massaReagente} / ${
      r.mmR
    } ≈ ${formatNum(nReagente)} mol.\nPela proporção estequiométrica, n(${
      r.produto
    }) ≈ ${formatNum(nProduto)} mol.\nLogo, m(${r.produto}) ≈ ${formatNum(
      mProduto
    )} g.`;

    exs.push({ enunciado, resposta });
  }

  return exs;
}

// ----------------- GERAÇÃO: COMBUSTÃO -----------------

function gerarCombustao(nivel: Nivel, quantidade: number): Exercicio[] {
  const exs: Exercicio[] = [];
  const combustiveis = [
    {
      formula: "CH₄",
      mm: 16,
      desc: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      coefFuel: 1,
      coefCO2: 1,
      mmCO2: 44,
    },
    {
      formula: "C₃H₈",
      mm: 44,
      desc: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
      coefFuel: 1,
      coefCO2: 3,
      mmCO2: 44,
    },
  ];

  for (let i = 0; i < quantidade; i++) {
    const c = randomChoice(combustiveis);
    const massa =
      nivel === "facil"
        ? randomInt(5, 20)
        : nivel === "medio"
        ? randomInt(10, 40)
        : randomInt(20, 80);

    const nFuel = massa / c.mm;
    const nCO2 = (c.coefCO2 / c.coefFuel) * nFuel;
    const mCO2 = nCO2 * c.mmCO2;

    const enunciado = `Na combustão completa de ${c.formula}, representada pela equação:\n${c.desc}\n\nQual é a massa de CO₂ produzida na queima de ${massa} g de ${c.formula}, admitindo excesso de oxigênio e rendimento de 100%?`;

    const resposta = `n(${c.formula}) = ${massa} / ${c.mm} ≈ ${formatNum(
      nFuel
    )} mol.\nPela proporção estequiométrica, n(CO₂) ≈ ${formatNum(
      nCO2
    )} mol.\nLogo, m(CO₂) ≈ ${formatNum(mCO2)} g.`;

    exs.push({ enunciado, resposta });
  }

  return exs;
}

// ----------------- GERAÇÃO: REAGENTE LIMITANTE -----------------

function gerarLimitante(nivel: Nivel, quantidade: number): Exercicio[] {
  const exs: Exercicio[] = [];

  for (let i = 0; i < quantidade; i++) {
    const mmN2 = 28;
    const mmH2 = 2;

    const mN2 =
      nivel === "facil"
        ? randomInt(10, 30)
        : nivel === "medio"
        ? randomInt(20, 50)
        : randomInt(30, 80);
    const mH2 =
      nivel === "facil"
        ? randomInt(1, 6)
        : nivel === "medio"
        ? randomInt(4, 12)
        : randomInt(8, 20);

    const nN2 = mN2 / mmN2;
    const nH2 = mH2 / mmH2;

    const razaoN2 = nN2 / 1;
    const razaoH2 = nH2 / 3;

    let limitante = "";
    if (razaoN2 < razaoH2) limitante = "N₂";
    else if (razaoH2 < razaoN2) limitante = "H₂";
    else
      limitante =
        "Ambos são consumidos exatamente na proporção estequiométrica";

    const enunciado = `Considere a reação de formação da amônia:\nN₂ + 3H₂ → 2NH₃\n\nEm um experimento, misturam-se ${mN2} g de N₂ e ${mH2} g de H₂. Admitindo rendimento de 100%, qual é o reagente limitante?`;

    const resposta = `n(N₂) = ${mN2} / ${mmN2} ≈ ${formatNum(
      nN2
    )} mol;\nn(H₂) = ${mH2} / ${mmH2} ≈ ${formatNum(
      nH2
    )} mol.\n\nPara a proporção estequiométrica 1 mol de N₂ : 3 mol de H₂:\nrazão em termos de N₂ = ${formatNum(
      razaoN2
    )};\nrazão em termos de H₂ = ${formatNum(
      razaoH2
    )}.\n\nLogo, o reagente limitante é: ${limitante}.`;

    exs.push({ enunciado, resposta });
  }

  return exs;
}

// ----------------- ORQUESTRAÇÃO GERAL -----------------

function gerarExercicios(
  tipo: TipoExercicio,
  nivel: Nivel,
  quantidade: number
): Exercicio[] {
  switch (tipo) {
    case "balanceamento":
      return gerarBalanceamento(nivel, quantidade);
    case "conversoes":
      return gerarConversoes(nivel, quantidade);
    case "estequiometria":
      return gerarEstequiometria(nivel, quantidade);
    case "combustao":
      return gerarCombustao(nivel, quantidade);
    case "limitante":
      return gerarLimitante(nivel, quantidade);
    default:
      return [];
  }
}

// ----------------- PDF HELPERS -----------------

function gerarPdfLista(exercicios: Exercicio[], titulo: string) {
  const doc = new jsPDF();
  const marginLeft = 15;
  let cursorY = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(titulo, marginLeft, cursorY);
  cursorY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  exercicios.forEach((ex, idx) => {
    const enunciado = `Exercício ${idx + 1}:\n${ex.enunciado}`;

    const lines = doc.splitTextToSize(enunciado, 180);

    if (cursorY + lines.length * 6 > 280) {
      doc.addPage();
      cursorY = 20;
    }

    doc.text(lines, marginLeft, cursorY);
    cursorY += lines.length * 6 + 6;
  });

  doc.save("lista-exercicios-quimica.pdf");
}

function gerarPdfGabarito(exercicios: Exercicio[], titulo: string) {
  const doc = new jsPDF();
  const marginLeft = 15;
  let cursorY = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${titulo} - Gabarito`, marginLeft, cursorY);
  cursorY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  exercicios.forEach((ex, idx) => {
    const bloco = `Exercício ${idx + 1} - Gabarito:\n${ex.resposta}`;

    const lines = doc.splitTextToSize(bloco, 180);

    if (cursorY + lines.length * 6 > 280) {
      doc.addPage();
      cursorY = 20;
    }

    doc.text(lines, marginLeft, cursorY);
    cursorY += lines.length * 6 + 6;
  });

  doc.save("gabarito-exercicios-quimica.pdf");
}

// ----------------- COMPONENTE PRINCIPAL -----------------

export default function GeradorExerciciosPage() {
  const [tipo, setTipo] = useState<TipoExercicio>("balanceamento");
  const [quantidade, setQuantidade] = useState("5");
  const [nivel, setNivel] = useState<Nivel>("medio");

  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [mostrarGabarito, setMostrarGabarito] = useState(false);

  const handleGerar = () => {
    const q = parseInt(quantidade || "0", 10);
    const qtdSegura = isNaN(q) ? 5 : Math.min(Math.max(q, 1), 50);

    const gerados = gerarExercicios(tipo, nivel, qtdSegura);
    setExercicios(gerados);
    setMostrarGabarito(false);
  };

  const tituloBase = "Lista de Exercícios de Química";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-16 px-4">
      <div className="max-w-4xl w-full space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400/80">
            Laboratório Digital de Química
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400">
            Gerador de Exercícios Automático
          </h1>

          <p className="text-slate-300 text-sm md:text-base">
            Escolha o tipo, o nível e a quantidade de exercícios. O sistema gera
            automaticamente enunciados prontos para uso em sala e um gabarito
            comentado, com opção de exportar para PDF.
          </p>
        </div>

        {/* CARD PRINCIPAL - OPÇÕES */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/70 border border-slate-700 backdrop-blur shadow-xl shadow-cyan-500/10 rounded-2xl p-6 md:p-8"
        >
          {/* Tipo de exercício */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Tipo de exercício
            </label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoExercicio)}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 
                         text-sm md:text-base"
            >
              <option value="balanceamento">Balanceamento de Equações</option>
              <option value="conversoes">
                Conversões (mol, g, L, partículas)
              </option>
              <option value="estequiometria">Estequiometria</option>
              <option value="combustao">Combustão</option>
              <option value="limitante">Reagente Limitante</option>
            </select>
          </div>

          {/* Quantidade */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Quantidade de exercícios
            </label>

            <input
              type="number"
              min="1"
              max="50"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 
                         text-sm md:text-base"
            />
            <p className="text-xs text-slate-400 mt-1">
              Recomendações: 5–10 exercícios por lista.
            </p>
          </div>

          {/* Nível */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Nível de dificuldade
            </label>

            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value as Nivel)}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 
                         text-sm md:text-base"
            >
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          {/* BOTÕES PRINCIPAIS */}
          <div className="flex flex-col md:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGerar}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold 
                         shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition text-sm md:text-base"
            >
              Gerar Exercícios
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={exercicios.length === 0}
              onClick={() =>
                exercicios.length &&
                gerarPdfLista(exercicios, `${tituloBase} - ${tipo}`)
              }
              className={`w-full md:w-auto px-6 py-3 rounded-xl border text-sm md:text-base ${
                exercicios.length === 0
                  ? "border-slate-700 text-slate-500 cursor-not-allowed"
                  : "border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
              }`}
            >
              Baixar PDF (lista)
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={exercicios.length === 0}
              onClick={() =>
                exercicios.length &&
                gerarPdfGabarito(exercicios, `${tituloBase} - ${tipo}`)
              }
              className={`w-full md:w-auto px-6 py-3 rounded-xl border text-sm md:text-base ${
                exercicios.length === 0
                  ? "border-slate-700 text-slate-500 cursor-not-allowed"
                  : "border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
              }`}
            >
              Baixar PDF (gabarito)
            </motion.button>
          </div>
        </motion.div>

        {/* LISTA DE EXERCÍCIOS GERADOS */}
        {exercicios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-cyan-400">
                Exercícios gerados
              </h2>

              <button
                onClick={() => setMostrarGabarito((v) => !v)}
                className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-cyan-500/60 
                           text-cyan-300 hover:bg-cyan-500/10 transition self-start"
              >
                {mostrarGabarito ? "Ocultar gabarito" : "Mostrar gabarito"}
              </button>
            </div>

            <div className="space-y-4">
              {exercicios.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm md:text-base"
                >
                  <p className="font-semibold text-slate-100 mb-1">
                    Exercício {idx + 1}
                  </p>
                  <pre className="whitespace-pre-wrap text-slate-200 text-sm md:text-base">
                    {ex.enunciado}
                  </pre>

                  {mostrarGabarito && (
                    <div className="mt-2 border-t border-slate-800 pt-2">
                      <p className="text-xs uppercase tracking-wide text-cyan-400 mb-1">
                        Gabarito
                      </p>
                      <pre className="whitespace-pre-wrap text-slate-300 text-sm md:text-base">
                        {ex.resposta}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Rodapé */}
        <p className="text-xs text-slate-500 text-center">
          *Os PDFs são gerados automaticamente para impressão ou
          compartilhamento com os alunos.
        </p>
      </div>
    </main>
  );
}
