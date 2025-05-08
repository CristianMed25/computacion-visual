import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ModelDisplay from './ModelDisplay';
import './index.css';

const App = () => {
  const [selected, setSelected] = useState('obj');
  const [info, setInfo] = useState({ vertices: 0 });

  return (
    <div className="container">
      {/* Botones de selección */}
      <div className="controls">
        {['obj', 'stl', 'glb'].map((type) => (
          <button key={type} onClick={() => setSelected(type)}>
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Información del modelo */}
      <div className="info">
        <p><strong>Formato:</strong> {selected.toUpperCase()}</p>
        <p><strong>Vértices:</strong> {info.vertices}</p>
      </div>

      {/* Escena 3D */}
      <Canvas>
        <ModelDisplay format={selected} onLoadInfo={setInfo} />
      </Canvas>
    </div>
  );
};

export default App;
