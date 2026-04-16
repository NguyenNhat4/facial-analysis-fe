### **Before (Broken) ❌**
```tsx
useEffect(() => {
  const processImage = async () => {
    if (lateral && (loadedImageSrc !== lateral || !landmarksData)) {
      await uploadAndDetect(file);  // Calls API
    }
  };
  processImage();
}, [location, loadedImageSrc, landmarksData, setLoadedImageSrc, uploadAndDetect]);
//   ↑ These dependencies cause re-runs
```

**Flow:**
1. Page loads → Effect runs → Calls `uploadAndDetect()`
2. `uploadAndDetect()` is called 
3. It updates Zustand store: `set({ landmarksData: data })`
4. Store update triggers component re-render
5. `landmarksData` in dependency array changed → **Effect runs AGAIN**
6. Condition `!landmarksData` is now false BUT `landmarksData` in deps changed
7. API gets called **2 times** ❌

---

### **After (Fixed) ✅**
```tsx
const processedLateralRef = useRef<string | null>(null);

useEffect(() => {
  const processImage = async () => {
    const lateral = urlParams.get("lateral");
    
    // Guard: Only process if NOT already processed
    if (lateral && processedLateralRef.current !== lateral) {
      processedLateralRef.current = lateral;  // Mark as processed
      await uploadAndDetect(file);
    }
  };
  processImage();
}, []);  // Empty dependency = runs ONLY ONCE on mount
```

**Flow:**
1. Page loads → Effect runs **once** (empty deps array)
2. First time: `processedLateralRef.current = null` → condition passes → calls API
3. Sets: `processedLateralRef.current = "image-url"`
4. Even if store updates & state changes, effect doesn't re-run (no deps)
5. If effect somehow runs again: `processedLateralRef.current === lateral` → skip ✅

---

## **Key Difference:**

| Concept | Before | After |
|---------|--------|-------|
| **Dependency tracking** | Store state (`landmarksData`) | Ref value (`processedLateralRef.current`) |
| **Runs when** | Store updates | Only on component mount |
| **Can re-run** | Yes (reactive) | No (ref is not reactive) |
| **API calls** | 2x ❌ | 1x ✅ |

---

## **Why `useRef` works:**

```tsx
// useRef persists across renders WITHOUT triggering re-renders
const myRef = useRef(null);
myRef.current = "value";  // Changes value but doesn't re-render component
```

So even if the store updates and component re-renders, the ref remembers we already processed this image, and the check `processedLateralRef.current !== lateral` prevents a second call.

---

**In short:** The fix uses a `useRef` gate that says *"I've already processed this image URL, don't call the API again"* instead of relying on reactive state dependencies that cause infinite loops.