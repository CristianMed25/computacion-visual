import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

function CameraController() {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())

  // Controles de cámara
  const { 
    'Modo de Cámara': cameraMode, 
    'Velocidad de Animación': animationSpeed,
    'Altura de Cámara': cameraHeight,
    'Distancia de Cámara': cameraDistance 
  } = useControls('Cámara', {
    'Modo de Cámara': { 
      value: 'Libre', 
      options: ['Libre', 'Vista General', 'Seguir Sistema', 'Vista Cenital'] 
    },
    'Velocidad de Animación': { value: 2, min: 0.5, max: 5, step: 0.1, label: 'Velocidad' },
    'Altura de Cámara': { value: 50, min: 10, max: 100, step: 5, label: 'Altura' },
    'Distancia de Cámara': { value: 100, min: 50, max: 200, step: 10, label: 'Distancia' }
  })

  // Interpolación suave de la cámara
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    switch (cameraMode) {
      case 'Vista General':
        targetPosition.current.set(0, cameraHeight, cameraDistance)
        targetLookAt.current.set(0, 0, 0)
        break
        
      case 'Seguir Sistema': {
        const angle = time * 0.5
        const radius = cameraDistance * 0.8
        targetPosition.current.set(
          Math.cos(angle) * radius,
          cameraHeight * 0.8,
          Math.sin(angle) * radius
        )
        targetLookAt.current.set(0, 0, 0)
        break
      }
        
      case 'Vista Cenital':
        targetPosition.current.set(0, cameraDistance, 0)
        targetLookAt.current.set(0, 0, 0)
        break
        
      default:
        // Modo libre - no hacer nada, mantener controles de órbita
        return
    }
    
    // Interpolación suave de la posición
    if (cameraMode !== 'Libre') {
      camera.position.lerp(targetPosition.current, animationSpeed * 0.01)
      
      // Interpolación suave del lookAt
      currentLookAt.current.lerp(targetLookAt.current, animationSpeed * 0.01)
      camera.lookAt(currentLookAt.current)
    }
  })

  return null
}

export default CameraController 