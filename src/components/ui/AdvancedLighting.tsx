function AdvancedLighting({ intensity }: { intensity: number }) {
  return (
    <>
      <ambientLight intensity={intensity * 0.4} />
      <directionalLight
        position={[5, 10, 10]}
        intensity={intensity * 0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, -10, -10]} intensity={intensity * 0.5} />
      <hemisphereLight intensity={intensity * 0.3} groundColor="#eeeeee" />
      <pointLight position={[10, 10, 10]} intensity={intensity * 0.6} />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={intensity * 0.8}
        castShadow
      />
    </>
  );
}

export default AdvancedLighting;
