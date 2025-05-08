// scene.jsx
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva' // Panel interactivo

function Scene() {
  // Controles para ajustar parámetros desde UI
  const { count, globalScale, rotateAll, rotationSpeed } = useControls({
    count: { value: 10, min: 1, max: 30, step: 1 }, // Cantidad de objetos
    globalScale: { value: 1, min: 0.1, max: 3, step: 0.1 }, // Escala global
    rotateAll: true, // Activar rotación grupal
    rotationSpeed: { value: 0.01, min: 0, max: 0.1, step: 0.005 }, // Velocidad de rotación
  })

  const groupRef = useRef() // Referencia al grupo de objetos

  // Rotar grupo completo en cada frame si está activado
  useFrame(() => {
    if (rotateAll && groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed
    }
  })

  // Color aleatorio en formato hex
  function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  // Posición aleatoria dentro de un rango
  function randomPosition() {
    return [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 10,
    ]
  }

  const types = ['box', 'sphere', 'cone', 'cylinder'] // Tipos de geometrías

  // Generar lista de objetos solo cuando cambia `count`
  const objects = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      type: types[i % types.length], // Alterna entre los tipos
      position: randomPosition(),
      color: randomColor()
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return (
    <group ref={groupRef}>
      {/* Crear cada malla 3D con geometría y color */}
      {objects.map(obj => (
        <mesh
          key={obj.id}
          position={obj.position}
          scale={[globalScale, globalScale, globalScale]}
        >
          {/* Selección de geometría según tipo */}
          {obj.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {obj.type === 'sphere' && <sphereGeometry args={[0.75, 32, 32]} />}
          {obj.type === 'cone' && <coneGeometry args={[0.7, 1.5, 32]} />}
          {obj.type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />}
          <meshStandardMaterial color={obj.color} /> {/* Material con color aleatorio */}
        </mesh>
      ))}
    </group>
  )
}

export default Scene
