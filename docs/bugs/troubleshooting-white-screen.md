# Troubleshooting: White Screen on `npm run dev`

Encountering a "white screen" (a completely blank page in your browser or preview environment) when running `npm run dev` is a common issue in React + Vite applications. This document outlines the primary causes and how to diagnose and fix them.

## 1. Node.js Version Incompatibilities (Vite Crash)

**Symptom:** You run `npm run dev`, and the terminal throws an error before the server fully starts, or the browser preview pane fails to connect, resulting in a white screen.

**Root Cause:**
Vite configuration files (`vite.config.ts`) are evaluated in a Node.js environment. If your configuration relies on features that your specific version of Node.js doesn't support, Vite will crash. 
A common culprit in newer Vite boilerplates is `import.meta.dirname`, which was only introduced in **Node.js 20.11**. If you run Node 18 or older, this resolves to `undefined`, causing path-resolution methods to throw a `TypeError`.

**How to Fix:**
Check your `vite.config.ts` for incompatible ES Modules properties. Replace `import.meta.dirname` with standard ES module path resolution:

```typescript
// Replace this:
import path from "path";
const aliasPath = path.resolve(import.meta.dirname, "src");

// With this:
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const aliasPath = path.resolve(__dirname, "src");
```

## 2. Missing Environment Variables (`.env`)

**Symptom:** The Vite server starts successfully, but navigating to a specific page or component causes the application to crash silently and render a white screen.

**Root Cause:**
If code blindly assumes an environment variable (like `import.meta.env.VITE_API_BASE_URL`) exists, and it's missing (e.g., because you haven't created a `.env` file from `.env.example`), any string methods called on it will throw a fatal runtime error (`TypeError: Cannot read properties of undefined`).

**How to Diagnose:**
1. Open your browser's Developer Tools (F12) and check the **Console** tab.
2. Look for errors like `Uncaught TypeError: Cannot read properties of undefined (reading 'replace')`.

**How to Fix:**
Always provide default fallbacks when defining constants from environment variables:

```typescript
// ❌ Dangerous: Can be undefined
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Safe: Provides a fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
```
Additionally, ensure you have run `cp .env.example .env` in your local development environment.

## 3. Unhandled React Rendering Exceptions

**Symptom:** The UI renders partially or completely blanks out after a specific user action or when navigating to a specific route.

**Root Cause:**
React's default behavior is to completely unmount the component tree if an error is thrown during rendering and is not caught by an **Error Boundary**. This leaves the `<div id="root"></div>` completely empty.

**How to Diagnose:**
Check the browser console for an error message like:
`The above error occurred in the <YourComponent> component:`
Followed by:
`Consider adding an error boundary to your tree to customize error handling behavior.`

**How to Fix:**
As mandated by our `docs/frontend_architecture.md`, you must wrap major routes and the top-level application in a `GlobalErrorBoundary`. This ensures the application catches the crash and displays a graceful fallback UI instead of a white screen.

```tsx
// In src/App.tsx
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
```

## 4. Missing Dependencies

**Symptom:** You type `npm run dev` and immediately get `sh: 1: vite: not found`.

**Root Cause:**
You haven't installed the `node_modules`.

**How to Fix:**
Run `npm install` before running `npm run dev`.

---

**Summary Checklist for White Screens:**
1. Did I run `npm install`?
2. Did the terminal show any errors when running `npm run dev` (e.g., Vite config crashes)?
3. Are there any red errors in the Browser Console (F12)?
4. Have I copied `.env.example` to `.env`?
5. Is the app wrapped in a `<GlobalErrorBoundary>` to prevent complete unmounts?
