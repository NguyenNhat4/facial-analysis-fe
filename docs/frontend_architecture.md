# TÀI LIỆU KIẾN TRÚC FRONTEND VÀ QUY CHUẨN LẬP TRÌNH (Frontend Architecture & Convention Rules)

## 📌 LỜI NÓI ĐẦU
Tài liệu này là **Single Source of Truth** (Nguồn chân lý duy nhất) hướng dẫn chi tiết cách thức cấu trúc, viết code, và duy trì thư mục Frontend cho dự án Dental Analysis System (UI Tooth AI). Mọi quyết định kỹ thuật, quy trình review code và việc tích hợp các tính năng mới đều phải tuân theo tài liệu này. Hãy đọc kỹ trước khi bắt đầu tạo PR mới hoặc triển khai một Feature mới. Việc thiết lập đúng bộ quy chuẩn từ đầu giúp tránh nợ kỹ thuật (Technical Debt) và đảm bảo các phiên bản nâng cấp sau này diễn ra trơn tru.

---

## 1. TẦM NHÌN VÀ KIẾN TRÚC TỔNG THỂ (OVERVIEW)

Chúng ta sử dụng **Feature-Sliced Design (FSD)** kết hợp với **Layered Architecture**. Điều này có nghĩa là thay vì nhóm code theo loại kỹ thuật (tất cả components ở một nơi, tất cả hooks ở một nơi), chúng ta nhóm code theo **Giá trị Nghiệp vụ (Business Domains/Features)**.

### 1.1 Mục tiêu của kiến trúc
1. **Loose Coupling (Kết dính lỏng léo):** Các page không được chứa logic nghiệp vụ, chỉ làm nhiệm vụ kết nối các feature.
2. **High Cohesion (Tính gắn kết cao):** Mọi module liên quan đến việc render Canvas đều nằm ở một feature, mọi logic liên quan đến hình học nằm ở core.
3. **Dễ bảo trì và Scalable:** Cho phép team có nhiều developer cùng làm việc trên các tính năng khác nhau mà không bị "conflict" code ngầm định.
4. **Predictability (Tính dễ dự đoán):** Nhìn vào tên thư mục, bất cứ ai cũng biết module đó làm công việc gì, thuộc nghiệp vụ nào, và có phạm vi hành động đến đâu.

### 1.2 Luồng dữ liệu (Data Flow)
Mọi dữ liệu đi theo hướng One-Way Data Binding kinh điển của React, nhưng đi qua các tầng kiểm soát:
`API / Core Math` -> `Global Store / Service Hooks` -> `Smart Component (Feature)` -> `UI Component (Dumb Component)`.
Bất kỳ sự vi phạm nào đưa Logic trực tiếp vào Dumb Component đều sẽ bị từ chối trong quá trình Review.

---

## 2. CẤU TRÚC THƯ MỤC CHI TIẾT

Cây thư mục gốc nằm trong `src/` tuân thủ nghiêm ngặt các Layer sau, chú ý thứ tự phụ thuộc là **từ trên xuống dưới**: các Layer bên dưới **không bao giờ** được phép import Layer bên trên nó.

```bash
src/
├── app/               # Layer 1: Cấu hình gốc (App, Router, Global Store providers, Theme)
├── pages/             # Layer 2: Thành phần View to nhất, lắp ghép từ các features
├── features/          # Layer 3: Các tính năng nghiệp vụ cốt lõi (Domain-specific)
├── core/              # Layer 4: Thuật toán độc lập không lạm dụng React (Math, AI engine)
└── shared/            # Layer 5: Các yếu tố UI nguyên thủy, Util đa dụng, lib, constants
```

### 2.1 Mổ xẻ từng Layer:
- **`app/`**: Chứa `main.tsx`, `App.tsx`, cài đặt React Context tổng, cài đặt Wouter/React-Router. Quản lý khâu khởi tạo ứng dụng, tiêm (inject) các biến môi trường và xử lý lỗi ở cấp cao nhất (Global Error Boundary).
- **`pages/`**: File ở đây phải cực kỳ mỏng. Đây là nơi định nghĩa layout (Header, Footer, Main Content) và khai báo các route.
  * ❌ Không bao gồm `useState` phức tạp để handle data.
  * ❌ Không fetch API trực tiếp (`fetch` hay `axios`).
  * ✅ Chỉ import và gắn các `<FeatureComponent />` vào các vùng bố cục.
