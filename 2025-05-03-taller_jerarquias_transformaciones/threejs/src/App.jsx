import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from './Scene'

export default function App() {
  return (
    // Lienzo 3D principal con cámara y luces
    <Canvas camera={{ position: [7, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.4} /> {/* Luz ambiental suave */}
      <directionalLight position={[5, 10, 5]} intensity={1.2} /> {/* Luz direccional */}
      <axesHelper args={[5]} /> {/* Ejes de referencia */}
      <OrbitControls /> {/* Control de órbita con el mouse */}
      <Scene /> {/* Escena con jerarquía */}
    </Canvas>
  )
}
