import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { Cell3D } from './Cell3D';
import { useGameStore } from '../../store/gameStore';

export const SudokuBoard3D = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { grid, initialGrid, selectedCell, errors, gameWon, selectCell } = useGameStore();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (gameWon) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  if (!grid.length) return null;

  const CELL_SIZE = 0.96;
  const GAP = 0.04;
  const BOX_GAP = 0.14;

  const getCellX = (col: number) => {
    const box = Math.floor(col / 3);
    return (col * (CELL_SIZE + GAP)) + box * BOX_GAP - 4.2;
  };
  const getCellY = (row: number) => {
    const box = Math.floor(row / 3);
    return -((row * (CELL_SIZE + GAP)) + box * BOX_GAP - 4.2);
  };

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Board base plate */}
        <mesh position={[0, 0, -0.15]} receiveShadow>
          <boxGeometry args={[9.8, 9.8, 0.12]} />
          <meshStandardMaterial
            color="#050818"
            emissive="#0a0a2a"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Neon border */}
        {[[-4.95, 0, -0.08], [4.95, 0, -0.08]].map(([x, y, z], i) => (
          <mesh key={`vb-${i}`} position={[x, y, z] as [number, number, number]}>
            <boxGeometry args={[0.06, 10.1, 0.08]} />
            <meshStandardMaterial emissive="#00f5ff" emissiveIntensity={2} color="#00f5ff" />
          </mesh>
        ))}
        {[[0, -4.95, -0.08], [0, 4.95, -0.08]].map(([x, y, z], i) => (
          <mesh key={`hb-${i}`} position={[x, y, z] as [number, number, number]}>
            <boxGeometry args={[10.1, 0.06, 0.08]} />
            <meshStandardMaterial emissive="#00f5ff" emissiveIntensity={2} color="#00f5ff" />
          </mesh>
        ))}

        {/* 3x3 box separators */}
        {[-3.12, 0, 3.12].map((x, i) => (
          <mesh key={`vs-${i}`} position={[x, 0, -0.09]}>
            <boxGeometry args={[0.05, 9.6, 0.06]} />
            <meshStandardMaterial emissive="#8b5cf6" emissiveIntensity={1.5} color="#8b5cf6" />
          </mesh>
        ))}
        {[3.12, 0, -3.12].map((y, i) => (
          <mesh key={`hs-${i}`} position={[0, y, -0.09]}>
            <boxGeometry args={[9.6, 0.05, 0.06]} />
            <meshStandardMaterial emissive="#8b5cf6" emissiveIntensity={1.5} color="#8b5cf6" />
          </mesh>
        ))}

        {/* Cells */}
        {grid.map((row, rIdx) =>
          row.map((val, cIdx) => (
            <Cell3D
              key={`${rIdx}-${cIdx}`}
              position={[getCellX(cIdx), getCellY(rIdx), 0]}
              value={val}
              isSelected={selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx}
              isHighlighted={
                selectedCell
                  ? selectedCell[0] === rIdx || selectedCell[1] === cIdx ||
                    (Math.floor(selectedCell[0] / 3) === Math.floor(rIdx / 3) &&
                     Math.floor(selectedCell[1] / 3) === Math.floor(cIdx / 3))
                  : false
              }
              isError={errors[rIdx]?.[cIdx] ?? false}
              isInitial={initialGrid[rIdx]?.[cIdx] !== null}
              isWon={gameWon}
              onClick={() => selectCell(rIdx, cIdx)}
            />
          ))
        )}
      </group>
    </Float>
  );
};
