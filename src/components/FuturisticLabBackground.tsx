"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

// ===================== Bolhas =====================
function Bubble({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y += delta * 0.5;
      if (ref.current.position.y > 2) ref.current.position.y = -2;
      ref.current.rotation.x += delta * 0.5;
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Sphere ref={ref} args={[0.05, 16, 16]} position={position}>
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.6}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

// ===================== Tubos de Ensaio =====================
function TestTube({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tubo */}
      <Cylinder args={[0.1, 0.1, 1.5, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#4444ff"
          emissive="#4444ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </Cylinder>
      {/* Líquido */}
      <Cylinder args={[0.09, 0.09, 0.8, 32]} position={[0, -0.35, 0]}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </Cylinder>
      {/* Bolhas */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Bubble
          key={i}
          position={[
            (Math.random() - 0.5) * 0.08,
            -0.4 + Math.random() * 0.8,
            (Math.random() - 0.5) * 0.08,
          ]}
        />
      ))}
    </group>
  );
}

// ===================== Partículas Futuristas =====================
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = new Float32Array(500 * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  useFrame((state, delta) => {
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
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00ffff" transparent opacity={0.6} />
    </points>
  );
}

// ===================== Cena Completa =====================
export default function FuturisticLabBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00ffff" />
        <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ff00ff" />
        {/* Tubos de ensaio */}
        {Array.from({ length: 6 }).map((_, i) => (
          <TestTube
            key={i}
            position={[(i - 3) * 1, -0.5, (Math.random() - 0.5) * 2]}
          />
        ))}
        {/* Partículas flutuantes */}
        <Particles />
      </Canvas>
    </div>
  );
}
