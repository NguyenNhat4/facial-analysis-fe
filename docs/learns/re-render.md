When **ANY** of these Zustand store values change, the **entire component re-renders**:

```tsx
const {
  loadedImageSrc,      // ← If this changes
  loading,             // ← Or this changes
  showLandmarkNames,   // ← Or this changes
  // ... any of these
} = useCephStore();    // → WHOLE COMPONENT RE-RENDERS
```

---

## **Visual Flow:**

```tsx
export default function CephAnalysisPage() {
  // 1️⃣ Extract from store
  const { loading, landmarksData } = useCephStore();
  
  // 2️⃣ This runs on EVERY render
  console.log("Rendering component...");
  
  // 3️⃣ Return JSX
  return (
    <div>
      {loading && <div>Loading...</div>}
      {landmarksData && <div>Landmarks loaded</div>}
    </div>
  );
}
```

**Timeline:**
```
Initial load
  ↓
Component renders #1 → "Rendering component..."
  ↓
User clicks something → loading = true (Zustand updates)
  ↓
Component re-renders #2 → "Rendering component..." (runs again!)
  ↓
API finishes → landmarksData updated
  ↓
Component re-renders #3 → "Rendering component..." (runs again!)
```

---

## **That's Why We Need `useEffect`:**

```tsx
// ❌ WITHOUT useEffect - runs on every render
uploadAndDetect(file);  // Called multiple times ❌

// ✅ WITH useEffect + [] - runs only once
useEffect(() => {
  uploadAndDetect(file);  // Called only once ✅
}, []);
```

**So:**
- **Component body code** = Runs on every render (dangerous for side effects)
- **Code in `useEffect` with `[]`** = Runs only once on mount (safe for API calls)

