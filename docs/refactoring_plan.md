# Kế Hoạch Tái Cấu Trúc (Refactoring Plan) - UI Tooth AI

## 1. Đánh giá hiện trạng (Current State Analysis)
Qua phân tích cấu trúc dự án hiện tại, mã nguồn đang gặp phải một số vấn đề nguyên khối (Monolithic) phổ biến:
- **Tập tin quá lớn (God components):** `src/pages/demo.tsx` dài hơn 1300 dòng, chứa đa dạng logic từ hiển thị UI, quản lý state (tải ảnh, form, data bệnh nhân), logic kiểm duyệt tên file, cho tới mô phỏng AI nghĩ.
- **Tính kết dính cao (High Coupling):** UI và Logic nghiệp vụ đang buộc chặt với nhau. Ví dụ: logic upload ảnh, tách file nằm ngay trong component thay vì được tách ra các helper/services. 
- **Thiếu module hóa Domain logic:** Code tính toán cephalometric (ví dụ `ceph-analysis.tsx`) lệ thuộc vào các biến `window` toàn cục thay vì sử dụng cơ chế import/export an toàn của TypeScript.
- **Quản lý State phức tạp:** Sử dụng quá nhiều `useState`, `useEffect` ở cấp cao nhất dẫn dến khó khăn trong việc mở rộng và duy trì (maintain).

### Mục tiêu Tái cấu trúc
Chuyển đổi từ mô hình "Smart Component" sang kiến trúc hướng Module (Feature-Sliced Design) hoặc Layered Architecture, tách rời **Giao diện (UI)**, **Quản lý Trạng thái (State)**, và **Logic Nghiệp vụ (Domain)**. 

---

## 2. Kế hoạch triển khai theo tính năng cốt lõi (Epics)

### Epic 1: Giao diện tương tác và Xử lý Landmark
*Phần này tập trung vào việc hiển thị ảnh, nhận dữ liệu AI và cho phép người dùng thao tác trực tiếp.*

**Vấn đề hiện tại:** Canvas và thao tác với landmark đang bị nhúng trực tiếp trong trang `ceph-analysis.tsx` (state landmarks, scale, render drawing). Điều này khiến việc mở rộng (như zoom/pan ảnh, undo/redo thao tác) gặp khó khăn.

**Hành động tái cấu trúc:**
1. **Tách biệt Canvas Engine:**
   - Xây dựng một Custom Component chuyên biệt (ví dụ: `InteractiveCanvas.tsx` hoặc sử dụng thư viện như `konva` / `fabric.js`) chỉ nhận `props` là hình ảnh và danh sách tọa độ (landmarks), và phát ra các sự kiện `onPointDrag`, `onPointClick`.
2. **Quản lý State cho Editor:** 
   - Sử dụng mô hình quản lý state cục bộ mạnh mẽ (như Zustand hoặc `useReducer` thay vì `useState` thông thường) cho việc chỉnh sửa tọa độ landmark. Hỗ trợ các tính năng Undo/Redo.
3. **Module hóa Khâu Nhập/Xuất Dữ liệu:**
   - Đưa logic upload ảnh, validate folder case và API gọi AI ra các services riêng biệt (vd: `src/services/image-upload.ts`, `src/services/ai-prediction.ts`).
   - Tối giản hóa file UI, chỉ để UI gọi hàm `handleUpload` từ custom hook.

### Epic 2: Tính toán Hình học & Tự động hóa Chẩn đoán
*Biến các tọa độ tĩnh thành thông số y khoa có ý nghĩa và xuất báo cáo.*

**Vấn đề hiện tại:** Logic tính toán đang phụ thuộc vào external scripts nạp qua thẻ `<script>` (`measurements-config.js`, `calculations.js`) và gán vào đối tượng `window`.

**Hành động tái cấu trúc:**
1. **Chuyển đổi hoàn toàn sang TypeScript (Domain Layer):** 
   - Di chuyển các công thức tính góc, tính khoảng cách vào các utility thuần (Pure Functions) ở thư mục `src/core/math` hoặc `src/domain/cephalometric`. Không sử dụng side-effects.
   - Định nghĩa chặt chẽ `interfaces` cho các `Measurement`, `Landmark`, hỗ trợ type-hinting toàn dự án.
