import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  active: boolean;
}

export const Particles = ({ active }: ParticlesProps) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 150;

  const { positions, velocities, colors } = useMemo(() => {
    const positions = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5,
    }));
    const velocities = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.12,
      y: Math.random() * 0.15 + 0.05,
      z: (Math.random() - 0.5) * 0.12,
    }));
    const palette = ['#00f5ff', '#8b5cf6', '#fbbf24', '#f472b6', '#34d399'];
    const colors = Array.from({ length: count }, () =>
      new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
    );
    return { positions, velocities, colors };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!mesh.current || !active) return;
    elapsed.current += delta;
    const t = elapsed.current;

    for (let i = 0; i < count; i++) {
      const decay = Math.max(0, 1 - t * 0.4);
      dummy.position.set(
        positions[i].x + velocities[i].x * t * 8,
        positions[i].y + velocities[i].y * t * 8 - 0.5 * t * t,
        positions[i].z + velocities[i].z * t * 8
      );
      const scale = decay * (0.06 + Math.random() * 0.03);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, colors[i].multiplyScalar(decay));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
};
