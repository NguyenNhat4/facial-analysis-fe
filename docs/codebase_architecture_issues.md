Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/components)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/features)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/shared)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/app)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/pages)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/core)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/shared)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/features/cephalometric)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/features/imaging)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/features/patient)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/main.tsx)

Read [](file:///home/nhatnm/code/myprojects/ui-tooth-ai/src/App.tsx)

## ❌ Project Structure Misalignment Report

Based on AGENTS.md architecture, here's what **DOESN'T match**:

### **1. Missing `app/` Layer (CRITICAL)**
```
❌ CURRENT: main.tsx, App.tsx at src/ root
✅ SHOULD BE: src/app/
  ├── main.tsx
  ├── App.tsx
  ├── App.css
  ├── index.css
  └── (Global providers, Error Boundary, Theme)
```

---

### **2. Root-Level Folders That Violate Architecture**

| Location | Issue | Should Be |
|----------|-------|-----------|
| components | Top-level components folder | **BLOCKER**: Components must be in `features/[feature]/components/` or `shared/components/` |
| hooks | Generic hooks at root | `shared/hooks/` |
| lib | Utilities at root | `shared/lib/` |
| utils | Utilities at root | `shared/utils/` |
| types | Types scattered | Should be in `shared/types/` (generic) or `features/[feature]/types.ts` |
| data | ❌ Not defined in AGENTS.md | Remove or move to appropriate layer |
| styles | ❌ Not defined in AGENTS.md | Should use Tailwind only or move to `app/` |

---

### **3. Incomplete `shared/` Layer**
```
❌ CURRENT:
shared/
  └── hooks/

✅ SHOULD BE:
shared/
  ├── components/     (Dumb UI components, shadcn/ui)
  ├── hooks/          ✓ (exists)
  ├── lib/            (utilities like cn, formatDate)
  ├── types/          (generic API types, error types)
  └── utils/          (string utils, constants)
```

---

### **4. Incomplete Features Structure**

| Feature | Current | Should Have |
|---------|---------|-------------|
| `imaging/` | `hooks/` `stores/` | **Missing**: `components/`, `services/`, `utils/` |
| `patient/` | `hooks/` `stores/` | **Missing**: `components/`, `services/`, `utils/`, `types.ts` |
| `cephalometric/` | `components/` `services/` `stores/` `types.ts` `utils/` | ✅ **CORRECT** |

---

### **5. Duplicate/Conflicting Hooks**

```
❌ DUPLICATES:
  src/hooks/use-toast.ts
  src/shared/hooks/useToast.ts
  src/hooks/use-mobile.tsx

✅ SHOULD BE: Consolidated in src/shared/hooks/
```

---

### **6. Components Folder Misplacement (BLOCKER)**

```
❌ CURRENT: src/components/
  ├── 3DViewer.tsx
  ├── PredictionResults.tsx
  ├── ai-thinking-modal.tsx
  ├── demo-case-manager.tsx
  ├── patient-info.tsx
  ├── xray-analysis.tsx
  ├── facial-analysis.tsx
  └── ... (12+ components)

✅ SHOULD BE: Distributed by feature
  imaging/components/          patient/components/
  ├── ImageUploader.tsx        ├── PatientInfo.tsx
  ├── ValidationError.tsx      └── ...
  ├── UploadCards.tsx
  └── ...
  
  AND shared/components/ (for generic UI)
  ├── GlobalErrorBoundary.tsx
  ├── Toaster.tsx
  └── Toast components
```

---

## 📋 Summary of Issues by Severity

### 🔴 **CRITICAL (Blocks Merge)**
1. components folder at root ← Components must be in features or shared
2. No `app/` layer (main.tsx, App.tsx should be organized here)
3. Features missing required subfolders (`imaging/`, `patient/` missing `components/`)

### 🟠 **HIGH (Architecture Violation)**
4. hooks, lib, utils, types at root instead of in `shared/`
5. Duplicate toast hooks (consolidate into one)

### 🟡 **MEDIUM (Cleanup)**
6. Remove or reorganize data, styles (not in AGENTS.md spec)
7. Add missing feature subfolders (services, utils where needed)

---

## ✅ What's Already Correct

- ✓ `core/` layer exists with proper structure
- ✓ `pages/` exists
- ✓ `features/` exists with some proper structure
- ✓ Overall Layer separation concept is understood

---

**Recommendation:** Perform a **Phase-1 Refactoring** to reorganize root folders into `app/` and `shared/`, then move all scattered components into feature domains.