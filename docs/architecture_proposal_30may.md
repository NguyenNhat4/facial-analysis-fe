# Đề xuất Kiến trúc & Best Practices cho Ứng dụng Nha khoa AI

Dựa trên yêu cầu của bạn về một hệ thống hỗ trợ chẩn đoán nha khoa/hàm mặt (ứng dụng AI HRNet, tính toán chỉ số, tương tác real-time, và hướng mở rộng Chatbot/Retrain), dưới đây là bản đề xuất tái kiến trúc Frontend và các **Best Practices** phù hợp, giúp dự án đồ án tốt nghiệp của bạn vừa chuyên nghiệp, vừa đạt điểm cao ở tiêu chí kỹ thuật.

---

## 1. Tái kiến trúc Frontend (Frontend Architecture Refactoring)

Hiện tại, source code của bạn đang có cấu trúc chia theo `features/`. Đây là một khởi đầu rất tốt. Để dự án scale tốt hơn và rõ ràng hơn khi bảo vệ đồ án, bạn nên chuẩn hóa theo **Feature-Sliced Design (FSD)** hoặc kiến trúc Modular rõ ràng.

### Cấu trúc thư mục đề xuất:

```text
src/
├── app/               # Thiết lập ứng dụng, global providers (QueryClient, Auth), global styles, router
├── pages/             # Các trang chính (Dashboard, PatientDetail, AnalysisWorkspace)
├── features/          # Chứa các chức năng nghiệp vụ cụ thể (Tính đóng gói cao)
│   ├── landmark-detection/ # Xử lý ảnh, gọi API HRNet nhận điểm
│   ├── cephalometric/      # (Đã có) Xử lý logic đo đạc Steiner, Downs...
│   ├── chatbot/            # (Mở rộng) UI và logic của trợ lý ảo AI
│   └── data-collection/    # (Mở rộng) Tính năng save/submit ảnh đã tinh chỉnh để retrain
├── entities/          # (Tùy chọn) Chứa Domain Models (Interface, Types) và trạng thái toàn cục của thực thể
│   ├── patient/
│   └── analysis-result/
├── shared/            # Các UI components dùng chung (Button, Modal...), Utils, Hooks
│   ├── ui/                 # Component UI từ Shadcn/Tailwind
│   ├── lib/                # Cấu hình Firebase, Axios/Fetch config
│   └── utils/              # Các hàm toán học, xử lý chuỗi
└── core/              # Các thuật toán lõi, hoàn toàn độc lập với React
    └── math-engines/       # Thuật toán tính góc, khoảng cách, chuyển đổi pixel sang mm
```

### Kiến trúc Luồng Dữ liệu (Data Flow) trong Module Phân tích

Đây là module quan trọng nhất (Hiển thị ảnh -> Nhận diện -> Kéo thả -> Cập nhật chỉ số).

1. **Canvas Layering:** Sử dụng thư viện như `react-konva` để quản lý hiển thị.
   - *Layer 1:* Ảnh gốc (X-Quang/Ảnh mặt).
   - *Layer 2:* Các đường thẳng/góc đo đạc (Cập nhật dựa trên tọa độ mốc).
   - *Layer 3:* Các điểm mốc (Landmarks) có thể kéo thả (Draggable).
2. **State Management:**
   - Dùng **Zustand** cho việc lưu trữ tọa độ điểm mốc. Tại sao? Khi bạn kéo thả ở tốc độ 60fps, dùng React Context hoặc Redux có thể gây re-render toàn bộ giao diện làm giật lag. Zustand cho phép cập nhật state ngầm và chỉ re-render những component nào subscribe vào tọa độ đang thay đổi.
   - Dùng **React Query (TanStack Query)** cho các thao tác Fetch API (Tải thông tin bệnh nhân, gọi model HRNet).

---

## 2. Các Best Practices (Tiêu chuẩn Kỹ thuật nên áp dụng)

Để một đồ án tốt nghiệp ghi điểm tối đa về mặt "Software Engineering", bạn nên áp dụng các tiêu chuẩn sau:

