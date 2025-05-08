import './App.css'
import { Canvas } from '@react-three/fiber'
import Scene from './scene'

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Scene />
      </Canvas>
    </div>
  )
}

export default App
