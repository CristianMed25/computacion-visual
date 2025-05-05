import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function CuboAnimado() {
  const meshRef = useRef()  // Referencia al cubo para manipularlo directamente

  // useFrame se ejecuta en cada frame de animacion
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()  // Tiempo transcurrido desde que se inicio la escena

    // Movimiento senoidal en X y Z
    meshRef.current.position.x = Math.sin(t) * 2
    meshRef.current.position.z = Math.cos(t) * 2

    // Rotacion continua sobre los ejes X e Y
    meshRef.current.rotation.y += 0.02
    meshRef.current.rotation.x += 0.01

    // Escalado dinamico basado en el tiempo
    const scale = 1 + 0.3 * Math.sin(t * 2)
    meshRef.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh ref={meshRef}> {/* Malla que contiene geometria y material */}
      <boxGeometry args={[1, 1, 1]} />  {/* Cubo de 1x1x1 */}
      <meshStandardMaterial color="tomato" />  
    </mesh>
  )
}

export default CuboAnimado
