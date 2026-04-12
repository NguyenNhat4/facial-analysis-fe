# Optimization: AI Processing Modal Display Frequency

This document explains the changes made to ensure the "AI Processing in Progress" modal only displays once per image set, simulating a single API call unless new images are uploaded. This guide is written to help programmers new to React understand the state management and component interaction used in this feature.

## Overview of the Problem

Previously, every time a user clicked to view an analysis (like Facial Analysis or Ceph Analysis) on the Demo page, the application would show an "AI Processing in Progress" modal for a few seconds. This happened even if the user had already waited for the analysis of that exact same image set.

The goal was to optimize this:
1. Show the loading modal the *first* time an analysis is requested for a set of images.
2. If the user navigates away and clicks the same analysis again, skip the modal and go straight to the results.
3. If the user uploads or removes an image, reset the state so the loading modal shows again on the next request.

## How it was Implemented

We achieved this by using **Zustand**, a small, fast state-management library for React, to keep track of which analyses have been processed.

### 1. Updating the Global State (Zustand Store)

**File:** `src/features/imaging/stores/image-store.ts`

**Concept:** In React, state is data that changes over time and affects what the user sees. Global state (managed here by Zustand) is state that can be accessed from any component in the application, avoiding the need to pass data down through many layers of components (prop drilling).

**Changes:**
We added a new property to our store called `processedAnalyses`. It's a simple dictionary (object) that tracks true/false for each analysis type:

```typescript
// Inside ImageState interface
processedAnalyses: Record<string, boolean>;

// Inside the initial store setup
processedAnalyses: {
  facial: false,
  ceph: false,
},
```

We also created a function to update this specific piece of state:
```typescript
setProcessedAnalysis: (analysisType, isProcessed) => set((state) => ({
  processedAnalyses: { ...state.processedAnalyses, [analysisType]: isProcessed }
})),
```
*Note: We use the spread operator (`...state.processedAnalyses`) to copy the existing state before updating the specific `analysisType`. This is a core React principle: state should be treated as immutable.*

Crucially, we modified the existing functions that handle image uploads and removals (`setUploadedImage`, `setUploadedFiles`, etc.) to reset `processedAnalyses` back to `false`. This fulfills the requirement that uploading a new image triggers the AI process again.

### 2. Exposing State via a Custom Hook

**File:** `src/features/imaging/hooks/useImageManager.ts`

**Concept:** Custom Hooks (functions starting with `use`) are a way to extract and reuse logic in React. They allow us to group related state and functions together.

**Changes:**
We simply pulled our new `processedAnalyses` state and `setProcessedAnalysis` function out of the Zustand store and returned them from the hook, so components using this hook can access them easily.

```typescript
// Inside useImageManager hook
const {
  // ... other state
  processedAnalyses,
  setProcessedAnalysis,
} = useImageStore();

return {
  // ... other returned values
  processedAnalyses,
  setProcessedAnalysis
};
```

### 3. Updating the User Interface (UI) Logic

**File:** `src/pages/demo.tsx`

**Concept:** React components are functions that return what the screen should look like based on their current state and props. Here, we add conditional logic to decide whether to show a modal or navigate immediately.

**Changes:**
First, we grab our new state and setter from the hook:
```typescript
const {
  // ...
  processedAnalyses,
  setProcessedAnalysis
} = useImageManager(showToast);
```

Next, we updated the `handleAnalysisClick` function. This function runs when the user clicks the "Facial Analysis" or "Ceph Analysis" button.

```typescript
const handleAnalysisClick = (
  analysisType: "facial" | "ceph",
  path: string,
  withImages = false
) => {
  setCurrentAnalysis(analysisType);
  setPendingNavigation({ path, withImages });

  // CONDITIONAL LOGIC:
  if (processedAnalyses[analysisType]) {
    // If true, it means we already processed this. Skip the modal and navigate!
    if (withImages) {
      handleNavigation(path, true);
    } else {
      handleNavigation(path);
    }
  } else {
    // If false, show the AI thinking modal first.
    setShowAIThinking(true);
  }
};
```

Finally, we update the `handleAIThinkingComplete` function. This runs when the loading modal finishes its animation. We need to mark the analysis as complete so the next click bypasses the modal.

```typescript
const handleAIThinkingComplete = () => {
  setShowAIThinking(false);

  // Mark this specific analysis as processed in our global store
  setProcessedAnalysis(currentAnalysis, true);

  // Proceed with navigation...
};
```

## Summary

By moving the tracking logic into a global store (Zustand) and resetting it only when the core inputs (the images) change, we created a much smoother user experience that acts intelligently based on previous actions.
