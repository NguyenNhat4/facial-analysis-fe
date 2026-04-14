Chào bạn, với danh sách landmark từ 2 API mà bạn vừa cung cấp, chúng ta đã có một nền tảng dữ liệu rất rõ ràng. Để hệ thống của bạn tự động tính ra các chỉ số khớp với tiêu chuẩn luận án, tôi sẽ hướng dẫn chi tiết cách ghép nối các điểm này thành **góc (angle)** và **khoảng cách (distance)**.

Tôi sẽ chia làm 2 phần tương ứng với 2 API của bạn để Team Dev dễ dàng ánh xạ vào code.

---

### A. Tính toán từ Cephalometric X-Ray API (18 Landmarks)
API này chịu trách nhiệm chính cho các chỉ số Xương, Răng và một phần Mô mềm.

#### 1. Nhóm cấu trúc Xương (Skeletal)
* **Góc SNA:**
    * **Cách tạo:** Góc giữa hai đoạn thẳng `N-S` và `N-A`. Đỉnh góc tại `N`.
* **Góc SNB:**
    * **Cách tạo:** Góc giữa hai đoạn thẳng `N-S` và `N-B`. Đỉnh góc tại `N`.
* **Góc ANB:**
    * **Cách tạo:** `SNA - SNB` (hoặc góc giữa `N-A` và `N-B`).
* **Mặt phẳng hàm dưới (Mandibular Plane - MP):**
    * **Cách tạo:** Kẻ đường thẳng đi qua `go` (Gonion) và `Me` (Menton) hoặc `Gn` (Gnathion).

#### 2. Nhóm trục Răng (Dental)
* **IMPA (Góc răng cửa dưới - i/MP):**
    * **Cách tạo:** Góc giữa trục răng cửa dưới (đường nối `LIA` đến `i`) và Mặt phẳng hàm dưới (MP) vừa tạo ở trên. Giao điểm là đỉnh góc.
* **U1 - NA (Độ nghiêng & Khoảng cách):**
    * **Góc:** Góc giữa trục răng cửa trên (đường nối `UIA` đến `I`) và đường thẳng `N-A`.
    * **Khoảng cách:** Kẻ đường vuông góc từ điểm `I` (Cạnh cắn trên) tới đường thẳng `N-A`.
* **L1 - NB (Độ nghiêng & Khoảng cách):**
    * **Góc:** Góc giữa trục răng cửa dưới (đường nối `LIA` đến `i`) và đường thẳng `N-B`.
    * **Khoảng cách:** Kẻ đường vuông góc từ điểm `i` (Cạnh cắn dưới) tới đường thẳng `N-B`.

#### 3. Nhóm thẩm mỹ (Aesthetics)
* **Góc Z (Z-Angle):**
    * **Mặt phẳng Frankfort (FH):** Đường nối `Po` và `Or`.
    * **Đường Profile:** Nối từ `Pg'` (Cằm mềm) tiếp tuyến với điểm nhô nhất của môi (chọn điểm có tọa độ x lớn hơn giữa `ls` và `li` - giả định hướng mặt quay sang phải).
    * **Góc:** Góc tạo bởi FH và Đường Profile.
* **Ls-E và Li-E (Khoảng cách môi đến đường E):**
    * **Đường E (E-line):** Nối `Pn` (Đỉnh mũi) và `Pg'` (Cằm mềm).
    * **Ls-E:** Khoảng cách vuông góc từ `ls` đến đường E.
    * **Li-E:** Khoảng cách vuông góc từ `li` đến đường E.
    * *Lưu ý cho Dev (Quan trọng):* Cần set biến dấu (âm/dương). Nếu môi nằm phía trước đường E (cùng phía với chóp mũi) là dấu dương (+). Nếu môi lùi sau đường E là dấu âm (-). Đây là key để khớp với kết quả Nữ Việt Nam có Ls-E = -0.21mm.

---

### B. Tính toán từ Facial Analysis API (8 Landmarks)
API này chuyên xử lý ảnh chụp mặt nghiêng (Profile photo) khi không có X-quang. Luận án cũng có đo đạc trên ảnh chụp ngoài mặt nên bạn hoàn toàn có thể dùng các điểm này để đánh giá thẩm mỹ.

* **Khoảng cách môi đến đường E (Ls-E & Li-E):**
    * Làm tương tự X-ray: Dùng `Pronasal` và `Pog'` tạo đường E. Tính khoảng cách vuông góc từ `Labiale sup` và `Labiale inf` đến đường này.
* **Góc lồi mặt mô mềm (N'-Sn-Pog'):**
    * **Cách tạo:** Góc giữa đường `N'` (Gốc mũi mềm) đến `Subnasale` (Dưới mũi) và đường `Subnasale` đến `Pog'` (Cằm mềm). Đỉnh góc tại `Subnasale`.
    * **Ý nghĩa:** Đánh giá độ nhô của toàn bộ khuôn mặt (Tương ứng với chỉ số $n-sn-pg$ trong luận án).
* **Góc môi cằm (Li-B'-Pog'):**
    * **Cách tạo:** Góc nối từ `Labiale inf` đến `B'` (Điểm lõm nhất cằm mềm) và từ `B'` đến `Pog'`. Đỉnh tại `B'`.
    * **Ý nghĩa:** Xác định bệnh nhân bị lẹm cằm hay cằm nhô. Luận án đặc biệt nhấn mạnh góc này ở nam (132 độ) và nữ (130 độ) người Việt. Nữ thường có cằm lẹm hơn (điểm B' lõm hơn).

---

### C. ⚠️ Lưu ý mấu chốt: Sự vắng mặt của điểm `Cm` (Columella)
Cả 2 API của bạn hiện tại **vẫn chưa trả về điểm `Cm` (Chân mũi/Trụ mũi)**. Điều này đồng nghĩa với việc bạn **không thể tính Góc mũi môi (Nasolabial Angle)** chính xác theo chuẩn y khoa (đỉnh tại `Sn`, 2 cạnh đi qua `Cm` và `ls`).

**Phương án khắc phục (Workaround) cho Team Dev:**
Nếu chưa thể train lại model ngay lập tức để nhận diện `Cm`, bạn có thể dùng một công thức thay thế gần đúng (Approximation) phổ biến trong phân tích ảnh mặt ngoài:
* **Góc mũi môi thay thế:** Tạo bởi đỉnh `Subnasale`, một cạnh đi qua `Pronasal` (hoặc lấy vector tiếp tuyến với nền mũi dựa trên `Pronasal` và `Subnasale`), và một cạnh đi qua `Labiale sup`.
* *Cảnh báo:* Hãy ghi chú rõ trong phần mềm đây là "Góc mũi môi ước lượng" vì góc tạo bởi Đỉnh mũi (`Pn`) thường hẹp hơn góc chuẩn tạo bởi Trụ mũi (`Cm`). Bạn không thể áp dụng trực tiếp ngưỡng chuẩn 93-94 độ của luận án cho góc ước lượng này.