### 2.1. Tách biệt Logic Nghiệp vụ (Clean Architecture & Domain Logic)
- **Vấn đề:** Các thuật toán tính Steiner, Downs, McNamara chứa rất nhiều phép tính hình học (vector, góc). Nếu bạn để logic này chung với React Component, file sẽ rất dài và khó test.
- **Giải pháp:** Tách hoàn toàn ra các file TypeScript thuần (`src/core/math-engines/...`).
- **Ăn điểm:** Viết **Unit Tests (Vitest/Jest)** cho các hàm tính toán này (vd: truyền tọa độ giả, assert góc ra đúng x độ). Hội đồng sẽ đánh giá rất cao việc bạn có test cover cho logic lõi Y khoa.

### 2.2. Tối ưu Hiệu năng Render (Performance Optimization)
Chức năng kéo thả (Drag) điểm mốc yêu cầu Real-time:
- Sử dụng `requestAnimationFrame` hoặc cơ chế throttle (khoảng 16ms - 30ms) khi bắn event cập nhật tọa độ lúc drag để tránh tính toán lại các chỉ số y khoa quá nhiều lần mỗi mili-giây.
- Sử dụng `React.memo` cho các phần tử UI hiển thị kết quả. Nếu tọa độ thay đổi nhưng giá trị góc/chỉ số không đổi, UI đó không cần render lại.

### 2.3. Quản lý Type chặt chẽ (TypeScript)
- Định nghĩa rõ ràng `Type` hoặc `Interface` cho các điểm giải phẫu (Sella, Nasion, Point A, Point B...). Đừng dùng mảng chung chung như `[x, y][]`. Hãy dùng `Record<LandmarkType, Point>` để code tự document (tự giải thích nội dung).

---

## 3. Định hướng cho các tính năng Mở rộng

### 3.1. Tính năng Tinh chỉnh và Lưu dữ liệu (Data Feedback Loop cho Retraining)
Hội đồng sẽ rất thích tính năng "Human-in-the-loop" (Con người hỗ trợ AI tốt lên).
- **Luồng hoạt động:** 
  1. AI dự đoán điểm.
  2. Bác sĩ thấy sai lệch và kéo thả lại cho đúng.
  3. Bác sĩ bấm "Lưu kết quả & Gửi làm dữ liệu huấn luyện".
- **Kiến trúc FE:** Tạo một Payload chuẩn hóa bao gồm: `[Image_ID, Original_AI_Landmarks, Doctor_Corrected_Landmarks, Doctor_ID]`. Gửi Payload này về Backend (Firebase Firestore hoặc DB riêng) vào một bảng `Retrain_Queue`.

### 3.2. Tích hợp Chatbot Y khoa
- **Kiến trúc:** Chatbot có thể là một Floating Widget (luôn nổi ở góc phải dưới).
- **Context-Aware:** Để chatbot thông minh, Frontend cần thiết kế cơ chế inject "Context" hiện tại vào prompt của Chatbot. 
  - *Ví dụ:* Khi bác sĩ đang xem bệnh nhân A, chỉ số Steiner SNA đang là 88 (nhô hàm trên). Khi bác sĩ chat "Gợi ý phác đồ điều trị?", Frontend sẽ tự động lấy thông tin bệnh án và các chỉ số sai lệch gài vào prompt ẩn gửi cho LLM. (Dùng Zustand để Chatbot đọc được trạng thái kết quả phân tích hiện tại).

### 3.3. Tích hợp Phía Bệnh nhân (Patient Portal)
- Trong tương lai, nếu có web cho bệnh nhân xem, bạn nên thiết lập cấu trúc **Monorepo** (ví dụ dùng Turborepo) chia làm `apps/doctor-portal` và `apps/patient-portal`, chia sẻ chung các thư viện như `packages/ui` hay `packages/core-logic`. Hoặc với quy mô đồ án, có thể cấu hình Role-based Access Control (RBAC) bằng Firebase Auth để chia luồng UI hiển thị theo Role (Bác sĩ / Bệnh nhân).
