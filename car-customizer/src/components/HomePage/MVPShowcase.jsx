import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

function RotatingCar({ modelPath }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <primitive
      object={scene}
      ref={group}
      scale={1.2}
      castShadow
      receiveShadow
    />
  );
}

function CarCanvas({ modelPath }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.4, 5], fov: 70 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      <Suspense fallback={null}>
        <RotatingCar modelPath={modelPath} />
        <Environment preset="warehouse" />
      </Suspense>

      {/* Shadow-receiving floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={1} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={true}
        autoRotateSpeed={-6}
      />
    </Canvas>
  );
}

export default function MVPShowcase() {
  return (
    <section style={{ width: '100%', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>🏆 Top 2 MVP Builds</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', height: '600px' }}>
        <div style={{ flex: 1, marginRight: '1rem' }}>
          <CarCanvas modelPath="/assets/cars/MK4_supra.glb" />
          <div style={{ marginTop: '0.5rem' }}>
            <button style={{ marginRight: '1rem' }}>View Supra</button>
            <button>Load Supra</button>
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: '1rem' }}>
          <CarCanvas modelPath="/assets/cars/dodge_demon.glb" />
          <div style={{ marginTop: '0.5rem' }}>
            <button style={{ marginRight: '1rem' }}>View Demon</button>
            <button>Load Demon</button>
          </div>
        </div>
      </div>
    </section>
  );
}
