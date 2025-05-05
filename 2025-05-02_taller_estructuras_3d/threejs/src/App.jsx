import React, { useState, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import './App.css'

// Componente que carga y muestra el modelo 3D
function Model({ viewMode, onStatsUpdate }) {
  // Cargar modelo OBJ desde carpeta pública
  const obj = useLoader(OBJLoader, '/Monito.obj')

  // Extraer las geometrías de cada mesh del modelo
  const geometries = useMemo(() => {
    const geoms = []
    obj.traverse(child => {
      if (child.isMesh) geoms.push(child.geometry.clone())
    })
    return geoms
  }, [obj])

  // Calcular estadísticas: vértices, caras y aristas
  useMemo(() => {
    let totalVertices = 0
    let totalFaces = 0
    let totalEdges = 0

    geometries.forEach(geometry => {
      const vertexCount = geometry.attributes.position.count
      const faceCount = geometry.index ? geometry.index.count / 3 : vertexCount / 3
      totalVertices += vertexCount
      totalFaces += faceCount
      totalEdges += faceCount * 3 // Suponemos 3 aristas por cara
    })

    // Enviar estadísticas al componente padre
    onStatsUpdate({
      vertices: totalVertices,
      faces: totalFaces,
      edges: totalEdges
    })
  }, [geometries, onStatsUpdate])

  // Renderizar según el modo de visualización
  return (
    <group>
      {geometries.map((geometry, index) => (
        <React.Fragment key={index}>
          {/* Caras: color negro */}
          <mesh geometry={geometry} visible={viewMode === 'faces'}>
            <meshStandardMaterial color='gray' flatShading />
          </mesh>
          {/* Aristas: color azul */}
          <lineSegments geometry={geometry} visible={viewMode === 'edges'}>
            <lineBasicMaterial color='blue' />
          </lineSegments>
          {/* Vértices: color rojo */}
          <points geometry={geometry} visible={viewMode === 'points'}>
            <pointsMaterial size={0.01} color='red' />
          </points>
        </React.Fragment>
      ))}
    </group>
  )
}

// Componente principal
export default function App() {
  const [viewMode, setViewMode] = useState('faces') // Modo actual de visualización
  const [stats, setStats] = useState({ vertices: 0, edges: 0, faces: 0 }) // Estadísticas del modelo

  return (
    <div className='container'>
      {/* Canvas de Three.js */}
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model viewMode={viewMode} onStatsUpdate={setStats} />
        <OrbitControls />
      </Canvas>

      {/* Controles de interfaz */}
      <div className='controls'>
        <button
          onClick={() => setViewMode('faces')}
          className={viewMode === 'faces' ? 'active' : ''}
        >
          Caras
        </button>
        <button
          onClick={() => setViewMode('edges')}
          className={viewMode === 'edges' ? 'active' : ''}
        >
          Aristas
        </button>
        <button
          onClick={() => setViewMode('points')}
          className={viewMode === 'points' ? 'active' : ''}
        >
          Vértices
        </button>

        {/* Mostrar estadísticas del modelo */}
        <div className='info'>
          Vértices: {stats.vertices} | Aristas: {stats.edges} | Caras: {stats.faces}
        </div>
      </div>
    </div>
  )
}
