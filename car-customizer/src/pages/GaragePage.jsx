// src/pages/GaragePage.jsx
import { useState } from 'react'
import CarViewer from '../components/CarViewer'

export default function GaragePage() {
  const [carColor, setCarColor] = useState('#ff0000') // Default red

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* 3D Viewer */}
      <div style={{ flex: 1 }}>
        <CarViewer carColor={carColor} />
      </div>

      {/* Customize Panel */}
      <div
        style={{
          width: '300px',
          background: '#1a1a1a',
          color: '#fff',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        <h2>Customize</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="colorPicker">Paint Color:</label>
          <input
            id="colorPicker"
            type="color"
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        {/* Add more controls here later */}
      </div>
    </div>
  )
}
