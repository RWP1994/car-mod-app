import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Bounds, useAnimations } from '@react-three/drei'
import { useState, useEffect } from 'react'
import './CarViewer.css'

import { applyCarMaterials } from '../utils/applyCarMaterials'
import { proOverrides } from '../utils/proOverrides'

function CarModel({ modelPath, proMaterialOverrides, setAnimationActions }) {
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    applyCarMaterials(scene, { proMaterialOverrides })
  }, [scene, proMaterialOverrides, actions, animations, setAnimationActions])

  return <primitive object={scene} scale={1} position={[0, -1.2, 0]} />
}




export default function CarViewer() {
  const [selectedCar, setSelectedCar] = useState('/assets/cars/MK4_supra.glb')
  const [paintColor, setPaintColor] = useState('#ff0000')
  const [rimColor, setRimColor] = useState('#ffffff')
  const [wideBodyColor, setWideBodyColor] = useState('#333333')
  const [paintFinish, setPaintFinish] = useState('glossy')
  const [proMode, setProMode] = useState(false)
  const [proMaterialOverrides, setProMaterialOverrides] = useState(proOverrides)
  const [animationActions, setAnimationActions] = useState({})
  const [currentAnimation, setCurrentAnimation] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lastBuildSettings'))
    if (saved) {
      setSelectedCar(saved.selectedCar || selectedCar)
      setPaintColor(saved.paintColor || paintColor)
      setRimColor(saved.rimColor || rimColor)
      setWideBodyColor(saved.wideBodyColor || wideBodyColor)
      setPaintFinish(saved.paintFinish || paintFinish)
      setProMaterialOverrides(saved.proMaterialOverrides || proOverrides)
  
      // 🧠 Reset grouped overrides to match saved paint values
      setGroupedSimpleOverrides(prev => ({
        ...prev,
        Paint: {
          ...prev.Paint,
          color: saved.paintColor || prev.Paint.color,
          finish: saved.paintFinish || prev.Paint.finish,
        },
        Rims: {
          ...prev.Rims,
          color: saved.rimColor || prev.Rims.color,
          finish: saved.rimFinish || prev.Rims.finish,
        },
        WideBody: {
          ...prev.WideBody,
          color: saved.wideBodyColor || prev.WideBody.color,
          finish: saved.wideBodyFinish || prev.WideBody.finish,
        },
        SpoilerAndSplitter: {
          ...prev.SpoilerAndSplitter,
          color: saved.spoilerAndSplitterColor || prev.SpoilerAndSplitter.color,
          finish: saved.spoilerAndSplitterFinish || prev.SpoilerAndSplitter.finish,
        },
        Trim: {
          ...prev.Trim,
          color: saved.trimColor || prev.Trim.color,
          finish: saved.trimFinish || prev.Trim.finish,
        },
        Glass: {
          ...prev.Glass,
          color: saved.glassColor || prev.Glass.color,
          finish: saved.glassFinish || prev.Glass.finish,
        }
      }))
      
    }
  }, [])
      
  
  const handleSaveBuild = () => {
    const build = {
      id: Date.now(),
      name: 'Custom Build',
      user: 'Guest',
      vehicle: selectedCar.split('/').pop().replace('.glb', '').replaceAll('_', ' '),
      modelPath: selectedCar,
      paintColor,
      rimColor,
      wideBodyColor,
      spoilerColor: proMaterialOverrides?.spoiler || '#333333',
      trimColor: proMaterialOverrides?.trim || '#333333',
      glassColor: proMaterialOverrides?.glass || '#333333',
      finish: paintFinish,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      image: '/assets/default_car.jpg',
    }
  
    const existing = JSON.parse(localStorage.getItem('communityBuilds')) || []
    localStorage.setItem('lastBuildSettings', JSON.stringify({
      selectedCar,
      paintColor: groupedSimpleOverrides.Paint.color,
      paintFinish: groupedSimpleOverrides.Paint.finish,
      rimColor: groupedSimpleOverrides.Rims.color,
      rimFinish: groupedSimpleOverrides.Rims.finish,
      wideBodyColor: groupedSimpleOverrides.WideBody.color,
      wideBodyFinish: groupedSimpleOverrides.WideBody.finish,
      spoilerAndSplitterColor: groupedSimpleOverrides.SpoilerAndSplitter.color,
      spoilerAndSplitterFinish: groupedSimpleOverrides.SpoilerAndSplitter.finish,
      trimColor: groupedSimpleOverrides.Trim.color,
      trimFinish: groupedSimpleOverrides.Trim.finish,
      glassColor: groupedSimpleOverrides.Glass.color,
      glassFinish: groupedSimpleOverrides.Glass.finish,
      proMaterialOverrides
    }))
    
    
    alert('Build saved to Showcase!')
  }
  
  

  const [groupedSimpleOverrides, setGroupedSimpleOverrides] = useState({
    Paint: {
      color: '#ff0000',
      finish: 'glossy',
      parts: Object.keys(proOverrides).filter(name => name.startsWith('paint_') || name.startsWith('paint_body') || name.startsWith('mirrors'))
    },
    Rims: {
      color: '#ffffff',
      finish: 'glossy',
      parts: Object.keys(proOverrides).filter(name => name.startsWith('rim_') || name.startsWith('wheel_'))
    },
    WideBody: {
      color: '#333333',
      finish: 'matte',
      parts: Object.keys(proOverrides).filter(name => name.startsWith('wide_body_') || name.includes('fender'))
    },
    SpoilerAndSplitter: {
      color: '#333333',
      finish: 'matte',
      parts: Object.keys(proOverrides).filter(name => name.startsWith('spoiler_') || name.includes('splitter_'))
    },
    Trim: {
      color: '#333333',
      finish: 'matte',
      parts: Object.keys(proOverrides).filter(name => name.startsWith('trim_') || name.includes('seal_'))
    },
    Glass: {
      color: '#333333',
      finish: 'matte',
      parts: Object.keys(proOverrides).filter(name => name.startsWith('glass_'))
    },
  })

  // Sync groupedSimpleOverrides with proMaterialOverrides when NOT in proMode
  useEffect(() => {
    if (!proMode) {
      const updatedOverrides = { ...proMaterialOverrides }
      Object.values(groupedSimpleOverrides).forEach(({ color, finish, parts }) => {
        parts.forEach(part => {
          updatedOverrides[part] = {
            ...(updatedOverrides[part] || {}),
            color,
            finish,
          }
        })
      })
      setProMaterialOverrides(updatedOverrides)
    }
  }, [groupedSimpleOverrides, proMode])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div style={{ flex: 1, backgroundImage: 'url(/assets/backgrounds/warehouse.jpg)', backgroundSize: 'cover' }}>
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }} style={{ height: '100%', width: '100%' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="warehouse" />
          <Bounds fit clip observe={false} margin={1.2}>
          <CarModel
  modelPath={selectedCar}
  proMaterialOverrides={proMaterialOverrides}
/>
          </Bounds>
          <OrbitControls enablePan={false} minPolarAngle={Math.PI / 8} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
      </div>

      {/* Customizer Panel */}
      <div style={{ width: '320px', backgroundColor: '#1a1a1a', color: '#fff', padding: '1rem' }}>
        <h2>Customize</h2>
        <button
  style={{
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  }}
  onClick={handleSaveBuild}
>
  Save Build to Showcase
</button>


        {/* Toggle Pro Mode */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={proMode}
              onChange={(e) => setProMode(e.target.checked)}
            />
            {' '}Pro Mode
          </label>
        </div>

        {/* Car Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="carSelect">Select Car:</label>
          <select
            id="carSelect"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            style={{ width: '100%', marginTop: '0.25rem' }}
          >
            <option value="/assets/cars/porsche.glb">1975 Porsche 911</option>
            <option value="/assets/cars/MK4_supra.glb">MK4 Toyota Supra</option>
            <option value="/assets/cars/dodge_demon.glb">2018 Dodge Demon</option>
            <option value="/assets/cars/pagani.glb">Pagani </option>
          </select>
        </div>

        {/* Simple Mode UI */}
        {!proMode && (
          <>
            {Object.entries(groupedSimpleOverrides).map(([groupName, settings]) => (
              <div key={groupName} style={{ marginBottom: '1rem' }}>
                <label>{groupName} Color:</label>
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => {
                    const newColor = e.target.value
                    setGroupedSimpleOverrides(prev => ({
                      ...prev,
                      [groupName]: {
                        ...prev[groupName],
                        color: newColor
                      }
                    }))
                  }}
                />
                <select
                  value={settings.finish}
                  onChange={(e) => {
                    const newFinish = e.target.value
                    setGroupedSimpleOverrides(prev => ({
                      ...prev,
                      [groupName]: {
                        ...prev[groupName],
                        finish: newFinish
                      }
                    }))
                  }}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <option value="glossy">Glossy</option>
                  <option value="matte">Matte</option>
                  <option value="chrome">Chrome</option>
                </select>
              </div>
            ))}
          </>
        )}

        {/* Pro Mode UI */}
        {proMode &&
          Object.entries(proMaterialOverrides).map(([name, settings]) => (
            <div key={name} style={{ marginBottom: '0.5rem' }}>
              <label>{name.replaceAll('_', ' ')}:</label>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => {
                  setProMaterialOverrides((prev) => ({
                    ...prev,
                    [name]: {
                      ...prev[name],
                      color: e.target.value,
                    },
                  }))
                }}
              />
              <select
                value={settings.finish}
                onChange={(e) => {
                  setProMaterialOverrides((prev) => ({
                    ...prev,
                    [name]: {
                      ...prev[name],
                      finish: e.target.value,
                    },
                  }))
                }}
                style={{ marginLeft: '0.5rem' }}
              >
                <option value="glossy">Glossy</option>
                <option value="matte">Matte</option>
                <option value="chrome">Chrome</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  )
}
