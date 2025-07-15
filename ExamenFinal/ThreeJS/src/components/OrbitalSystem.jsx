import React, { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls, folder } from 'leva'
import MonthOrbit from './MonthOrbit'
import CentralSun from './CentralSun'
import { MONTHS_INFO } from '../data/eventsData'

function OrbitalSystem({ events }) {
  const groupRef = useRef()

  // Debug: Verificar que el componente se está montando
  useEffect(() => {
    console.log('🌟 OrbitalSystem montado correctamente')
    console.log('📊 Datos de eventos:', Object.keys(events).length, 'eventos')
    console.log('📅 Datos de meses:', Object.keys(MONTHS_INFO).length, 'meses')
  }, [events])

  // Controles de Leva para el sistema orbital
  const { 
    'Velocidad de Rotación': systemSpeed,
    'Mostrar Órbitas': showOrbits,
    'Opacidad de Órbitas': orbitOpacity,
    'Filtrar por Mes': selectedMonth,
    'Tamaño de Planetas': dayScale,
    'Escala General': systemScale,
    'Números en Días': showDayNumbers,
    'Nivel de Detalle': planetDetails,
    'Atmósfera Solar': atmosphereIntensity,
  } = useControls('Configuración Visual', {
    'Apariencia General': folder({
      'Escala General': { value: 1, min: 0.5, max: 2, step: 0.1 },
      'Tamaño de Planetas': { value: 1.2, min: 0.5, max: 2.5, step: 0.1 },
      'Atmósfera Solar': { value: 0.7, min: 0, max: 1, step: 0.1 },
    }),
    'Órbitas y Planetas': folder({
      'Velocidad de Rotación': { value: 0.8, min: 0, max: 3, step: 0.1 },
      'Mostrar Órbitas': { value: true },
      'Opacidad de Órbitas': { value: 0.4, min: 0, max: 1, step: 0.1 },
      'Números en Días': { value: true },
      'Nivel de Detalle': { value: 'Alto', options: ['Bajo', 'Medio', 'Alto'] },
    }),
    'Filtros': folder({
      'Filtrar por Mes': { 
        value: 'Todos', 
        options: ['Todos', ...Object.values(MONTHS_INFO).map(m => m.name)] 
      },
    })
  })

  // Animación del sistema
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += systemSpeed * 0.002
      
      // Movimiento vertical sutil
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2
    }
  })

  // Generar datos de meses para Colombia 2025
  const monthsData = useMemo(() => {
    const data = Object.entries(MONTHS_INFO).map(([index, monthInfo]) => ({
      ...monthInfo,
      index: parseInt(index),
      radius: 25 + (parseInt(index) * 8), // Espaciado más amplio
      events: Object.entries(events).filter(([dateString]) => {
        const month = parseInt(dateString.split('-')[1]) - 1
        return month === parseInt(index)
      }).reduce((acc, [dateString, event]) => {
        acc[dateString] = event
        return acc
      }, {})
    }))
    
    console.log('🔄 Datos de meses generados:', data.length, 'meses')
    return data
  }, [events])

  const filteredMonths = useMemo(() => {
    if (selectedMonth === 'Todos') {
      return monthsData
    }
    return monthsData.filter(month => month.name === selectedMonth)
  }, [selectedMonth, monthsData])

  return (
    <group ref={groupRef} scale={systemScale}>
      {/* Sol central */}
      <CentralSun atmosphereIntensity={atmosphereIntensity} />
      
      {/* Órbitas de los meses */}
      {filteredMonths.map((month, index) => (
        <MonthOrbit
          key={month.name}
          month={month}
          monthIndex={month.index}
          events={month.events}
          showOrbit={showOrbits}
          orbitOpacity={orbitOpacity}
          dayScale={dayScale}
          systemSpeed={systemSpeed}
          showDayNumbers={showDayNumbers}
          planetDetails={planetDetails}
          year={2025}
        />
      ))}
      
      {/* Efectos de iluminación adicionales */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight
        position={[0, 30, 0]}
        intensity={0.8}
        color="#fff3cd"
        distance={300}
        decay={2}
      />
      
      {/* Iluminación lateral para mejor visibilidad */}
      <directionalLight
        position={[100, 50, 100]}
        intensity={0.6}
        color="#e8f4f8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  )
}

export default OrbitalSystem 