- **`features/`**: Trái tim của ứng dụng. Mỗi thư mục con ở đây đại diện cho 1 domain (ví dụ `imaging/`, `patient/`, `ai-assistant/`, `cephalometric/`).
  Bên trong mỗi feature sẽ có cấu trúc lặp lại nhằm cô lập hoá chức năng:
  * `/components`: Chứa UI dành riêng cho feature này.
  * `/hooks`: Custom hooks chứa quy trình xử lý state.
  * `/services` hoặc `/api`: Tương tác API/Backend thuần túy cho file.
  * `/utils`: Hàm hỗ trợ nội bộ cho tính năng.
- **`core/`**: Tuyệt đối **không** dùng `import { useState } from 'react'` hay các React lifecycle trong thư mục này. 
  * Đây là nơi trú ngụ của logic chẩn đoán y khoa, các công thức lượng giác CEPH.
  * Cho phép tái sử dụng ở môi trường Node.js Backend nếu cần thiết trong tương lai.
- **`shared/`**: Tài nguyên công cộng.
  * Thư viện (ví dụ shadcn ui), generic hooks (`useWindowSize`, `useToast`).
  * File utils (`formatDate`, `cx`, `stringUtils`).

---

## 3. QUY CHUẨN ĐẶT TÊN (NAMING CONVENTIONS)

Sự đồng nhất trong cách đặt tên là tối quan trọng để dễ dùng menu cấu hình "Go to file", đồng thời duy trì tính chuyên nghiệp của mã nguồn.

### 3.1 Tên File và Thư mục
Tất cả các tên file và folder đều phải dùng **kebab-case** hoặc **PascalCase** tuỳ ngữ cảnh, nhưng để thống nhất, ưu tiên:
- `kebab-case.ts` cho các file util, hooks, types (`use-image-manager.ts`, `auth-api.ts`).
- `PascalCase.tsx` cho React Components (`DentalFeatureForm.tsx`).
- Thư mục luôn là **kebab-case** (`ai-assistant/`, `shared/components/`).
- Tên file test phải thêm hậu tố gốc: `math-utils.test.ts`.

### 3.2 Tên Biến và Hàm
- **Biến và Hàm thông thường:** Dùng `camelCase`. 
  `const isImageValid = false;`
  `function calculateCephAngle(p1, p2, p3): number {}`
- **Tên Component & Interface:** Dùng `PascalCase`.
  `interface CephMeasurement {}`
  `const PatientRecordViewer = () => <div/>`
- **Hằng số cục bộ / toàn cục (Constants):** Dùng `UPPER_SNAKE_CASE`. Không hard-code chuỗi hay số mà hãy gắn vào hằng số.
  `const MAX_UPLOAD_SIZE_BYTES = 5000000;`
  `const DEFAULT_CANVAS_SCALE = 1.0;`

### 3.3 Đặt tên Boolean
Phải bắt đầu bằng chữ diễn tả ngữ nghĩa câu hỏi/trạng thái: `is`, `has`, `should`, `can`.
- ❌ `const showModal = true;` (Gây nhầm lẫn với tên hàm)
- ✅ `const isShowModal = true;` (Biến lưu trạng thái)
- ✅ `const hasFaceImages = false;`

### 3.4 Đặt tên Event Handlers
Luôn dùng tiền tố `handle` cho hàm nội bộ thực thi khi có event, và `on` cho Prop callback đưa từ ngoài vào Component.
- Cấu trúc Component con: `<Button onClick={handleClick} />`
- Prop truyền qua Component: `interface UploadProps { onSubmitPhoto: () => void }`
- Hàm cục bộ xử lý event `onSubmitPhoto` là `handleSubmitPhoto`.

---

## 4. QUY TẮC PHÁT TRIỂN COMPONENT VÀ REACT HOOKS

Ứng dụng phức tạp khiến các React Component dễ dàng trở thành bãi rác quản lý vòng đời (lifecycle garbage collection). 

### 4.1 Quy tắc Smart / Dumb Components
- **Dumb Components (Presentational):** Các component thuần túy chỉ tập trung vào việc hiển thị dữ liệu ra HTML/CSS. Nhận mọi dữ liệu và action qua `props`. 
  - Vị trí: `src/shared/components/` hoặc `src/features/.../components/ui/`
  - Ví dụ: `Button`, `LandmarkPointMarker`.
