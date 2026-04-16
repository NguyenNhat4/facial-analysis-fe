# Frontend API Request Architecture - Comprehensive Analysis

## 📋 Executive Summary

The UI Tooth AI frontend uses a **Fetch API + TanStack React-Query** architecture with minimal centralization. HTTP requests are scattered across page components and feature services with **multiple unofficial HTTP implementations**. The project follows the Feature-Sliced Design pattern but **violates its own AGENTS.md architecture guidelines** by including API calls in page components instead of confining them to service layers.

**Key Finding:** The backend must be running on `http://localhost:3000/api` by default, with optional endpoints for dental treatment API on `http://localhost:8000`.

---

## 🏗️ Architecture Overview

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components/Pages                   │
│  (demo.tsx, chat.tsx, xray-analysis.tsx, facial-analysis)  │
└────────────┬────────────────────────────────────────────────┘
             │ Makes direct fetch() calls ❌ (violates AGENTS.md)
             ▼
┌─────────────────────────────────────────────────────────────┐
│              Service Layer (Partial Implementation)         │
│  • src/pages/chat.tsx (chatbotAPI object)                   │
│  • src/features/cephalometric/services/ai-prediction.ts     │
│  • src/utils/demo-cases.ts                                  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│           HTTP Execution Layer                              │
│  • src/lib/queryClient.ts (apiRequest, getQueryFn)         │
│  • TanStack React Query (QueryClient)                       │
│  • Fetch API (native browser)                               │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│    Backend Services (via Environment Variables)             │
│  • ${VITE_API_BASE_URL}  → Main API (default: /api)        │
│  • ${VITE_DENTAL_TREATMENT_API_URL} → AI Services (8000)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration & Environment Setup

### Environment Variables (`.env.example`)

```env
# Main Backend API
VITE_API_BASE_URL=http://localhost:3000/api

# Dental Treatment / AI Prediction API
VITE_DENTAL_TREATMENT_API_URL=http://localhost:8000

# Runtime Environment
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_API_CHECK=true
```

### Vite Configuration
- **File:** `src/vite.config.ts`
- **API Endpoint Alias:** `@` → `src/` (used in all imports)
- No proxy configuration (would need setup for CORS in development)

### App Initialization
- **File:** `src/App.tsx`
- GraphQL Client: **TanStack React Query** (not GraphQL/Apollo)
- **Provider Setup:**
  ```tsx
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />  {/* UI Toast notifications */}
      <Router />
    </TooltipProvider>
  </QueryClientProvider>
  ```

---

## 📡 HTTP Layer Implementation

### 1. Base HTTP Client: `src/lib/queryClient.ts`

**Purpose:** Core fetch wrapper and React Query configuration

#### Functions
```typescript
// Generic HTTP request function
async apiRequest(
  method: string,      // "GET" | "POST" | "PUT" | "DELETE"
  url: string,         // Full URL
  data?: unknown       // Request body (auto-stringifies to JSON)
): Promise<Response>

// React Query query function factory
getQueryFn<T>(options: { on401: "returnNull" | "throw" }): QueryFunction<T>

// Configured QueryClient instance
export const queryClient: QueryClient
```

#### Features
- ✅ Automatic error throwing on non-OK statuses (3xx, 4xx, 5xx)
- ✅ Cookie-based authentication (`credentials: "include"`)
- ✅ JSON Content-Type header auto-detection
- ✅ Configurable 401 handling (return null OR throw)
- ✅ No retry logic (retry: false by default)

#### Configuration
```typescript
QueryClient defaults:
  - queries:
    - queryFn: getQueryFn({ on401: "throw" })
    - refetchInterval: false          (no auto-polling)
    - refetchOnWindowFocus: false     (no auto-fetch on tab focus)
    - staleTime: Infinity            (cache indefinitely)
    - retry: false                   (no auto-retry)
  - mutations:
    - retry: false
```

---

## 🔌 API Service Implementations

### Service 1: Chat / AI Assistant (`src/pages/chat.tsx`)

**Status:** ⚠️ Implemented in page component (violates architecture)

