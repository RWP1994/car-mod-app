import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import './garageGallery.css';


// 🔧 Mini car preview (reusable)
function MiniCarModel({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} scale={.9} position={[0, -1, 0]} />
}

// 🔧 Individual build card layout (Polaroid-style)
function PolaroidCard({ build }) {
  return (
    <div
      key={build.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: '#f9f9f9',
        color: '#000',
        width: '100%',
        maxWidth: '700px',
        boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      {/* Left column - user info */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <img
          src={build.image}
          alt={build.name}
          style={{
            width: '100%',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            objectFit: 'cover',
            height: '180px',
          }}
        />
        <h4 style={{ margin: '0.5rem 0' }}>User: {build.user}</h4>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Vehicle:</strong> {build.vehicle}
        </p>
        <p style={{ margin: '0.25rem 0' }}>⭐ {build.rating}</p>

        {/* Swatches */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            title="Paint Color"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: build.paintColor,
              border: '1px solid #999',
            }}
          />
          <div
            title="Rim Color"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: build.rimColor,
              border: '1px solid #999',
            }}
          />
          <div
            title="Finish"
            style={{
              fontSize: '0.75rem',
              background: '#eee',
              color: '#000',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              lineHeight: '20px',
            }}
          >
            {build.finish}
          </div>
        </div>
      </div>

      {/* Right column - 3D render */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h3 style={{ marginBottom: '0.1rem' }}>{build.name}</h3>
        <div style={{ height: '250px', width: '100%' }}>
          <Canvas camera={{ position: [2, 0, 5], fov: 40 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <MiniCarModel modelPath={build.modelPath} />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

// 🔧 Mock data
const mockBuilds = [
  {
    id: 1,
    name: 'Midnight Racer',
    user: 'exlpython',
    vehicle: 'MK4 Supra',
    rating: 4.5,
    image: '/assets/zx14.jpg',
    paintColor: '#1a1a1a',
    rimColor: '#cccccc',
    finish: 'matte',
    modelPath: '/assets/cars/MK4_supra.glb',
  },
  {
    id: 2,
    name: 'Trapp B Killing',
    user: 'Trapp',
    vehicle: 'Dodge Demon',
    rating: 3.8,
    image: '/assets/red_hellcat.jpg',
    paintColor: '#9e1b1b',
    rimColor: '#2e2e2e',
    finish: 'chrome',
    modelPath: '/assets/cars/dodge_demon.glb',
  },
]

export default function GarageGallery() {
  const [builds] = useState(mockBuilds)

  return (
    <div className="garage-gallery">
  {builds.map((build) => (
    <PolaroidCard key={build.id} build={build} />
  ))}
</div>

  )
}

