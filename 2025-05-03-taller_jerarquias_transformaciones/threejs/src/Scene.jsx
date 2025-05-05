import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

export default function Scene() {
  // Refs para acceder a cada nivel de jerarquía
  const parentRef = useRef()
  const childRef = useRef()
  const grandChildRef = useRef()
  const greatGrandChildRef = useRef()

  // Controles para el grupo padre
  const parent = useControls('Padre', {
    posY: { value: 0, min: -5, max: 5, step: 0.1 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 }
  })

  // Controles para el hijo
  const child = useControls('Hijo', {
    posX: { value: 2, min: 0, max: 5, step: 0.1 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 }
  })

  // Controles para el nieto
  const grandchild = useControls('Nieto', {
    posY: { value: 1.5, min: 0, max: 3, step: 0.1 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 }
  })

  // Controles para el biznieto
  const greatGrandchild = useControls('Biznieto', {
    posZ: { value: 1.2, min: 0, max: 3, step: 0.1 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 }
  })

  // Aplicar transformaciones en cada frame
  useFrame(() => {
    if (parentRef.current) {
      parentRef.current.position.y = parent.posY
      parentRef.current.rotation.z = parent.rotZ
    }
    if (childRef.current) {
      childRef.current.position.x = child.posX
      childRef.current.rotation.x = child.rotX
    }
    if (grandChildRef.current) {
      grandChildRef.current.position.y = grandchild.posY
      grandChildRef.current.rotation.y = grandchild.rotY
    }
    if (greatGrandChildRef.current) {
      greatGrandChildRef.current.position.z = greatGrandchild.posZ
      greatGrandChildRef.current.rotation.z = greatGrandchild.rotZ
    }
  })

  return (
    <group ref={parentRef}>
      {/* Padre: Tetraedro rojo */}
      <mesh>
        <tetrahedronGeometry args={[1]} />
        <meshStandardMaterial color="crimson" />
      </mesh>

      {/* Hijo: Icosaedro naranja */}
      <group ref={childRef}>
        <mesh>
          <icosahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Nieto: Octaedro verde */}
        <group ref={grandChildRef}>
          <mesh>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color="limegreen" />
          </mesh>

          {/* Biznieto: Cono azul */}
          <group ref={greatGrandChildRef}>
            <mesh>
              <coneGeometry args={[0.3, 1, 16]} />
              <meshStandardMaterial color="deepskyblue" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