#### Configuration
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
```

#### Endpoints

| Method | Endpoint | Purpose | Body | Returns |
|--------|----------|---------|------|---------|
| **POST** | `/api/chat` | Send message to AI assistant | `{ message: string, sessionId?: string }` | `{ reply: string, sessionId: string }` |
| **POST** | `/api/chat/upload` | Upload image with message (FormData) | `FormData: { image: File, message?: string, sessionId?: string }` | `{ reply: string, sessionId: string, filename: string }` |
| **POST** | `/api/memory/session/new` | Create new chat session | `{}` | `{ sessionId: string }` |
| **GET** | `/api/memory/session/{sessionId}/history` | Get conversation history | N/A | `{ history: any[] }` |
| **GET** | `/health` ⚠️ | Health check (special URL handling) | N/A | `{ status: "ok" }` |

#### Implementation Details
```typescript
const chatbotAPI = {
  async sendMessage(message, sessionId?) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  // ... other methods
};
```

#### Health Check Implementation ⚠️
```typescript
// Special handling: strips "/api" suffix to get root URL
const healthResponse = await fetch(
  `${API_BASE_URL.replace("/api", "")}/health`
);
```

#### Error Handling
- Throws on HTTP error status
- Falls back to predefined responses for demo mode
- Shows Vietnamese user-facing error messages

---

### Service 2: Cephalometric AI Prediction  
**File:** `src/features/cephalometric/services/ai-prediction.ts`

**Status:** ❌ Hard-coded URL (not using env vars)

#### Endpoint
```typescript
POST localhost:8000/api/predict
  FormData: { file: File }
  Returns: { landmarks: LandmarksData }
```

#### Implementation
```typescript
export const predictLandmarks = async (file: File): Promise<LandmarksData> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("localhost:8000/api/predict", { // ❌ HARD-CODED!
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn(`API prediction failed with status ${response.status}`);
      return await getMockPrediction();
    }

    return response.json() as LandmarksData;
  } catch (error) {
    console.warn("API prediction failed, falling back to mock data", error);
    return await getMockPrediction();
  }
};
```

#### Issues
- ❌ **URL is hard-coded** (should be from `VITE_DENTAL_TREATMENT_API_URL`)
- ✅ Mock data fallback when API unavailable
- ✅ Service layer separation (correct pattern)

---

### Service 3: Demo Cases Configuration
**File:** `src/utils/demo-cases.ts`

#### Endpoints
```typescript
GET /demo-cases-config.json      // Load demo case list
  Returns: DemoCasesConfig

HEAD /[path]                      // Validate image path exists
  Returns: 200 OK or error
```

#### Functions
```typescript
loadDemoCasesConfig(): Promise<DemoCasesConfig>
getAllDemoCases(): Promise<DemoCase[]>
loadDemoCase(caseId): Promise<DemoCase>
getInputImagePath(demoCase, imageType): Promise<string>
getOutputImagePath(demoCase, imageType): Promise<string>
validateImagePath(path): Promise<boolean>
```

---

### Service 4: X-Ray Analysis
**File:** `src/pages/xray-analysis.tsx`

**Status:** ⚠️ Static JSON loading (no real API calls)

```typescript
GET /xray-analysis-output.json
  Returns: XRayAnalysisData (pre-generated report)
```

---

### Service 5: Facial Analysis
**File:** `src/pages/facial-analysis.tsx`

**Status:** ⚠️ Static JSON loading (no real API calls)

```typescript
GET /facial-analysis-output.json
  Returns: FacialAnalysisData (pre-generated report)
```

---

## 🎯 Feature-Level Service Organization

Following Feature-Sliced Design (FSD):

```
src/features/
├── cephalometric/
│   ├── services/
│   │   └── ai-prediction.ts (POST /api/predict)
│   ├── components/
│   ├── stores/
│   └── types.ts
│
├── imaging/
│   ├── hooks/
│   │   └── useImageManager.ts (handles file upload)
│   ├── stores/
│   │   └── image-store.ts (Zustand)
│   └── ...
│
└── patient/
    ├── hooks/
    ├── stores/
    └── ...

src/shared/
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/
│   └── queryClient.ts (HTTP Core)
└── types/
    └── api.ts (Global API types - missing!)
```

---

## 🔄 State Management

### Query/Data State
- **Client:** TanStack React Query
- **Config:** `src/lib/queryClient.ts`
- **Features:** Automatic caching, deduplication, stale-while-revalidate

### UI/Local State
- **Page Level:** `useState()` (demo.tsx, chat.tsx)
- **Feature Level:** Zustand stores (`image-store.ts`)
- **Global:** React Context (Theme provider, Toast provider)

### Session State
- **Chat Sessions:** Stored as string ID, passed with each API call
- **Image Upload:** Stored in Zustand (`image-store`)

---

## 🚨 Error Handling Strategy

### 1. Global Error Boundary
**File:** `src/components/GlobalErrorBoundary`
- Catches unhandled React component errors
- Prevents white-screen crashes
- Shows fallback UI

### 2. API Connection Detection
**Location:** `src/pages/chat.tsx` (useEffect)

```typescript
const enableApiCheck = import.meta.env.VITE_ENABLE_API_CHECK !== "false";