- **Smart Components (Container):** Các component nhận trách nhiệm định hình luồng. Nó là người đứng ra gọi Khối API, gán Dữ liệu vào Store, bắt Lỗi và truyền Dữ liệu gọt dũa xuống cho Dumb Components.

### 4.2 Thiết kế Component mỏng
Nếu file Component vượt quá **300 dòng mã (Lines of Code - LOC)**, bạn **BẮT BUỘC** phải rã Component ra.
- Chuyển toàn bộ các thẻ JSX lồng nhau thành các Component con riêng rẽ.
- Gom toàn bộ State và Context vào một Custom Hook (ví dụ `use...Manager`).

### 4.3 Cẩn trọng với `useEffect`
Cẩn trọng với `useEffect`. Thường thì 80% trường hợp lạm dụng `useEffect` có thể thay thế bằng:
1. Logic tính toán đồng bộ ngay lúc Render (Derived state).
2. Xử lý trực tiếp vào các Event Handlers (`onClick`, `onSubmit`).

**Quy tắc:** Đừng dùng `useEffect` để đồng bộ thủ công State A qua State B. Hãy dùng biến dẫn xuất (Derived Variables).
```tsx
// ❌ BAD: Dùng useEffect để đồng bộ logic đơn giản
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ GOOD: Derived state
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const fullName = `${firstName} ${lastName}`; // Tự động tính toán lại mỗi luồng render
```

---

## 5. QUẢN LÝ DỮ LIỆU & STATE MANAGEMENT

Dự án có tính toán y khoa phức tạp đòi hỏi nhiều cấp độ State khác biệt. Sự pha trộn sai lệch các State sẽ gây ra phình bộ nhớ và rò rỉ (memory leaks).

### 5.1 Phân vùng cấp độ State:
1. **Local State (`useState`, `useReducer`):** Dùng để xử lý đóng/mở Dropdown thả xuống, các state Modal nhỏ lẻ, Input typing. Luôn đặt state ở mức cây React thấp nhất có thể.
2. **Server State (Dữ liệu fetch từ API Backend):** 
   - ❌ Tuyệt đối không dùng cụm `useEffect` và `useState` thủ công để fetch data rườm rà (loading, error, set data).
   - ✅ Sử dụng Custom Hook đóng gói hoặc SWR/Tanstack React-Query để giải quyết việc memory cache, status loading, auto-retry, re-fetch tự động.
3. **Global UI/Domain State (`Zustand`):**
   - Dành cho các state cần chia sẻ cho toàn ứng dụng hoặc nhảy vượt component trees không quan hệ cha mẹ con.
   - Ví dụ: Thông tin hồ sơ Bệnh nhân (`patientStore`), trạng thái Cảnh báo chung toàn hệ thống, danh sách Tọa độ Điểm Chuẩn (`landmarkStore`).

### 5.2 Xây Dựng Zustand Store
Khi thiết lập một store `zustand` toàn cục, tuân theo quy tắc Single Responsibility (Trách nhiệm đơn định).
- Tách `patientStore` độc lập với `aiAssistantStore`. Không ôm đồm các biến chung vào 1 file duy nhất.
- Hỗ trợ TypeScript chặt chẽ cho interface của Store.

---

## 6. LẬP TRÌNH TYPESCRIPT VÀ ĐỊNH NGHĨA DỮ LIỆU (TYPING)

Typescript là bộ áo giáp chống lỗi cho dự án này. Code gõ không định nghĩa Data Type rõ ràng sẽ bị chặn merge.

### 6.1 Sử dụng `Interface` thay vì `Type` cho Object Collections
Để tổ chức mã được rõ ràng, ưu tiên `interface` để khái quát hóa cấu trúc hướng đối tượng Component.
```typescript
// ✅ GOOD: Interface cho việc mở rộng dễ dàng
export interface IPatientRecord {
  id: string;
  name: string;
  dateOfBirth: string;
}

export interface IExtendedPatientRecord extends IPatientRecord {
  medicalHistory: string[];
}
```

