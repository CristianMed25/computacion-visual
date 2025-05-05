import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Importaciones de React Three Fiber y Drei
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CuboAnimado from './CuboAnimado'  

function App() {
  const [count, setCount] = useState(0)  

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Escena 3D con Three.js */}
      <div style={{ height: '500px', width: '100%' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          {/* Luces */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {/* Cubo animado */}
          <CuboAnimado />

          {/* Ejes y grilla como referencia visual */}
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />

          {/* Control para mover la camara con el mouse */}
          <OrbitControls />
        </Canvas>
      </div>
    </>
  )
}

export default App

