import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EVENT_TYPES, EVENT_IMPORTANCE } from '../data/eventsData'

function EventVisualizer({ event, position, isSelected, scale = 1, overrideColor }) {
  const particlesRef = useRef()
  const groupRef = useRef()
  const secondaryParticlesRef = useRef()

  // Configuración de partículas según el tipo de evento
  const particleConfig = useMemo(() => {
    const eventType = EVENT_TYPES[event.type] || EVENT_TYPES.special
    const importance = EVENT_IMPORTANCE[event.importance] || EVENT_IMPORTANCE.medium
    
    return {
      ...eventType,
      count: Math.floor(eventType.particleCount * importance.intensity),
      size: eventType.size * importance.scale,
      speed: 0.02 * importance.intensity,
      glowIntensity: eventType.glowIntensity * importance.intensity,
      scale: scale
    }
  }, [event.type, event.importance, scale])

  // Generar posiciones de partículas mejoradas
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleConfig.count * 3)
    const colors = new Float32Array(particleConfig.count * 3)
    const sizes = new Float32Array(particleConfig.count)
    
    // Usar el color personalizado si se proporciona, si no, el del tipo de evento
    const baseColor = new THREE.Color(overrideColor || particleConfig.color)
    const emissiveColor = new THREE.Color(overrideColor || particleConfig.emissiveColor)
    
    for (let i = 0; i < particleConfig.count; i++) {
      const i3 = i * 3
      
      // Generar posiciones según el patrón
      switch (particleConfig.pattern) {
        case 'sparkle':
          positions[i3] = (Math.random() - 0.5) * 2.5
          positions[i3 + 1] = (Math.random() - 0.5) * 2.5
          positions[i3 + 2] = (Math.random() - 0.5) * 2.5
          break
          
        case 'cross': {
          const spread = 2.0
          const crossPattern = Math.floor(Math.random() * 4)
          switch (crossPattern) {
            case 0: // Vertical
              positions[i3] = (Math.random() - 0.5) * 0.5
              positions[i3 + 1] = (Math.random() - 0.5) * spread
              positions[i3 + 2] = (Math.random() - 0.5) * 0.5
              break
            case 1: // Horizontal
              positions[i3] = (Math.random() - 0.5) * spread
              positions[i3 + 1] = (Math.random() - 0.5) * 0.5
              positions[i3 + 2] = (Math.random() - 0.5) * 0.5
              break
            default: // Diagonal
              positions[i3] = (Math.random() - 0.5) * (spread * 0.75)
              positions[i3 + 1] = (Math.random() - 0.5) * (spread * 0.75)
              positions[i3 + 2] = (Math.random() - 0.5) * 0.5
          }
          break
        }
          
        case 'orbit': {
          const orbitAngle = (i / particleConfig.count) * Math.PI * 2
          const orbitRadius = 1.5 + Math.random() * 1.0
          positions[i3] = Math.cos(orbitAngle) * orbitRadius
          positions[i3 + 1] = Math.sin(orbitAngle * 3) * 0.8
          positions[i3 + 2] = Math.sin(orbitAngle) * orbitRadius
          break
        }
          
        case 'wave':
          positions[i3] = (i / particleConfig.count) * 4 - 2
          positions[i3 + 1] = Math.sin(i * 0.8) * 1.5 + Math.cos(i * 0.3) * 0.8
          positions[i3 + 2] = Math.cos(i * 0.5) * 1.5
          break
          
        case 'spiral': {
          const spiralAngle = (i / particleConfig.count) * Math.PI * 8
          const spiralRadius = (i / particleConfig.count) * 2.0
          positions[i3] = Math.cos(spiralAngle) * spiralRadius
          positions[i3 + 1] = (i / particleConfig.count) * 3 - 1.5
          positions[i3 + 2] = Math.sin(spiralAngle) * spiralRadius
          break
        }
          
        case 'explosion': {
          const phi = Math.random() * Math.PI * 2
          const theta = Math.random() * Math.PI
          const r = 1.5 + Math.random() * 1.0
          positions[i3] = r * Math.sin(theta) * Math.cos(phi)
          positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi)
          positions[i3 + 2] = r * Math.cos(theta)
          break
        }
          
        case 'ring': {
          const angle = Math.random() * 2 * Math.PI;
          const innerRadius = 1.8;
          const outerRadius = 2.5;
          const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
          
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = (Math.random() - 0.5) * 0.2;
          positions[i3 + 2] = Math.sin(angle) * radius;
          break;
        }

        default: // simple
          positions[i3] = (Math.random() - 0.5) * 1.5
          positions[i3 + 1] = (Math.random() - 0.5) * 1.5
          positions[i3 + 2] = (Math.random() - 0.5) * 1.5
      }
      
      // Colores con variación
      const colorVariation = 0.4
      const mixRatio = Math.random()
      const finalColor = baseColor.clone().lerp(emissiveColor, mixRatio)
      
      colors[i3] = finalColor.r + (Math.random() - 0.5) * colorVariation
      colors[i3 + 1] = finalColor.g + (Math.random() - 0.5) * colorVariation
      colors[i3 + 2] = finalColor.b + (Math.random() - 0.5) * colorVariation
      
      // Tamaños variables
      sizes[i] = particleConfig.size * (0.5 + Math.random() * 0.5)
    }
    
    return { positions, initialPositions: new Float32Array(positions), colors, sizes }
  }, [particleConfig, overrideColor])

  // Animación de partículas
  useFrame((state) => {
    if (particlesRef.current && groupRef.current) {
      const time = state.clock.elapsedTime
      const positions = particlesRef.current.geometry.attributes.position.array
      const sizes = particlesRef.current.geometry.attributes.size.array
      
      // Animar según el patrón
      for (let i = 0; i < particleConfig.count; i++) {
        const i3 = i * 3
        
        switch (particleConfig.pattern) {
          case 'sparkle':
            positions[i3 + 1] += Math.sin(time * 8 + i) * 0.03
            sizes[i] = particleConfig.size * (0.5 + Math.abs(Math.sin(time * 6 + i)) * 0.8)
            break
            
          case 'cross': {
            // Efecto de pulsación radial
            const pulseFactor = 1 + Math.sin(time * 4 + i * 0.5) * 0.3
            positions[i3] = particleData.positions[i3] * pulseFactor
            positions[i3 + 1] = particleData.positions[i3 + 1] * pulseFactor
            positions[i3 + 2] = particleData.positions[i3 + 2] * pulseFactor
            break
          }
            
          case 'orbit': {
            const orbitSpeed = particleConfig.speed + i * 0.001
            const orbitAngle = time * orbitSpeed + i * 0.1
            const orbitRadius = 1 + Math.sin(time + i) * 0.5
            positions[i3] = Math.cos(orbitAngle) * orbitRadius
            positions[i3 + 2] = Math.sin(orbitAngle) * orbitRadius
            positions[i3 + 1] = Math.sin(orbitAngle * 3) * 0.8
            break
          }
            
          case 'wave':
            positions[i3 + 1] = Math.sin(time * 3 + i * 0.5) * 2 + Math.cos(time * 2 + i * 0.3) * 1
            break
            
          case 'spiral': {
            const spiralSpeed = time * 2 + i * 0.2
            const spiralR = (i / particleConfig.count) * 3
            positions[i3] = Math.cos(spiralSpeed) * spiralR
            positions[i3 + 2] = Math.sin(spiralSpeed) * spiralR
            break
          }
            
          case 'explosion': {
            const expansionSpeed = 1 + Math.sin(time * 1.5) * 0.4
            positions[i3] = particleData.positions[i3] * expansionSpeed
            positions[i3 + 1] = particleData.positions[i3 + 1] * expansionSpeed
            positions[i3 + 2] = particleData.positions[i3 + 2] * expansionSpeed
            break
          }
            
          default: {
            // Movimiento flotante simple contenido
            const initialPos = particleData.initialPositions
            const speed = 2
            const amplitude = 0.1
            positions[i3] = initialPos[i3] + Math.sin(time * speed + initialPos[i3 + 1]) * amplitude
            positions[i3 + 1] = initialPos[i3 + 1] + Math.cos(time * speed + initialPos[i3 + 2]) * amplitude
            positions[i3 + 2] = initialPos[i3 + 2] + Math.sin(time * speed + initialPos[i3]) * amplitude
            break
          }
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.geometry.attributes.size.needsUpdate = true
      
      // Rotación del grupo
      groupRef.current.rotation.y += particleConfig.speed * 0.5
      
      // Efecto de flotación
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Sistema de partículas principal */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particleData.positions}
            count={particleConfig.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={particleData.colors}
            count={particleConfig.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={particleData.sizes}
            count={particleConfig.count}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleConfig.size}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Halo de evento mejorado */}
      {isSelected && (
        <group>
          <mesh>
            <ringGeometry args={[2.5, 3.5, 32]} />
            <meshBasicMaterial 
              color={overrideColor || particleConfig.emissiveColor} 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Anillo interior */}
          <mesh>
            <ringGeometry args={[1.5, 2, 24]} />
            <meshBasicMaterial 
              color={overrideColor || particleConfig.color} 
              transparent 
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      
      {/* Efecto adicional para eventos de alta importancia */}
      {event.importance === 'high' && (
        <mesh>
          <sphereGeometry args={[4, 16, 16]} />
          <meshBasicMaterial 
            color={overrideColor || particleConfig.emissiveColor} 
            transparent 
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default EventVisualizer 