### 6.2 Tuyệt đối tránh Any (Ngoại trừ Unsafe Testing)
Khai báo dạng `any` là hành động vô hiệu hóa Type System, tạo ra các bug ngầm.
- Nếu không biết Type trả về từ Server API, hãy dùng `unknown` và viết type-guard logic hoặc validate bằng Zod trước khi lấy xài.
```typescript
// ❌ BAD
const handleResponse = (data: any) => { console.log(data.id) }

// ✅ GOOD 
const handleResponse = (data: unknown) => {
   if (typeof data === 'object' && data !== null && 'id' in data) {
      console.log(data.id);
   }
}
```

### 6.3 Hướng dẫn tổ chức Types
- Bệnh của Component thì gắn type cục bộ ở đầu File.
- Feature domain Type (vd: loại Răng, thông số Angle Ceph) để ở `src/features/[feature]/types.ts`.
- Mẫu API generic error chung chung đặt tại `src/shared/types/api.ts`.
- Không lạm dụng export global dts (`.d.ts`) ở thư mục ngoài để gắn biến môi trường, trừ phi thực sự bất đắc dĩ.

---

## 7. QUY CHUẨN STYLING (TAILWIND CSS)

Đây là dự án dùng Tailwind CSS. Nó rất nhanh nhưng rất dễ để biến thành "đống mỳ Ý".

### 7.1 Chuẩn Hoá Class Mạng (ClassName Composition)
Khi cấu tạo mảng class bị thay đổi qua Prop boolean, bắt buộc dùng `cn` utility (hàm kết hợp của clsx và tailwind-merge) để mix rules, thay vì string templates lồng dấu ngoặc kép.
```tsx
// ❌ BAD
<button className={`p-4 rounded ${isActive ? 'bg-blue-500' : 'bg-gray-100'} ${disabled && 'opacity-50'}`} />

// ✅ GOOD 
import { cn } from "@/shared/lib/utils";

<button className={cn(
  "p-4 rounded transition-all outline-none",
  isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800",
  disabled && "opacity-50 cursor-not-allowed pointer-events-none"
)} />
```

### 7.2 Không Override Hard-coded (Cấm Fixed Colors/Pixels)
- Mã màu tĩnh (`bg-[#E2A123]`), tỷ lệ pixel cụ thể (`w-[258px]`) hạn chế dùng trực tiếp trên file JSX trừ phi là ảnh/banner tĩnh duy nhất biệt lập.
- Ghi danh toàn bộ Primary, Secondary rules, Font Sizes qua file cấu hình `tailwind.config.ts`.
- Dùng CSS Variables ở Root để hỗ trợ Dark Mode khi cần.

---

## 8. XỬ LÝ CANVAS ENGINE (EPIC TƯƠNG TÁC HÌNH HỌC)

Module này vô cùng nhạy bén vì độ rủi ro giật lag (stuttering frames) do Render Re-draw liên tục. Mọi tương tác ảnh y khoa (X-ray, Facial) bắt buộc theo chuẩn Canvas Rendering Context:
1. **Cô lập Ref DOM:** React Re-Render rất tệ với thao tác kéo thả 60FPS. Các thao tác vẽ phải dùng `canvasRef` can thiệp thẳng qua `CanvasRenderingContext2D`.
2. **State Toạ Độ (Coord Coordinates):** Dữ liệu nguồn của các Điểm móc mốc (Anchor LandMarks) phải lưu trong Local Data Structure hoặc Zustand trước. Hệ thống chỉ búng (flush) tọa độ đó xuống Engine vẽ thuần.
3. Không thực hiện phép tính `Math.sin`/`Math.cos` lớn trực tiếp trong vòng lặp Event MouseMove, tránh bóp nghẹt Call Stack của Browser. Cần implement hàm `debounce` hoặc `requestAnimationFrame`.

---

## 9. CÁC QUY TẮC HIỆU SUẤT (PERFORMANCE & OPTIMIZATION)

1. **Memoization cẩn trọng:** Đừng lồng `useMemo` và `useCallback` vào mọi thứ. Chỉ bọc lại nếu bạn phải truyền Array/Object xuống một Element con đã được memo, hoặc chạy một logic vòng lặp filter array phức tạp. 
2. **Dynamic Imports / Code Splitting:** 
   - Với trang có các Modun rất nặng như xem View 3D `.obj, .stl`, tải engine `three.js`.
   - Trang xử lý hình nhúng nhiều Component lớn. 
   - Hãy dùng `React.lazy()` và cú pháp `Suspense` để ngắt nhỏ Bundle tĩnh, hỗ trợ Time to Interactive nhanh nhất khi khách xem các layout nhẹ trước.