if (enableApiCheck) {
  try {
    const healthResponse = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
    if (healthResponse.ok) {
      setIsConnected(true);
      // Generate session
    }
  } catch {
    setIsConnected(false);
    setApiError("Không thể kết nối đến server AI...");
  }
}
```

### 3. Error Handling Patterns

| Pattern | Used In | Behavior |
|---------|---------|----------|
| Try/Catch | All fetch calls | Logs to console, falls back to mock data |
| HTTP Status Checking | All responses | Throws on non-OK status |
| Fallback Data | Cephalometric API | Returns mock predictions if API fails |
| Toast Notifications | UI operations | Shows success/error messages in UI |
| Demo Mode | Chat page | Pre-defined responses when API unavailable |

### 4. Error Messages

**Vietnamese Fallback Messages:**
```typescript
"Không thể kết nối đến server AI. Đang sử dụng chế độ demo."
(Cannot connect to AI server. Using demo mode.)

"Sai loại ảnh" 
(Wrong image type)

"Upload thành công"
(Upload successful)
```

---

## 📝 Request/Response Examples

### Example 1: Send Chat Message

**Request:**
```typescript
POST /api/chat
Content-Type: application/json

{
  "message": "Phân tích kết quả X-quang của tôi",
  "sessionId": "session-abc123"
}
```

**Response:**
```json
{
  "reply": "Dựa trên kết quả phân tích...",
  "sessionId": "session-abc123"
}
```

---

### Example 2: Upload Cephalometric Image

**Request:**
```typescript
POST localhost:8000/api/predict
Content-Type: multipart/form-data

[Binary image data]
```

**Response:**
```json
{
  "landmarks": [
    { "id": "A", "x": 100, "y": 150 },
    { "id": "B", "x": 110, "y": 160 },
    ...
  ]
}
```

---

### Example 3: Create Chat Session

**Request:**
```typescript
POST /api/memory/session/new
{}
```

**Response:**
```json
{
  "sessionId": "ses_xyzabc123def456"
}
```

---

## ⚠️ Issues & Gaps Analysis

### Critical Issues (Must Fix)

| Issue | Location | Severity | Impact |
|-------|----------|----------|--------|
| **Hard-coded backend URL** | `ai-prediction.ts` | 🔴 CRITICAL | Cannot use different backend in docker/deployment |
| **API calls in components** | `chat.tsx` (page) | 🔴 CRITICAL | Violates AGENTS.md FSD architecture |
| **No global API types** | `src/shared/types/` | 🟠 HIGH | Type safety across requests |
| **No request interceptors** | N/A | 🟠 HIGH | Can't add auth headers, logging, etc. centrally |
| **No retry mechanism** | queryClient.ts | 🟡 MEDIUM | Flaky network → user sees errors |

### Missing Features

```ruby
- ❌ No centralized TypeScript API response types
- ❌ No request logging/monitoring
- ❌ No rate limiting
- ❌ No request deduplication (beyond React Query)
- ❌ No custom error mapping
- ❌ No request cancellation handling
- ❌ No timeout configuration
- ❌ No GraphQL support (if planned)
```

---

## 📋 Checklist: How to Make Backend Requests

### ✅ Current Implementations (Working)

1. **Chat API** ✅
   - Uses `API_BASE_URL` from env
   - Has error handling
   - Session management built-in

2. **Demo Cases** ✅
   - Loads configuration from JSON
   - Validates paths with HEAD request
   - Has fallback logic

### ⚠️ Partially Working

3. **Cephalometric Prediction** ⚠️
   - Hard-coded URL
   - No env variable support
   - Mock fallback present

### ❌ Current Issues Blocking Requests

1. **Hard-coded URLs in Services**
   - `src/features/cephalometric/services/ai-prediction.ts` uses `localhost:8000`
   - Won't work in Docker or different environments

2. **No Global HTTP Interceptor**
   - Can't add auth headers globally
   - Can't log requests globally
   - Must duplicate error handling in each service

3. **API Calls in Pages**
   - Should move to feature services
   - Example: `src/pages/chat.tsx` has entire API service embedded

---

## 🎯 Recommended Architecture Improvements

### Priority 1: Centralized API Client

```typescript
// src/shared/api/client.ts
export const apiClient = {
  async get<T>(path: string): Promise<T>
  async post<T>(path: string, data: unknown): Promise<T>
  async put<T>(path: string, data: unknown): Promise<T>
  async delete<T>(path: string): Promise<T>
  async uploadFile<T>(path: string, file: File): Promise<T>
}
```

### Priority 2: Response Type Definitions

```typescript
// src/shared/types/api.ts
export interface ApiResponse<T> {
  data: T
  status: "success" | "error"
  message?: string
}

