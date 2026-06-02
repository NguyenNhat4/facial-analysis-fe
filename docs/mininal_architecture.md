### 1. The "What You See" Bucket (UI)
* **`pages/`**: These are the actual screens a user navigates to (e.g., `CephalometricPage.tsx`, `PatientProfilePage.tsx`). A page's only job is to glue components together.
* **`components/`**: The visual building blocks. 
  * If it's a generic button or dialog, put it in `components/ui`.
  * If it's specific to your app (like `ToothLandmarkCanvas.tsx`), just put it in `components/`. Don't overthink nesting.

### 2. The "Brain" Bucket (State & Logic)
* **`stores/`** (or `state/`): This is your Zustand folder. If a piece of data needs to be shared across different components (like the currently loaded X-ray or patient details), it lives here. 
* **`utils/`** (or `lib/`): Pure JavaScript/TypeScript functions. If a function calculates an angle between three points, it has nothing to do with React. Put it in `utils/calculations.ts`. This makes it super easy to test and keeps your UI components readable.

### 3. The "Outside World" Bucket (Network)
* **`api/`** (or `services/`): This is where you talk to Hugging Face, your Python backend, or Firebase. Any file that has `fetch()` or `axios` goes here. 

---

### The Minimal Folder Structure
Instead of complex "feature-sliced" directories, you just group by technical role:

```text
src/
 ├── api/           # All fetch() calls (ai-prediction.ts)
 ├── components/    # Reusable UI pieces (ToothCanvas, Sidebar, etc.)
 ├── pages/         # The main screens (App.tsx, AnalysisView.tsx)
 ├── stores/        # Zustand (ceph-store.ts, patient-store.ts)
 └── utils/         # Math, calculations, formatting data
```

### The Rules of the Minimal Mental Model
To keep this minimal structure from falling apart, just follow these 3 rules:

1. **Components are dumb:** A component should just take data and render it. If a button click needs to upload an image and run AI, the component should just call `useCephStore().uploadAndDetect(file)`.
2. **Stores are smart:** Put your complex logic (handling API responses, orchestrating state changes) inside your Zustand stores.
3. **No circular imports:** If `store A` needs `store B`, and `store B` needs `store A`, your logic is tangled. Move the shared logic into a plain function in `utils/`.

**Why this works:** When you look for a bug in a calculation, you immediately look in `utils`. When the API breaks, you look in `api`. When a button looks weird, you look in `components`. It requires zero architectural theory to understand.