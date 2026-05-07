import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lights = () => {
  const purpleRef = useRef<THREE.PointLight>(null);
  const cyanRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (purpleRef.current) {
      purpleRef.current.position.x = Math.sin(t * 0.4) * 6;
      purpleRef.current.position.y = Math.cos(t * 0.3) * 4 + 2;
    }
    if (cyanRef.current) {
      cyanRef.current.position.x = Math.cos(t * 0.35) * 6;
      cyanRef.current.position.y = Math.sin(t * 0.5) * 4 - 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#1a1040" />
      <directionalLight position={[5, 10, 8]} intensity={0.6} color="#e0d0ff" />
      <pointLight ref={purpleRef} position={[4, 3, 4]} intensity={3} color="#8b5cf6" distance={20} decay={2} />
      <pointLight ref={cyanRef} position={[-4, -2, 4]} intensity={3} color="#00f5ff" distance={20} decay={2} />
      <pointLight position={[0, -6, 2]} intensity={1} color="#f59e0b" distance={12} decay={2} />
    </>
  );
};