3. **Quản lý Hình ảnh rác:** Các tính năng `fakeLoadImages` hay chọn ảnh X-Quang sẽ cấp phát Buffer RAM qua `URL.createObjectURL`. Developer nào khai báo dòng này bắt buộc phải tạo Hook hoặc Cleanup Function dùng `URL.revokeObjectURL(url)` để thả RAM. Không để hệ thống bị treo đơ nếu người bệnh test thử 50 cái ảnh khác nhau!!

---

## 10. CLEAN CODE PRINCIPLES (THÓI QUEN SẠCH)

1. **Early Return:** Đừng tạo những cấu trúc lồng `if-else` vào hốc.
```typescript
// ❌ BAD
const uploadFile = (file) => {
  if (file) {
     if (file.type === "image/png") {
        if (file.size < 50000) {
            // Processing...
        }
     }
  }
}
// ✅ GOOD
const uploadFile = (file) => {
  if (!file) return;
  if (file.type !== "image/png") return showError("Not PNG");
  if (file.size >= 50000) return showError("Over limit");
  // Processing...
}
```
2. **Loại bỏ Magic Numbers:** Con số nằm chơ vơ trong code mà không có tên sẽ bị reject PR. Đặt ra các constant `MAX_LANDMARKS_COUNT = 3;`, `UPLOAD_DELAY_MS = 500;`.
3. **Comments:** Viết Comment để giải thích **WHY (TẠI SAO)** cái dòng code chắp vá này phải trông dị dạng thế này chứ không phải chú giải dòng gán biến `a = b`. Đặc biệt cần viết nhiều comment tại Folder `core/geometry/` để các kỹ sư sau này đọc vào Lượng giác/Đại số Tuyến tính khỏi bị xoắn não.

---

## 11. HỆ THỐNG XỬ LÝ LỖI (ERROR HANDLING)

Không có gì tồi tệ hơn việc App sập màn hình trắng xoá không rõ nguyên do.
1. **API Error Handling:** Component không được tự mình bắt Block `try { axios } catch (e) { alert(...) }`. Trả Exception về Service Layer. Hook `useQuery...` nên cung cấp Error Text chuẩn để đổ về Toast.
2. **Global Error Boundaries:** Các Module lớn hoặc Pages sẽ bọc qua thẻ `ErrorBoundary` để đảm bảo nếu cái Widget UI bị lỗi render thì chỉ crash 1 block trên màn hình thay vì trắng xoá sạch toàn hệ thống điều trị.

---

## 12. QUY TRÌNH PHÁT TRIỂN & REVIEW CODE (WORKFLOW)

- Khi cần đẩy Code (Commit), Message phải ghi theo chuẩn Angular Guidelines rõ ràng và có cụm tag phía trước:
  `feat: add interactive canvas scaling in ceph domain`
  `fix: bug missing landmark point calculation index out of bound`
  `refactor: extract image upload state to hook in feature layer`
  `docs: update architecture convention regarding testing`
- Mọi PR (Pull Request) tuyệt đối phải qua các Check-list tự đánh giá:
  1. File đã tách qua Tái Cấu Trúc chuẩn Feature-Sliced. Dừng ngay việc đẩy everything vào components/?
  2. Bất kì Component UI nào có vượt mức 300 dòng và logic chưa nằm trong các Custom Hooks không?
  3. Tôi có đang xài biến `any` bừa phứa ở đâu đó không?
  4. Quá trình Leak Ram có bị khoá lại chưa bằng URL revoke chưa?

---

### TỔNG KẾT BẢN QUY CHUẨN KỸ THUẬT

Tài liệu này không chỉ là định hướng, mà là **Công cụ kiểm soát lỗi bắt buộc** cho toàn thể dự án. 
Bất kỳ cá nhân nào, hệ thống biên dịch AI sinh tự động nào... mọi lúc xử lý xây dựng Code mới hay tiến hành cải tạo Refactor, đều phải lấy văn bản này làm mỏ neo kiểm soát. 
Layer phân ra rõ rệt (Core tách khỏi Feature Hook, View tách khỏi State).

Chúc hệ thống chẩn đoán của chúng ta thành công.
*Version 1.0.0 - Approved by Core Engineering Team.*
