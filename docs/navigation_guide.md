# Navigation, Routes, and Parameters

This guide explains how page navigation works in this project, how routes are defined, and how to pass parameters.

## Router setup

Routes are declared in [src/App.tsx](src/App.tsx#L1-L33) using `wouter`:

- `/` -> Patient list page
- `/patients/:id/upload` -> Upload page for a patient
- `/chat` -> Chat page
- `/facial-analysis` -> Facial analysis page
- `/ceph-analysis` -> Cephalometric analysis page
- Fallback -> Not Found

`wouter` uses a `Switch` with `Route` components. The first matching route wins, and the fallback route renders the Not Found page.

## Navigating between pages

The most common navigation pattern in this codebase uses `useLocation` from `wouter` to programmatically navigate. Example from [src/pages/demo.tsx](src/pages/demo.tsx#L1-L134):

```tsx
import { useLocation } from "wouter";

const [location, setLocation] = useLocation();

// Navigate to a path
setLocation("/patients");
```

- `location` is the current path string.
- `setLocation(path)` navigates to the new path.

## Route parameters

A route can define parameters using `:name` in its path. Example:

```tsx
<Route path="/patients/:id/upload" component={DemoPage} />
```

To read the parameter inside the page, use `useRoute`:

```tsx
import { useRoute } from "wouter";

const [, params] = useRoute("/patients/:id/upload");

// params.id contains the patient ID
```

In [src/pages/demo.tsx](src/pages/demo.tsx#L1-L98), the patient ID is read from `params.id` and used to load patient data.

## Query parameters

When you need to pass optional data without changing the route, use query parameters. Example from [src/pages/demo.tsx](src/pages/demo.tsx#L98-L178):

```tsx
const imageParams = new URLSearchParams();
imageParams.set("folder", currentFolderName);
imageParams.set("lateral", imagePreviewUrl);

const queryString = imageParams.toString();
setLocation(queryString ? `${path}?${queryString}` : path);
```

To read query parameters on the destination page:

```tsx
const search = new URLSearchParams(window.location.search);
const folder = search.get("folder");
```

## Quick examples

### Go to the patient list

```tsx
setLocation("/patients");
```

### Go to a patient upload page

```tsx
setLocation(`/patients/${patientId}/upload`);
```

### Go to analysis page with images

```tsx
const query = new URLSearchParams({
  folder: "demo-123",
  lateral: "blob:...",
}).toString();

setLocation(`/facial-analysis?${query}`);
```

## Tips

- Prefer route params for required identifiers (like `:id`).
- Prefer query params for optional data or filters.
- Always keep route definitions in [src/App.tsx](src/App.tsx#L1-L33) consistent with `useRoute` usage.
