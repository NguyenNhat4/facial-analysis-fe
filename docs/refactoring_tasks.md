# Kế hoạch Refactor Dự án UI Tooth AI (Theo chuẩn FSD & Best Practices)

Dưới đây là danh sách các task (công việc) được chia thành từng giai đoạn (Phases) để bạn dễ dàng theo dõi và tạo ticket (trên GitHub/Jira). Việc refactor nên được làm từng bước để đảm bảo ứng dụng vẫn chạy được ở cuối mỗi Phase.

---

## Phase 1: Chuẩn hóa Kiến trúc Thư mục (Feature-Sliced Design)
*Mục tiêu: Đưa source code hiện tại về đúng chuẩn FSD, dọn dẹp các module nằm rải rác.*

- [ ] **Task 1.1: Tạo các thư mục gốc theo chuẩn FSD**
  - Tạo các thư mục nếu chưa có: `src/app`, `src/pages`, `src/features`, `src/entities`, `src/shared`, `src/core`.
- [ ] **Task 1.2: Cấu trúc lại `src/shared`**
  - Di chuyển các UI component dùng chung (Button, Modal, Input, Card...) vào `src/shared/ui`.
  - Di chuyển các hàm tiện ích chung (format date, xử lý chuỗi) vào `src/shared/utils`.
  - Di chuyển cấu hình Firebase, API Config vào `src/shared/lib`.
- [ ] **Task 1.3: Cấu trúc lại `src/app` và `src/pages`**
  - Đưa cấu hình Router, Global Providers (Zustand/Redux Provider, QueryClientProvider, AuthProvider) và `index.css` vào `src/app`.
  - Đảm bảo `src/pages` chỉ chứa các trang chính (như `DashboardPage`, `AnalysisWorkspacePage`), các trang này làm nhiệm vụ "lắp ráp" (compose) các tính năng từ `src/features`.
- [ ] **Task 1.4: Phân chia lại `src/features`**
  - Rà soát lại `src/features/cephalometric`. Đảm bảo nó chỉ chứa Logic và UI *cụ thể* cho việc phân tích sọ nghiêng.
  - Tách các tính năng riêng biệt (nếu đang bị trộn lẫn) thành: `features/landmark-detection`, `features/patient-management`.

---

## Phase 2: Tách biệt Core Logic (Thuật toán Y khoa) & Viết Unit Test
*Mục tiêu: Đảm bảo phần tính toán các chỉ số (Steiner, Downs...) độc lập hoàn toàn với UI và chạy chính xác 100%.*

- [ ] **Task 2.1: Chuẩn hóa `src/core/geometry` và `src/core/diagnostic`**
  - Đảm bảo các hàm trong này nhận đầu vào là tọa độ/giá trị thô (Ví dụ: `Point`, `number`) và trả ra kết quả thuần túy (không dính dáng đến React Hooks hay State).
- [ ] **Task 2.2: Định nghĩa Type chặt chẽ cho Entities**
  - Tạo `src/entities/landmark/model/types.ts`. Định nghĩa rõ các mốc: `type LandmarkName = 'Sella' | 'Nasion' | 'PointA' | ...`
  - Định nghĩa chuẩn `type Point = { x: number, y: number }`.
- [ ] **Task 2.3: Setup Vitest và viết Unit Test cho Core Math**
  - Cài đặt `vitest` (nếu chưa có).
  - Viết test cho `src/core/geometry` (kiểm tra hàm tính góc giữa 3 điểm, khoảng cách giữa 2 điểm).
  - Viết test cho `src/core/diagnostic` (truyền tọa độ giả mốc lý tưởng, assert kết quả Steiner ra các chỉ số SNA, SNB chuẩn).

---

## Phase 3: Quản lý State Hiệu suất cao (Real-time Interaction)
*Mục tiêu: Xử lý bài toán giật lag khi kéo thả (drag) các điểm mốc trên màn hình.*

- [ ] **Task 3.1: Chuyển đổi State Điểm mốc sang Zustand**
  - Xóa bỏ việc dùng `useState` ở các component cấp cao để lưu tọa độ điểm mốc.
  - Tạo một store bằng Zustand: `src/features/cephalometric/stores/useLandmarkStore.ts`.
  - Cung cấp các action: `updateLandmark(id, x, y)`, `resetLandmarks()`.
- [ ] **Task 3.2: Tối ưu Cập nhật Chỉ số (Throttling/Debouncing)**
  - Logic tính toán chỉ số (Steiner, McNamara...) chỉ nên được kích hoạt:
    - Cách 1 (Throttle): Tối đa 30-50ms một lần khi đang kéo thả (dragMove).
    - Cách 2 (On Drag End): Chỉ tính toán khi người dùng thả chuột ra (dragEnd) nếu thuật toán quá nặng.
- [ ] **Task 3.3: Memoize các UI Kết quả**
  - Bọc các component hiển thị bảng kết quả chỉ số y khoa bằng `React.memo`. Chỉ render lại khi các chỉ số thực sự thay đổi (giảm chi phí render khi người dùng đang drag nhưng thông số chưa thay đổi).

---

## Phase 4: Tái cấu trúc Canvas (react-konva)
*Mục tiêu: Xây dựng vùng làm việc phân lớp (Layering) chuẩn xác.*

- [ ] **Task 4.1: Chuyển đổi sang `react-konva` (nếu đang dùng HTML5 Canvas/SVG thuần)**
  - Cài đặt `konva` và `react-konva`.
- [ ] **Task 4.2: Thiết lập Kiến trúc Layer**
  - Tạo `ImageLayer`: Chỉ hiển thị ảnh X-Quang, luôn tĩnh (Static).
  - Tạo `LineLayer`: Hiển thị các đường nối đo đạc, subscribe vào state của mốc tọa độ.
  - Tạo `LandmarkLayer`: Chứa các `Circle` (Điểm mốc) có thuộc tính `draggable=true`. Lắng nghe sự kiện `onDragMove` để dispatch action lên Zustand store.

---

## Phase 5: Chuẩn bị Hạ tầng cho Mở rộng (Chatbot & Data Collection)
*Mục tiêu: Thiết kế sẵn các Interface/API để dễ dàng gắn các tính năng tương lai vào.*

- [ ] **Task 5.1: Xây dựng luồng Data Collection (Feedback Loop)**
  - Trong `src/features/cephalometric`, thêm nút bấm "Lưu & Cập nhật Dữ liệu Huấn luyện".
  - Tạo hàm API (trong `src/shared/api`) nhận Payload: `[imageId, originalLandmarks, correctedLandmarks, doctorId]`. Tạm thời log ra console hoặc lưu vào Firebase Firestore collection `retraining_data`.
- [ ] **Task 5.2: Khởi tạo khung Chatbot Context-Aware**
  - Tạo `src/features/chatbot/components/FloatingChatbot.tsx`.
  - Khởi tạo `useChatbotStore` để mở/đóng cửa sổ chat.
  - Viết logic "gom Context": Viết một helper function đọc trạng thái từ `useLandmarkStore` (danh sách các chỉ số hiện tại) để đính kèm vào phần ẩn (System Prompt) khi gọi API LLM (Gemini/ChatGPT) sau này.

---

## Lời khuyên khi thực hiện:
1. **Làm đến đâu Commit đến đó:** Tạo nhánh (branch) riêng cho từng Phase (VD: `refactor/phase-1-folder-structure`).
2. **Ưu tiên Phase 2 & 3:** Tính toán Core Logic và quản lý State bằng Zustand là 2 phần khó nhất và ăn điểm nhất trong đồ án, hãy ưu tiên làm trước.
