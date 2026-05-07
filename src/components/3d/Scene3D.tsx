import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Sky } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Fog } from 'three';
import { Lights } from './Lights';
import { SudokuBoard3D } from './SudokuBoard3D';
import { Particles } from './Particles';
import { useGameStore } from '../../store/gameStore';

/** Sets WebGL clear color + scene fog based on theme */
const ThemeBackground = ({ isDark }: { isDark: boolean }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    if (isDark) {
      gl.setClearColor('#050818', 1);
      scene.fog = null;
    } else {
      gl.setClearColor('#caf0f8', 1);
      scene.fog = new Fog('#caf0f8', 20, 45);
    }
    return () => { scene.fog = null; };
  }, [isDark, gl, scene]);

  return null;
};

/** Bright warm lighting for light/cloudy-day mode */
const LightModeLights = () => (
  <>
    <ambientLight intensity={1.4} color="#e0f7fa" />
    <directionalLight position={[8, 12, 6]} intensity={2.2} color="#fffde7" castShadow />
    <pointLight position={[0, 6, 4]} intensity={1.2} color="#00bcd4" distance={20} decay={2} />
    <pointLight position={[-6, -4, 3]} intensity={0.6} color="#ffffff" distance={15} decay={2} />
  </>
);

export const Scene3D = () => {
  const gameWon = useGameStore(s => s.gameWon);
  const theme   = useGameStore(s => s.theme);
  const isDark  = theme === 'dark';

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 55 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      shadows
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>

        {/* ── Background ── */}
        {isDark ? (
          <Stars radius={80} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />
        ) : (
          <>
            <Sky
              distance={450}
              sunPosition={[5, 1, 8]}
              inclination={0.49}
              azimuth={0.25}
              rayleigh={0.4}
              turbidity={6}
              mieCoefficient={0.005}
              mieDirectionalG={0.8}
            />
            <Cloud position={[-6, 5, -8]}  seed={1} speed={0.1} opacity={0.55} color="#e0f7fa" segments={10} />
            <Cloud position={[7,  4, -10]} seed={2} speed={0.08} opacity={0.45} color="#b2ebf2" segments={8}  />
            <Cloud position={[0,  7, -12]} seed={3} speed={0.06} opacity={0.4}  color="#ffffff"  segments={12} />
          </>
        )}

        {/* ── WebGL clear color + fog ── */}
        <ThemeBackground isDark={isDark} />

        {/* ── Lighting ── */}
        {isDark ? <Lights /> : <LightModeLights />}

        {/* ── Game Objects ── */}
        <SudokuBoard3D />
        <Particles active={gameWon} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!gameWon}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3.5}
          maxAzimuthAngle={Math.PI / 5}
          minAzimuthAngle={-Math.PI / 5}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={isDark ? 0.4 : 0.85}
            luminanceSmoothing={0.9}
            intensity={isDark ? 1.2 : 0.35}
          />
        </EffectComposer>

      </Suspense>
    </Canvas>
  );
};
