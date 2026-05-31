# UI Components Directory 🦷✨

Welcome to the UI Components library. This directory contains two main categories of components:
1. **Standard Design Primitives**: Generic visual blocks built on top of Radix UI and Tailwind CSS (generated via shadcn/ui), such as buttons, cards, dialogs, sidebars, etc.
2. **Specialized 3D Dental Visualization Components**: Highly custom 3D helper meshes, loaders, overlays, and annotations designed for displaying, separating, and diagnosing 3D dental models (STL, OBJ) using **React Three Fiber (R3F)** and **@react-three/drei**.

---

## 🦷 Custom 3D Dental Visualization Components

These are the bespoke components in this directory that you need to read the implementation to understand their specialized coordinate-based rendering, loading pipelines, or interaction logic.

### 1. `ToothSegmentBoxes.tsx`
* **Utility**: Renders interactive, semi-transparent 3D bounding box meshes representing individual teeth or zones on the dental arch.
* **Internal Logic**:
  - Takes a list of 3D coordinates representing teeth centers and generates a bounding `THREE.Mesh` with `<boxGeometry args={[6, 7, 5]}>` around each coordinate.
  - Computes a deterministic, harmonious HSL color palette based on index spacing: `hsl(${(index * 137.5) % 360}, 70%, 70%)` so adjacent teeth are always color-distinguishable.
  - Shifts upper-jaw bounding boxes dynamically on the Y-axis using the `upperJawOffset` state when teeth separation controls are manipulated.
  - Highlights the selected tooth in solid red (`#ff0000`).
  - Utilizes `@react-three/drei`'s `<Html />` component to project a premium, glassmorphic 2D HTML floating tooltip directly in 3D space above the tooth, showing localized labels (e.g. "Răng 18 - Hàm Trên") and responsive click events.
* **Usage**:
  ```tsx
  <Canvas>
    <ambientLight />
    <ToothSegmentBoxes
      visibleCount={32}
      selectedTooth={activeToothId}
      setSelectedTooth={setActiveToothId}
      upperJawOffset={jawSeparatorValue}
      toothData={teethCoordinatesArray}
    />
  </Canvas>
  ```

---

### 2. `SingleStlViewer.tsx`
* **Utility**: Asynchronously loads, centers, and renders `.stl` (stereolithography) dental geometry models inside the 3D environment, offering interactive visual diagnostics (x-ray and wireframe modes).
* **Internal Logic**:
  - Leverages `@react-three/fiber`'s `useLoader` coupled with Three's native `STLLoader` for fast multi-threaded parsing of binary or ASCII stereolithography files.
  - **Auto-Centering**: Calculates the absolute bounding box of the loaded mesh using `THREE.Box3().setFromObject(mesh)`, determines its exact geometric center, and offsets the mesh position using `mesh.position.sub(center)`. This guarantees models render perfectly in the camera's focus, regardless of original CAD coordinates.
  - Detects if the mesh represents the upper jaw (when the filename or `name` property contains `"upper_jaw"`) and shifts it vertically by adding the `upperJawOffset` value to its position.
  - Watches `wireframeMode` and `xrayMode` props in a `useEffect` hook to update the active material on the fly: toggles standard wireframes, or applies translucent green colors (`0x00ff00`, opacity `0.3`, transparent mesh) for scanning diagnostic mockups.
* **Usage**:
  ```tsx
  <SingleStlViewer
    stlUrl="/models/lower_jaw.stl"
    name="lower_jaw"
    upperJawOffset={offset}
    initialUpperJawPosition={4.5}
    wireframeMode={isWireframe}
    xrayMode={isXray}
  />
  ```

---

### 3. `SingleObjViewer.tsx`
* **Utility**: Asynchronously loads, centers, and displays standard `.obj` 3D groups, with full support for `.mtl` (material library) texture pre-mapping.
* **Internal Logic**:
  - Employs R3F's `useLoader` wrapped around standard three.js `OBJLoader` and `MTLLoader`.
  - **Material Injection**: Preloads the `.mtl` file first, feeds it into the `OBJLoader` context, and applies all defined specular, diffuse, and bump maps onto the object faces before adding the group node to the scene graph.
  - Automatically shifts and aligns the loaded model using the same bounding box auto-centering logic as the STL viewer.
  - Moves the group vertically if identified as the `"upper_jaw"` model.
* **Usage**:
  ```tsx
  <SingleObjViewer
    objUrl="/models/upper_jaw.obj"
    mtlUrl="/models/upper_jaw.mtl"
    name="upper_jaw"
    upperJawOffset={offset}
    initialUpperJawPosition={4.5}
  />
  ```

---

### 4. `ToothAxisArrows.tsx`
* **Utility**: Renders local coordinate axes (X, Y, Z arrow vectors) at each individual tooth position. Highly useful for diagnostic alignment, surgical guides, or orthodontic torque simulations.
* **Internal Logic**:
  - Iterates through the tooth coordinate array and places an axis-indicator group at each offset coordinate.
  - Groups three `THREE.ArrowHelper` primitives pointing in cardinal unit vector directions:
    - 🔴 **X-Axis**: Red arrow pointing in `Vector3(1, 0, 0)`
    - 🟢 **Y-Axis**: Green arrow pointing in `Vector3(0, 1, 0)`
    - 🔵 **Z-Axis**: Blue arrow pointing in `Vector3(0, 0, 1)`
  - Tracks jaw separation: if a coordinate belongs to the upper jaw, its arrow helpers shift reactively to match the separation.
* **Usage**:
  ```tsx
  <ToothAxisArrows
    show={showOrthodonticVectors}
    upperJawOffset={jawSeparatorValue}
    toothData={teethCoordinatesArray}
  />
  ```

---

