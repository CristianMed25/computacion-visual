# 🧪 Nombre del Taller

**Construyendo el Mundo 3D: Vértices, Aristas y Caras**

## 📅 Fecha
2025-05-05

---

## 🎯 Objetivo del Taller

Comprender las estructuras gráficas básicas que forman los modelos 3D (mallas poligonales) y visualizar su estructura en distintas plataformas. Se explora la diferencia entre vértice, arista y cara, así como el contenido de archivos estándar de malla como .OBJ, .STL y .GLTF.

---

## 🧠 Conceptos Aprendidos

- Carga y visualización de modelos 3D en formato .OBJ en Python y web.
- Uso de trimesh y vedo para inspeccionar geometrías y extraer estadísticas (vértices, aristas, caras).
- Aplicación de colores personalizados para diferenciar vértices, aristas y caras en mallas 3D.
- Generación de animaciones rotacionales y exportación como GIF en Python.
- Renderizado 3D interactivo en tiempo real usando React Three Fiber.
- Carga de modelos con OBJLoader y control de cámara con OrbitControls.
- Implementación de una interfaz React para alternar entre distintos modos de visualización. 

---

## 🔧 Herramientas y Entornos

- Python (`trimesh`, `vedo`, `imageio`)
- Three.js / React Three Fiber (Vite, drei, OrbitControls)
- Jupyter / Google Colab

---

## 📁 Estructura del Proyecto

```
2025-05-02_taller_estructuras_3d/
├── python/             # Implementación en python
├── resultados/         # Animaciones en formato gif
├── threejs/            # Implementación en threejs
├── README.md
```
---

## 🧪 Implementación

### 🔹 Etapas realizadas
1. Preparación del modelo 3D en formato .OBJ (`Monito.obj`).
2. Visualización interactiva en React Three Fiber y análisis con Python (`trimesh`, `vedo`).
3. Resaltado visual de vértices, aristas y caras en ambos entornos.
4. Generación de animación rotatoria y exportación como GIF.

### 🔹 Código relevante

**🐍 Python – Visualización y animación con vedo**

Crea una animación rotando una malla 3D usando vedo y guarda cada cuadro como imagen. En cada paso, rota vértices, aristas y caras, añade un texto con estadísticas y captura la escena. Finalmente, convierte todas las imágenes en un GIF con imageio.

```python
# Animación: rotar y capturar
frames = []
n_frames = 36
for i in range(n_frames):
    # Rotar todos los objetos
    vedo_mesh.rotate(angle=360/n_frames, axis=[0, 1, 0])
    vertices.rotate(angle=360/n_frames, axis=[0, 1, 0])
    edges.rotate(angle=360/n_frames, axis=[0, 1, 0])

    # Agregar texto con estadísticas
    text = Text2D(stats_text, pos='top-left', c='white', bg='black', font='Courier', s=0.9)

    # Mostrar escena
    plotter.show(vedo_mesh, vertices, edges, text, axes=0, interactive=False)
    filename = os.path.join(output_folder, f"frame_{i:03d}.png")
    plotter.screenshot(filename)
    frames.append(imageio.imread(filename))

# Crear GIF
imageio.mimsave("monito_animado.gif", frames, fps=12)
```

**🌐 React Three Fiber (App.jsx) - Componente principal**

Este componente React renderiza una escena 3D usando Three.js y permite alternar entre la visualización de vértices, aristas o caras de un modelo cargado. Integra controles interactivos para cambiar la vista y muestra estadísticas actualizadas del modelo (número de vértices, aristas y caras). Usa OrbitControls para navegación libre en la escena.

```javascript
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
```
## 📊 Resultados Visuales

🐍 Python
Se generó una animación mostrando la rotación del modelo Monito.obj y los datos relacionados a sus componentes de la malla.

```markdown
![monito_animado_python.gif](/resultados/monito_animado_python.gif)
```
🌐 React Three Fiber
Se desarrolló una aplicación web interactiva que carga el modelo Monito.obj y permite alternar entre vistas de caras, aristas y vértices, mostrando además la cantidad aproximada de los componentes de la malla.

```markdown
![monito_animado_threejs.gif](/resultados/monito_animado_threejs.gif)
```
---

## 🧩 Prompts Usados

Enumera los prompts utilizados:

```text
"Ayudame a cargar un modelo 3D en formato .OBJ en Python con trimesh y visualízarlo con vedo, resaltando sus vértices, aristas y caras en distintos colores."
"Explica como desarrollar un componente en React Three Fiber que cargue un archivo .OBJ, permita mover la cámara libremente con OrbitControls y cambie dinámicamente entre vista de caras, aristas y puntos del modelo."
```

---

## 💬 Reflexión Final

Este taller me permitió comprender de manera práctica cómo están compuestas las mallas 3D y cómo manipularlas desde distintos entornos. En Python, resultó muy útil explorar la geometría del modelo con trimesh y destacar sus elementos estructurales con vedo. En el entorno web, fue interesante ver cómo React Three Fiber permite un renderizado fluido y controlado, facilitando la creación de interfaces interactivas. Lo más desafiante fue sincronizar los modos de visualización con el estado global, pero me ayudó a reforzar conceptos de React aplicados a gráficos 3D.