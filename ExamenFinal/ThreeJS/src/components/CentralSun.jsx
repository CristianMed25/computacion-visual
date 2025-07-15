import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CentralSun({ atmosphereIntensity = 0.7 }) {
  const meshRef = useRef()
  const atmosphereRef = useRef()
  const coronaRef = useRef()
  const innerGlowRef = useRef()

  // Shader personalizado mejorado para el sol
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#ff4500') },
        uColor2: { value: new THREE.Color('#ffd700') },
        uColor3: { value: new THREE.Color('#ff8c00') },
        uPulseSpeed: { value: 2.0 },
        uNoiseScale: { value: 12.0 },
        uIntensity: { value: 1.2 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uPulseSpeed;
        uniform float uNoiseScale;
        uniform float uIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        // Función de ruido simplificada
        float noise(vec3 p) {
          return sin(p.x * 1.5) * sin(p.y * 1.3) * sin(p.z * 1.7);
        }
        
        void main() {
          // Crear múltiples capas de ruido
          vec3 noisePos = vPosition * uNoiseScale + uTime * 0.5;
          float noise1 = noise(noisePos) * 0.5 + 0.5;
          float noise2 = noise(noisePos * 2.0 + uTime * 0.8) * 0.3 + 0.3;
          float noise3 = noise(noisePos * 4.0 + uTime * 1.2) * 0.2 + 0.2;
          
          float combinedNoise = noise1 + noise2 + noise3;
          
          // Gradiente radial desde el centro
          float distance = length(vUv - 0.5);
          float radialGradient = 1.0 - smoothstep(0.0, 0.5, distance);
          
          // Gradiente vertical para efecto de rotación
          float verticalGradient = sin(vUv.y * 3.14159 + uTime * 0.5) * 0.3 + 0.7;
          
          // Pulso temporal más complejo
          float pulse = 0.85 + 0.15 * sin(uTime * uPulseSpeed) + 
                       0.1 * sin(uTime * uPulseSpeed * 2.3);
          
          // Mezclar colores basado en ruido y posición
          vec3 color = mix(uColor1, uColor2, combinedNoise * radialGradient);
          color = mix(color, uColor3, verticalGradient * 0.4);
          
          // Aplicar efectos de brillo y energía
          float brightness = radialGradient * pulse * verticalGradient * uIntensity;
          color *= brightness;
          
          // Añadir puntos brillantes aleatorios
          float sparkle = step(0.98, combinedNoise) * 2.0;
          color += sparkle * uColor2;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    })
  }, [])

  // Material para la atmósfera exterior
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: atmosphereIntensity },
        uColor: { value: new THREE.Color('#ff6b35') }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normal;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform vec3 uColor;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Efecto de borde basado en el ángulo de visión
          float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          fresnel = pow(fresnel, 2.0);
          
          // Variación temporal
          float wave = sin(uTime * 2.0 + vPosition.y * 5.0) * 0.3 + 0.7;
          
          float alpha = fresnel * uIntensity * wave;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide
    })
  }, [atmosphereIntensity])

  // Animación del sol
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x += 0.003
      
      // Actualizar tiempo del shader
      sunMaterial.uniforms.uTime.value = state.clock.elapsedTime
      
      // Variación de intensidad
      sunMaterial.uniforms.uIntensity.value = 1.0 + 0.2 * Math.sin(state.clock.elapsedTime * 1.5)
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.005
      atmosphereRef.current.rotation.x += 0.002
      
      // Actualizar shader de atmósfera
      atmosphereMaterial.uniforms.uTime.value = state.clock.elapsedTime
      atmosphereMaterial.uniforms.uIntensity.value = atmosphereIntensity
      
      // Escala pulsante
      const scale = 1 + 0.05 * Math.sin(state.clock.elapsedTime * 2.5)
      atmosphereRef.current.scale.setScalar(scale)
    }
    
    if (coronaRef.current) {
      coronaRef.current.rotation.y += 0.003
      const coronaScale = 1 + 0.08 * Math.sin(state.clock.elapsedTime * 1.8)
      coronaRef.current.scale.setScalar(coronaScale)
    }
    
    if (innerGlowRef.current) {
      innerGlowRef.current.rotation.y -= 0.01
      const glowScale = 1 + 0.03 * Math.sin(state.clock.elapsedTime * 3.2)
      innerGlowRef.current.scale.setScalar(glowScale)
    }
  })

  return (
    <group>
      {/* Sol principal */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[10, 64, 64]} />
        <primitive object={sunMaterial} />
      </mesh>
      
      {/* Brillo interior */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[10.5, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.3 * atmosphereIntensity}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Atmósfera del sol */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[12, 32, 32]} />
        <primitive object={atmosphereMaterial} />
      </mesh>
      
      {/* Corona solar */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[14, 24, 24]} />
        <meshBasicMaterial 
          color="#ff8c42" 
          transparent 
          opacity={0.15 * atmosphereIntensity}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Efectos de luz */}
      <group>
        {/* Luz principal del sol */}
        <pointLight
          intensity={3.5}
          distance={800}
          decay={1.8}
          color="#ffd700"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={0.1}
          shadow-camera-far={1000}
        />
        
        {/* Luz de relleno */}
        <pointLight
          position={[0, 0, 0]}
          intensity={1.5}
          distance={400}
          decay={2}
          color="#ff8c00"
        />
        
        {/* Luz ambiente cálida */}
        <pointLight
          position={[0, 0, 0]}
          intensity={0.8}
          distance={200}
          decay={1.5}
          color="#ffcc99"
        />
      </group>
    </group>
  )
}

export default CentralSun 