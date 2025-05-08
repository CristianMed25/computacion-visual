import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const ModelDisplay = ({ format, onLoadInfo }) => {
  const obj = useLoader(OBJLoader, '/model.obj');
  const stl = useLoader(STLLoader, '/model.stl');
  const gltf = useLoader(GLTFLoader, '/model.glb');

  // Crear mesh para STL manualmente
  const stlMesh = new THREE.Mesh(stl, new THREE.MeshStandardMaterial({ color: 'lightblue' }));

  useEffect(() => {
    let object;
    if (format === 'obj') object = obj;
    else if (format === 'stl') object = stlMesh;
    else if (format === 'glb') object = gltf.scene;

    if (!object) return;

    let count = 0;
    object.traverse?.((child) => {
      if (child.isMesh) {
        count += child.geometry.attributes?.position?.count || 0;
      }
    });
    onLoadInfo({ vertices: count });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, obj, stlMesh, gltf]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} />
      <OrbitControls />
      {format === 'obj' && <primitive object={obj} />}
      {format === 'stl' && <primitive object={stlMesh} />}
      {format === 'glb' && <primitive object={gltf.scene} />}
    </>
  );
};

export default ModelDisplay;
