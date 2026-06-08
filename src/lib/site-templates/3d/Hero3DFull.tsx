"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Scene({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.3; });
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={ref} args={[1.2, 64, 64]} scale={1.5}>
          <MeshDistortMaterial color={primaryColor} attach="material" distort={0.4} speed={2} roughness={0.2} metalness={0.8} emissive={secondaryColor} emissiveIntensity={0.2} />
        </Sphere>
      </Float>
    </>
  );
}

export function Hero3DFull({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  return (
    <div className="h-[420px] w-full rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Canvas>
    </div>
  );
}
