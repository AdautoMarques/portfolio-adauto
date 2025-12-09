"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Electron({
  radius = 0.4,
  speed = 1,
  color = "#3b82f6",
}: {
  radius?: number;
  speed?: number;
  color?: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    if (mesh.current) {
      angleRef.current += 0.02 * speed;
      const x = Math.cos(angleRef.current) * radius;
      const z = Math.sin(angleRef.current) * radius;
      mesh.current.position.set(x, 0, z);
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

function Atom({ position }: { position: [number, number, number] }) {
  const nucleus = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      {/* Núcleo */}
      <mesh ref={nucleus}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Órbitas */}
      {[...Array(3)].map((_, i) => (
        <mesh
          key={`orbit-${i}`}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <torusGeometry args={[0.4 + i * 0.1, 0.005, 8, 64]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Elétrons orbitando */}
      {[...Array(3)].map((_, i) => (
        <Electron
          key={`electron-${i}`}
          radius={0.4 + i * 0.1}
          speed={0.5 + i * 0.3}
          color={["#3b82f6", "#60a5fa", "#93c5fd"][i]}
        />
      ))}
    </group>
  );
}

export default function AtomsBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />

        {[...Array(8)].map((_, i) => (
          <Atom
            key={i}
            position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 3,
            ]}
          />
        ))}

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
