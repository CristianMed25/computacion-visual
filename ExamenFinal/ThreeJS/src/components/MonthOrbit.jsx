import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import DayPlanet from './DayPlanet'

function MonthOrbit({ 
  month, 
  monthIndex, 
  events, 
  showOrbit, 
  orbitOpacity, 
  dayScale,
  systemSpeed,
  showDayNumbers,
  planetDetails,
  year
}) {
  const orbitRef = useRef()
  const lineRef = useRef()
  const labelRef = useRef()

  // Crear la línea de la órbita con más detalle
  const orbitLine = useMemo(() => {
    const points = []
    const radius = month.radius
    const segments = 128 // Más segmentos para suavidad
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ))
    }
    
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [month.radius])

  // Generar posiciones de los días con mejor distribución
  const dayPositions = useMemo(() => {
    const positions = []
    const radius = month.radius
    
    for (let day = 1; day <= month.days; day++) {
      const angle = ((day - 1) / month.days) * Math.PI * 2 // CORRECCIÓN: El día 1 ahora comienza en el ángulo 0
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      // Variación más sutil en Y para mantener la órbita
      const y = Math.sin(angle * 4) * 1.5
      
      positions.push({
        day,
        position: [x, y, z],
        angle,
        dateString: `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      })
    }
    
    return positions
  }, [month.days, month.radius, monthIndex, year])

  // Animación de la órbita
  useFrame((state) => {
    if (orbitRef.current) {
      // Rotación diferencial según el mes
      const speed = systemSpeed * 0.0008 * (1 + monthIndex * 0.05)
      orbitRef.current.rotation.y += speed
      
      // Movimiento vertical sutil
      orbitRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3 + monthIndex) * 0.5
    }
    
    // Animación de la etiqueta del mes
    if (labelRef.current) {
      // Billboard se encarga de la orientación
      // labelRef.current.lookAt(state.camera.position)
    }
  })

  return (
    <group ref={orbitRef}>
      {/* Línea de la órbita mejorada */}
      {showOrbit && (
        <line ref={lineRef}>
          <primitive object={orbitLine} />
          <lineBasicMaterial 
            color={month.color} 
            transparent 
            opacity={orbitOpacity}
            linewidth={3}
          />
        </line>
      )}
      
      {/* Planetas de los días */}
      {dayPositions.map(({ day, position, angle, dateString }) => {
        const dayEvent = events[dateString]
        
        return (
          <DayPlanet
            key={`${month.name}-${day}`}
            day={day}
            month={month}
            position={position}
            angle={angle}
            event={dayEvent}
            scale={dayScale}
            dateString={dateString}
            showDayNumbers={showDayNumbers}
            planetDetails={planetDetails}
            year={year}
          />
        )
      })}
      
      {/* Etiqueta del mes mejorada y siempre visible */}
      <Billboard position={[month.radius, 8, 0]}>
        <Text
          ref={labelRef}
          fontSize={1.4}
          color={month.color}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#000000"
          depthTest={false}
          renderOrder={1}
        >
          {month.name}
        </Text>
        
        {/* Información adicional del mes */}
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          maxWidth={8}
          textAlign="left"
          depthTest={false}
          renderOrder={1}
        >
          {month.season} • {month.days} días
        </Text>
        
        {/* Descripción del mes */}
        <Text
          position={[0, -2.8, 0]}
          fontSize={0.5}
          color="#bdc3c7"
          anchorX="left"
          anchorY="middle"
          maxWidth={12}
          textAlign="left"
          depthTest={false}
          renderOrder={1}
        >
          {month.description}
        </Text>
      </Billboard>
      
      {/* Marcadores de estaciones */}
      <group>
        {/* Marcador de inicio de mes */}
        <mesh position={[month.radius, 0, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial 
            color={month.color} 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Marcador de mitad de mes */}
        <mesh position={[-month.radius, 0, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial 
            color={month.color} 
            transparent 
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  )
}

export default MonthOrbit 