export interface ChatResponse {
  reply: string
  sessionId: string
}

export interface LandmarkResponse {
  landmarks: Landmark[]
}
```

### Priority 3: Service Layer Organization

```typescript
// src/shared/services/chat-api.ts
export const chatAPI = {
  sendMessage: (message, sessionId) => apiClient.post<ChatResponse>(...),
  uploadWithMessage: (file, message, sessionId) => apiClient.uploadFile<ChatResponse>(...),
}

// src/features/cephalometric/services/prediction-api.ts
export const predictionAPI = {
  predictLandmarks: (file) => apiClient.uploadFile<LandmarkResponse>(...),
}
```

### Priority 4: Environment Variable Support

```typescript
// Use import.meta.env consistently
const dentalTreatmentUrl = import.meta.env.VITE_DENTAL_TREATMENT_API_URL || "http://localhost:8000";
```

---

## 📖 Backend Endpoint Reference

### Available Endpoints

| Domain | Method | Path | Expected By | Status |
|--------|--------|------|-------------|--------|
| **Chat** | POST | `/api/chat` | `http://localhost:3000/api` | ✅ Implemented |
| **Chat** | POST | `/api/chat/upload` | `http://localhost:3000/api` | ✅ Implemented |
| **Chat** | POST | `/api/memory/session/new` | `http://localhost:3000/api` | ✅ Implemented |
| **Chat** | GET | `/api/memory/session/{id}/history` | `http://localhost:3000/api` | ✅ Implemented |
| **Prediction** | POST | `/api/predict` | `http://localhost:8000` | ⚠️ Hard-coded |
| **Health** | GET | `/health` | Any backend | ✅ Used for detection |

---

## 🔐 Authentication & Security

### Current Implementation
- **Method:** Cookie-based (credentials: "include")
- **Sessions:** Passed via `sessionId` in request body
- **CORS:** Likely needs backend configuration

### Missing
- ❌ No JWT/Bearer token support
- ❌ No Authorization header mechanism
- ❌ No refresh token rotation
- ❌ No CSRF protection headers

---

## 📚 Files Quick Reference

### HTTP Core
- `src/lib/queryClient.ts` - Base fetch + React Query setup

### Service Implementations
- `src/pages/chat.tsx` - Chat API (embedded in component)
- `src/features/cephalometric/services/ai-prediction.ts` - Landmark prediction
- `src/utils/demo-cases.ts` - Static JSON loading

### Supporting Infrastructure
- `src/App.tsx` - QueryClientProvider setup
- `src/components/GlobalErrorBoundary` - Error boundary
- `src/hooks/` - UI hooks (no API hooks)
- `src/shared/hooks/useToast.ts` - Toast notifications

### Configuration
- `.env.example` - Environment variables template
- `vite.config.ts` - API endpoint alias (@)
- `docker-compose.yml` - Production docker setup
- `docker-compose.dev.yml` - Development docker setup

---

## ✅ Verification Checklist for Backend Integration

Before connecting to your backend, verify:

- [ ] Backend running at `http://localhost:3000/api` (or set `VITE_API_BASE_URL`)
- [ ] Dental treatment API at `http://localhost:8000` (or set `VITE_DENTAL_TREATMENT_API_URL`)
- [ ] Backend has `/health` endpoint (no `/api` prefix)
- [ ] Backend has `/api/chat` endpoint for messages
- [ ] Backend has `/api/chat/upload` for image upload
- [ ] Backend has `/api/memory/session/new` for session creation
- [ ] Backend has `/api/predict` endpoint (on port 8000)
- [ ] CORS headers allow requests from `http://localhost:5173`
- [ ] Backend handles `FormData` for file uploads
- [ ] Backend handles `Content-Type: application/json` requests

---

## 📞 Next Steps

1. **Immediate:** Fix hard-coded URLs in `ai-prediction.ts`
2. **Short-term:** Move chat API service out of page component
3. **Medium-term:** Create centralized API client + response types
4. **Long-term:** Implement request interceptors & logging

---

*Generated: 2026-04-16*
*Project: UI Tooth AI*
*Architecture: Feature-Sliced Design (FSD) + React Query + Fetch API*