2. **Xây dựng Diagnostic Engine:**
   - Một Service tự động nhận đầu vào là mảng tọa độ (x,y), chạy qua luồng các phép đo chuẩn y khoa và ra kết quả (JSON Object) độc lập hoàn toàn với React.
3. **Tự động hoá Báo cáo (Report Service):**
   - Xây dựng component `ReportGenerator` để ánh xạ kết quả từ Diagnostic Engine thành các cảnh báo chẩn đoán: `normal`, `moderate`, `severe`.
   - Cung cấp tính năng xuất file (PDF/Excel) nằm gọn trong `src/services/export.ts`.

### Epic 3: Tích hợp Trợ lý AI (AI Assistant)
*Biến các con số khô khan thành bối cảnh hội thoại.*

**Vấn đề hiện tại:** Xử lý hội thoại AI chưa liên kết chặt chẽ với logic chẩn đoán thực tế, hoặc có thể đang lồng ghép phân tán và không tái sử dụng được.

**Hành động tái cấu trúc:**
1. **Đóng gói AI Context Store:**
   - Tạo một Global Store (Zustand hoặc React Context) gom bối cảnh hiện tại: *thông tin bệnh nhân*, *danh sách landmark*, và *kết quả từ Epic 2*.
   - Khởi tạo bộ phận "Prompt Builder" để tự động soạn thảo cấu trúc dữ liệu y khoa tĩnh thành prompt dạng văn bản ngầm trước khi gửi cho LLM.
2. **Xây dựng AI Chat Widget độc lập:**
   - Gom các element nhắn tin (Chat) thành phần tử tái sử dụng `ChatWidget`. Component này có thể pop-up ở bất kỳ đâu trên màn hình, đọc thông tin từ AI Context Store để luôn nắm rõ bối cảnh trang mà ngươì dùng đang xem mà không cần phải truyền `props` rườm rà.
3. **Stream data và UI lồng ghép:**
   - Xử lý streaming response từ Assistant, mapping lời giải thích từ text sinh ra với các highlight ngay trên hình ảnh.

---

## 3. Kiến nghị Cấu trúc Thư mục Mới

```text
src/
├── app/               # Logic khởi tạo ứng dụng gốc (App.tsx, setup, routing)
├── core/              # Thuật toán thuần và Data Domain (Epic 2)
│   ├── geometry/      # Các thuật toán tính góc, tọa độ
│   └── diagnostic/    # Engine ánh xạ số liệu thành kết luận lâm sàng
├── features/          # Cấu trúc feature-sliced (các module chính)
│   ├── imaging/       # (Epic 1) Xử lý ảnh: Uploader, InteractiveCanvas, Zoom`
│   ├── cephalometric/ # (Epic 2) Bảng chỉ số, report PDF
│   └── ai-assistant/  # (Epic 3) Các view chat, prompt builders, api connection
├── shared/            # Tái sử dụng chung cho toàn project
│   ├── components/    # (Button, Card, Modal, UI atoms - Shadcn UI)
│   ├── hooks/         # Custom hoooks
│   ├── lib/           # Utils
│   └── stores/        # Zustand stores global (Auth, PatientInfo)
└── pages/             # Layout view. Giữ file cực kỳ mỏng, chỉ dùng để gọi các Feature
```

## 4. Các bước thực thi (Roadmap)
- **Phase 1:** Dọn dẹp `demo.tsx` – Tách tất cả các state upload ảnh và mock data ra custom hooks/services. Rút gọn file UI.
- **Phase 2:** Typify & Migrate Core (Epic 2) – Port các logic ngoại trú (`window.calculations`) vào thành mã TypeScript chuẩn nội bộ.
- **Phase 3:** Xây dựng `InteractiveCanvas` (Epic 1) với state manager tách biệt hoàn toàn chuyên cho việc kéo thả tọa độ landmark.
- **Phase 4:** Tích hợp `AI Assistant` (Epic 3), kết nối "Diagnostic Engine" với "Prompt Builder" đẩy về backend LLM.
