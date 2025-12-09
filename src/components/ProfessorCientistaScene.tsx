"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

// ===================== DNA Helix =====================
function DNAHelix() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.3;
  });

  const points: React.ReactNode[] = [];
  const turns = 12;
  const radius = 0.5;
  const height = 6;
  const segments = 100;

  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * turns * Math.PI * 2;
    const y = (i / segments) * height - height / 2;

    const x1 = Math.sin(t) * radius;
    const z1 = Math.cos(t) * radius;

    const x2 = Math.sin(t + Math.PI) * radius;
    const z2 = Math.cos(t + Math.PI) * radius;

    points.push(
      <Sphere key={`a${i}`} args={[0.05, 16, 16]} position={[x1, y, z1]}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.6}
        />
      </Sphere>
    );
    points.push(
      <Sphere key={`b${i}`} args={[0.05, 16, 16]} position={[x2, y, z2]}>
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.6}
        />
      </Sphere>
    );
  }

  return <group ref={group}>{points}</group>;
}

// ===================== Solar System =====================
function SolarSystem() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={group} scale={0.6} position={[2, 0, -1]}>
      {/* “Sol” */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial emissive="#ffcc00" emissiveIntensity={1.5} />
      </Sphere>

      {/* Planetas orbitando */}
      {Array.from({ length: 5 }).map((_, i) => {
        const r = 0.7 + i * 0.4;
        const speed = 0.5 + i * 0.2;
        return (
          <Planet
            key={i}
            radius={r}
            speed={speed}
            color={new THREE.Color(`hsl(${i * 60}, 100%, 60%)`)}
          />
        );
      })}
    </group>
  );
}

function Planet({
  radius,
  speed,
  color,
}: {
  radius: number;
  speed: number;
  color: THREE.Color;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <Sphere ref={ref} args={[0.08, 16, 16]}>
      <meshStandardMaterial emissive={color} emissiveIntensity={0.9} />
    </Sphere>
  );
}

// ===================== Energy Particles =====================
function EnergyParticles() {
  const ref = useRef<THREE.Points>(null!);

  // gera posições aleatórias
  const positions = React.useMemo(() => {
    const arr = new Float32Array(1000 * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]} // <- forma correta para THREE.BufferAttribute
        />
      </bufferGeometry>

      <pointsMaterial size={0.04} color="#00ffff" transparent opacity={0.6} />
    </points>
  );
}

// ===================== Professor Cientista Scene =====================
export default function ProfessorCientistaScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        <DNAHelix />
        <SolarSystem />
        <EnergyParticles />
      </Canvas>
    </div>
  );
}
