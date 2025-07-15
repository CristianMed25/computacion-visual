import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import EventVisualizer from './EventVisualizer'
import { EVENT_TYPES, EVENT_IMPORTANCE, DAY_COLORS } from '../data/eventsData'

function DayPlanet({ 
  day, 
  month, 
  position, 
  angle, 
  event, 
  scale, 
  dateString, 
  showDayNumbers = true, 
  planetDetails = 'Alto',
  year = 2025 
}) {
  const meshRef = useRef()
  const haloRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const dayOfWeekName = useMemo(() => {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayIndex = new Date(dateString).getUTCDay();
    return dayNames[dayIndex];
  }, [dateString]);
  
  // Determinar el tipo de día y su apariencia
  const dayType = useMemo(() => {
    const dayDate = new Date(dateString)
    const dayOfWeek = dayDate.getUTCDay() // Cambiado a getUTCDay para consistencia
    
    if (event) {
      return event.type || 'special'
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Corregido: 1 (Lunes) a 6 (Sábado)
      return 'weekend'
    } else {
      return 'normal'
    }
  }, [dateString, event])

  // Configuración visual según el tipo de día
  const dayConfig = useMemo(() => {
    const eventType = event ? EVENT_TYPES[event.type] : null
    const importance = event ? EVENT_IMPORTANCE[event.importance] : EVENT_IMPORTANCE.low
    
    if (event && eventType) {
      // Usar el color del evento si existe, si no, el del tipo de evento.
      const baseColor = new THREE.Color(event.color || eventType.color);

      return {
        size: 0.8 * importance.scale,
        color: baseColor.getStyle(),
        emissiveColor: baseColor.clone().multiplyScalar(0.8).getStyle(),
        material: 'event',
        hasParticles: true,
        glowIntensity: eventType.glowIntensity * importance.intensity,
        textColor: '#ffffff',
        description: event.description
      }
    } else if (dayType === 'weekend') {
      return {
        size: 0.5,
        color: DAY_COLORS.weekend,
        emissiveColor: '#34495e',
        material: 'weekend',
        hasParticles: false,
        glowIntensity: 0.2,
        textColor: '#bdc3c7',
        description: 'Fin de semana'
      }
    } else {
      return {
        size: 0.6,
        color: DAY_COLORS.normal,
        emissiveColor: '#7f8c8d',
        material: 'normal',
        hasParticles: false,
        glowIntensity: 0.1,
        textColor: '#ecf0f1',
        description: 'Día normal'
      }
    }
  }, [dayType, event])

  // Material mejorado para los días
  const dayMaterial = useMemo(() => {
    const baseColor = new THREE.Color(dayConfig.color)
    const emissiveColor = new THREE.Color(dayConfig.emissiveColor)
    
    if (dayConfig.material === 'event') {
      return new THREE.MeshPhongMaterial({
        color: baseColor,
        emissive: emissiveColor.multiplyScalar(0.4),
        shininess: 100,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      })
    } else if (dayConfig.material === 'weekend') {
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: emissiveColor.multiplyScalar(0.1),
        metalness: 0.1,
        roughness: 0.8,
        transparent: true,
        opacity: 0.7
      })
    } else {
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: emissiveColor.multiplyScalar(0.05),
        metalness: 0.2,
        roughness: 0.6,
        transparent: true,
        opacity: 0.8
      })
    }
  }, [dayConfig])

  // Geometría mejorada según el nivel de detalle
  const geometry = useMemo(() => {
    const detailLevel = {
      'Bajo': { widthSegments: 8, heightSegments: 6 },
      'Medio': { widthSegments: 12, heightSegments: 8 },
      'Alto': { widthSegments: 16, heightSegments: 12 }
    }
    const detail = detailLevel[planetDetails] || detailLevel['Alto']
    return [dayConfig.size, detail.widthSegments, detail.heightSegments]
  }, [dayConfig.size, planetDetails])

  // Animación del planeta
  useFrame((state) => {
    if (meshRef.current) {
      // Rotación propia
      meshRef.current.rotation.y += 0.02
      meshRef.current.rotation.x += 0.01
      
      // Efecto de hover/selección
      const targetScale = isHovered || isSelected ? 
        scale * (1.3 + 0.2 * Math.sin(state.clock.elapsedTime * 6)) : 
        scale
      meshRef.current.scale.setScalar(targetScale)
      
      // Efecto de pulsación para eventos importantes
      if (event && event.importance === 'high') {
        const pulse = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 4)
        meshRef.current.scale.multiplyScalar(pulse)
      }
    }
    
    // La animación del texto ahora es manejada por el componente Billboard
    
    // Animación del halo
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.01
      haloRef.current.material.opacity = 0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 3)
    }
  })

  const handleClick = () => {
    setIsSelected(!isSelected)
    console.log(`📅 ${day} de ${month.name} ${year}:`, {
      evento: event?.name || 'Día normal',
      descripcion: event?.description || 'Sin eventos especiales',
      tipo: dayType,
      fecha: dateString
    })
  }

  const handlePointerOver = () => {
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setIsHovered(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group position={position}>
      {/* Planeta del día */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={scale}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={geometry} />
        <primitive object={dayMaterial} />
      </mesh>
      
      {/* Etiqueta con número del día y día de la semana */}
      {showDayNumbers && (
        <Billboard position={[0, dayConfig.size * 2.5, 0]}>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.35}
            color={dayConfig.textColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
            renderOrder={2}
          >
            {dayOfWeekName}
          </Text>
          <Text
            fontSize={0.6}
            color={dayConfig.textColor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
            depthTest={false}
            renderOrder={2}
          >
            {day}
          </Text>
        </Billboard>
      )}
      
      {/* Halo para días especiales */}
      {(isHovered || isSelected || event) && (
        <mesh ref={haloRef} position={[0, 0, 0]}>
          <ringGeometry args={[
            dayConfig.size * 1.2, 
            dayConfig.size * 1.8, 
            16
          ]} />
          <meshBasicMaterial 
            color={dayConfig.color} 
            transparent 
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Glow effect para eventos importantes */}
      {event && dayConfig.glowIntensity > 0.5 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[dayConfig.size * 1.4, 16, 16]} />
          <meshBasicMaterial 
            color={dayConfig.emissiveColor} 
            transparent 
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Visualizador de eventos */}
      {event && dayConfig.hasParticles && (
        <EventVisualizer 
          event={event}
          position={[0, dayConfig.size + 1.2, 0]}
          isSelected={isSelected}
          scale={scale}
          overrideColor={event.color} // Pasar el color personalizado
        />
      )}
      
      {/* Información adicional para días seleccionados */}
      {isSelected && (
        <Billboard position={[0, dayConfig.size * 4.5, 0]}>
          <Text
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
            textAlign="center"
            outlineWidth={0.02}
            outlineColor="#000000"
            depthTest={false}
            renderOrder={3}
          >
            {event?.name || `${day} de ${month.name}`}
          </Text>
          {event?.description && (
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.3}
              color="#bdc3c7"
              anchorX="center"
              anchorY="middle"
              maxWidth={6}
              textAlign="center"
              outlineWidth={0.02}
              outlineColor="#000000"
              depthTest={false}
              renderOrder={3}
            >
              {event.description}
            </Text>
          )}
        </Billboard>
      )}
    </group>
  )
}

export default DayPlanet 