import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Cell3DProps {
  position: [number, number, number];
  value: number | null;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  isInitial: boolean;
  isWon: boolean;
  onClick: () => void;
}

export const Cell3D = ({
  position, value, isSelected, isHighlighted,
  isError, isInitial, isWon, onClick,
}: Cell3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isSelected) targetScale.current = 1.12;
    else if (isWon) targetScale.current = 1.05;
    else targetScale.current = 1;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, delta * 8);
    meshRef.current.scale.setScalar(currentScale.current);
  });

  const getColor = () => {
    if (isError) return '#3d0a0a';
    if (isSelected) return '#1a0a3d';
    if (isHighlighted) return '#0d1a2e';
    if (isWon) return '#0a2d1a';
    return '#0a0a1a';
  };

  const getEmissive = () => {
    if (isError) return '#ff2020';
    if (isSelected) return '#8b5cf6';
    if (isHighlighted) return '#00f5ff';
    if (isWon) return '#22c55e';
    return '#1a1a3a';
  };

  const getTextColor = () => {
    if (isError) return '#ff6b6b';
    if (isInitial) return '#e0e0ff';
    return '#00f5ff';
  };

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[0.88, 0.88, 0.18]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getEmissive()}
          emissiveIntensity={isSelected ? 0.6 : isHighlighted ? 0.3 : 0.15}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {value !== null && (
        <Text
          position={[0, 0, 0.12]}
          fontSize={0.38}
          color={getTextColor()}
          font={undefined}
          anchorX="center"
          anchorY="middle"
        >
          {value.toString()}
        </Text>
      )}
    </group>
  );
};