### 5. `ToothNumberLabels.tsx`
* **Utility**: Renders high-legibility, floating 3D text labels (using FDI/Universal tooth numbers) that hover precisely over each tooth coordinate in the 3D canvas.
* **Internal Logic**:
  - Utilizes `@react-three/drei`'s highly optimized `<Text>` component which compiles SDF (Signed Distance Field) webGL text textures.
  - Employs red styling (`#dc2626`) paired with a thick white border/outline (`outlineWidth: 0.15`, `outlineColor: "white"`) to ensure text stands out against any mesh background.
  - Configures anchors (`anchorX="center"`, `anchorY="middle"`) and aligns text nodes with camera billboarding parameters so they stay perfectly legible under rotations.
* **Usage**:
  ```tsx
  <ToothNumberLabels
    showLabels={showLabels}
    upperJawOffset={jawOffset}
    toothData={teethCoordinatesArray}
  />
  ```

---

### 6. `CrossSection.tsx`
* **Utility**: Renders a translucent green cutting-plane cross-section representing clipping planes or diagnostic scanning levels across the viewport.
* **Internal Logic**:
  - Renders a lightweight `<mesh>` utilizing `<planeGeometry args={[200, 200]}>`.
  - Rotates and aligns the plane dynamically on the fly based on the chosen cutting `axis`:
    - **X-axis**: Positioned at `[position, 0, 0]` and rotated `Math.PI / 2` along Z.
    - **Y-axis**: Positioned at `[0, position, 0]` and rotated `Math.PI / 2` along X.
    - **Z-axis**: Positioned at `[0, 0, position]` with zero rotation.
  - Formatted with `DoubleSide` transparency and an opacity of `0.3` for clear clipping guides.
* **Usage**:
  ```tsx
  <CrossSection show={showClippingPlane} position={planeValue} axis="y" />
  ```

---

### 7. `AdvancedLighting.tsx`
* **Utility**: Renders a complete studio lighting rig tailored for organic dental contours. Ensures high visual fidelity, surface highlights, realistic shadows, and accurate enamel depth perception.
* **Internal Logic**:
  - Bundles multiple R3F lighting primitives to avoid dark silhouettes on complex structures:
    - **Ambient Light**: Flat ambient light at `intensity * 0.4` for core base illumination.
    - **Directional Light 1 (Key Light)**: Placed at `[5, 10, 10]` (`intensity * 0.8`) with shadow mapping enabled at `2048x2048` shadow resolutions.
    - **Directional Light 2 (Fill Light)**: Placed opposite at `[-5, -10, -10]` (`intensity * 0.5`) to eliminate pitch-black occlusion zones on rear teeth.
    - **Hemisphere Light**: Light at `intensity * 0.3` blending with `#eeeeee` ground bounce to simulate room reflection.
    - **Point Light**: Localized specular highlight at `[10, 10, 10]` (`intensity * 0.6`).
    - **Spotlight**: Placed at `[0, 20, 0]` with a `0.3` angle and high penumbra to mimic a focused dental operating light.
* **Usage**:
  ```tsx
  <Canvas shadows>
    <AdvancedLighting intensity={1.2} />
    {/* 3D models here */}
  </Canvas>
  ```

---

### 8. `LoadingOverlay.tsx`
* **Utility**: A fullscreen loading screen indicating model parsing state, also housing unified styling overrides.
* **Internal Logic**:
  - Centers content on a dark backdrop (`rgba(15, 23, 42, 0.85)`) with high-performance CSS blur (`backdropFilter: "blur(8px)"`).
  - Contains keyframe animation templates for spinning states.
  - Injects global custom overrides inside a `<style>` tag targeting HTML `range` slider inputs (`::-webkit-slider-thumb` etc.) and `.control-panel` scrollbars, preventing styling fragmentation across browser platforms.

---

### 9. `ErrorBoundary.tsx`
* **Utility**: A React class-based error boundary that catches WebGL context crashes, loader timeouts, or canvas compilation errors.
* **Internal Logic**:
  - Implements static `getDerivedStateFromError(error)` and `componentDidCatch(error, errorInfo)`.
  - Replaces broken canvases with a styled diagnostic card displaying the precise stack message and an active "Reload Page" button to quickly refresh memory hooks.

---

## 🎨 Generic shadcn Design Primitives Reference

These components are standard primitives built on top of Radix UI and Tailwind CSS. You do not need to study their specific file implementation unless you are customizing base styles:

| Component | Technology | Primary Role |
| :--- | :--- | :--- |
| **`button.tsx`** | Radix Slot + Tailwind | Clickable indicators and triggers with custom button variant definitions. |
| **`card.tsx`** | Vanilla HTML + Tailwind | Structured cards with customizable headers, body segments, and footers. |
| **`dialog.tsx`** | Radix Dialog | Overlay modales that block user focus and trigger notifications. |
| **`sheet.tsx`** | Radix Dialog | Sliding drawer panel (top, bottom, left, right) used for sidebars and collapsible configs. |
| **`sidebar.tsx`** | Custom React Context + Radix | Multi-level collapsible side navigation container with active items. |
| **`slider.tsx`** | Radix Slider | Numeric range input sliders (e.g. for separation distance, lights, cross-section placement). |
| **`toast.tsx`** | Radix Toast | Ephemeral popup notifications indicating loading, saving, or error outcomes. |
| **`tabs.tsx`** | Radix Tabs | Tab-based layout switches for different diagnostic interfaces (3D model, annotations, patient files). |
| **`dropdown-menu.tsx`**| Radix Dropdown Menu | Interactive overlays housing action menus, options, and filters. |

*Note: For standard Radix primitives, consult official [shadcn/ui documentation](https://ui.shadcn.com) or [Radix UI primitives guides](https://www.radix-ui.com/primitives).*
