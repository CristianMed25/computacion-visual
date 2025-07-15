import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Leva } from 'leva';
import OrbitalSystem from './components/OrbitalSystem';
import CameraController from './components/CameraController';
import CalendarUI from './components/CalendarUI';
import { EVENTS_2025 } from './data/eventsData';
import './App.css';

const levaTheme = {
  colors: {
    elevation1: 'hsl(220, 15%, 10%)', // Fondo del panel
    elevation2: 'hsl(220, 15%, 15%)', // Fondo de las carpetas
    elevation3: 'hsl(220, 15%, 20%)', // Fondo de los controles
    accent1: '#4fd1c7',               // Acento principal
    accent2: '#26a69a',               // Acento secundario
    accent3: '#a7ffeb',               // Acento para hover
    highlight1: '#ffffff',            // Texto principal
    highlight2: '#bdc3c7',            // Texto secundario
    highlight3: '#95a5a6',            // Etiquetas y texto tenue
    vivid1: '#ffc107',                // Color para alertas o resaltados
  },
  fonts: {
    mono: `'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    body: `'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  fontSizes: {
    root: '12px',
  },
  space: {
    md: '15px',
    rowGap: '10px',
  },
  sizes: {
    rootWidth: '380px',
    controlWidth: '200px',
  },
  radii: {
    lg: '15px',
    md: '8px',
  },
};


function App() {
  console.log('🚀 Iniciando Calendario Espacial. Carga de fuente corregida.');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [events, setEvents] = useState(EVENTS_2025);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const addEvent = (newEvent) => {
    setEvents(prevEvents => ({
      ...prevEvents,
      [newEvent.date]: {
        type: 'custom',
        name: newEvent.name,
        description: newEvent.description,
        importance: 'medium', // Por defecto para eventos personalizados
        color: newEvent.color // Color seleccionado por el usuario
      }
    }));
  };

  return (
    <div className={`app ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      <Leva theme={levaTheme} titleBar={{ title: 'Controles', position: { x: -30, y: 70 } }} />
      <CalendarUI onAddEvent={addEvent} />
      
      <button onClick={toggleSidebar} className="sidebar-toggle-button">
        {isSidebarVisible ? '‹' : '›'}
      </button>

      <Canvas
        camera={{ position: [0, 50, 100], fov: 75 }}
        style={{ width: '100vw', height: '100vh' }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[50, 50, 50]} 
            intensity={0.8} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Stars 
            radius={300} 
            depth={50} 
            count={5000} 
            factor={4} 
          />
          <OrbitalSystem events={events} />
          <CameraController />
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={30}
            maxDistance={300}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App; 