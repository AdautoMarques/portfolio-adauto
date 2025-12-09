"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

// ===================== Símbolo Flutuante =====================
function FloatingSymbol({
  symbol,
  position,
  speed,
  color = "#0ff", // padrão ciano neon
}: {
  symbol: string;
  position: [number, number, number];
  speed: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t) * 0.5;
      ref.current.position.x = position[0] + Math.cos(t * 0.5) * 0.5;
      ref.current.rotation.y = t * 0.5;
      ref.current.rotation.x = t * 0.3;
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.3}
      color={color}
      anchorX="center"
      anchorY="middle"
      depthOffset={1}
    >
      {symbol}
    </Text>
  );
}

// ===================== Partículas de Fundo =====================
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = new Float32Array(500 * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  const colors = new Float32Array(500 * 3);
  for (let i = 0; i < 500; i++) {
    const c = new THREE.Color();
    c.setHSL(0.5 + Math.random() * 0.2, 1, 0.5); // tons de ciano/azul
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.03} transparent opacity={0.7} />
    </points>
  );
}

// ===================== Cena Completa =====================
export default function ScientificSymbolsBackground() {
  const symbols = [
    "π",
    "Σ",
    "∫",
    "√",
    "±",
    "H₂O",
    "CO₂",
    "Na⁺",
    "Cl⁻",
    "CH₄",
    "Mg²⁺",
  ];

  const symbolColors = ["#0ff", "#3b82f6", "#8b5cf6"]; // ciano, azul, roxo

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#0ff" />
        <pointLight position={[-10, 5, -5]} intensity={0.8} color="#8b5cf6" />

        {/* Símbolos flutuantes */}
        {symbols.map((sym, i) => (
          <FloatingSymbol
            key={i}
            symbol={sym}
            position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 3,
            ]}
            speed={0.5 + Math.random() * 0.5}
            color={symbolColors[i % symbolColors.length]}
          />
        ))}

        {/* Partículas de fundo */}
        <Particles />
      </Canvas>
    </div>
  );
}
