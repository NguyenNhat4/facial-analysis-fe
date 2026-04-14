# Công thức và Tiêu chuẩn hài hòa khuôn mặt người Việt

Dựa trên kết quả nghiên cứu từ luận án Tiến sĩ của tác giả Hoàng Thị Đợi, dưới đây là bảng tổng hợp các giá trị trung bình ($\bar{X}$), độ lệch chuẩn ($S.D.$) và công thức logic để bạn thiết lập bộ quy tắc đánh giá (Rule Engine) cho phần mềm chẩn đoán.

---

## 1. Bảng chỉ số Xương và Răng (Đo trên phim X-quang)

Các chỉ số dưới đây là quan trọng nhất để xác định kiểu xương và hướng phát triển của hàm người Việt Nam.

| Chỉ số | Ký hiệu | Giới tính | Trung bình ($\bar{X}$) | Độ lệch chuẩn ($S.D.$) |
| :--- | :--- | :--- | :--- | :--- |
| **Góc SNA** | $SNA$ | Nam | 84.33° | 4.42° |
| | | Nữ | 83.93° | 3.75° |
| **Góc SNB** | $SNB$ | Nam | 80.98° | 4.36° |
| | | Nữ | 80.61° | 3.82° |
| **Góc ANB** | $ANB$ | Nam | 3.34° | 2.22° |
| | | Nữ | 3.32° | 2.28° |
| **Răng cửa trên - NA** | $I-NA$ | Nam | 5.07 mm | 2.26 mm |
| | | Nữ | 4.93 mm | 2.31 mm |
| **Răng cửa dưới - NB** | $i-NB$ | Nam | 6.25 mm | 2.18 mm |
| | | Nữ | 6.16 mm | 2.09 mm |
| **Trục răng cửa dưới (IMPA)** | $i/MP$ | Nam | 96.79° | 6.86° |
| | | Nữ | 95.09° | 6.96° |


---

## 2. Bảng chỉ số Mô mềm và Thẩm mỹ (Đo trên ảnh/X-quang)

Các chỉ số này quyết định sự hài hòa của khuôn mặt người Việt so với các chủng tộc khác.

| Chỉ số | Ký hiệu | Giới tính | Trung bình ($\bar{X}$) | Độ lệch chuẩn ($S.D.$) |
| :--- | :--- | :--- | :--- | :--- |
| **Môi trên - đường E** | $Ls-E$ | Nam | 0.44 mm | 2.34 mm |
| | | Nữ | -0.21 mm | 1.87 mm |
| **Môi dưới - đường E** | $Li-E$ | Nam | 1.77 mm | 2.37 mm |
| | | Nữ | 1.37 mm | 2.08 mm |
| **Góc Z** | $Z\text{-}Angle$ | Nam | 74.06° | 6.73° |
| | | Nữ | 76.62° | 5.56° |
| **Góc mũi môi** | $Cm\text{-}Sn\text{-}ls$ | Nam | 93.53° | 13.69° |
| | | Nữ | 94.75° | 12.20° |
| **Góc lồi mặt** | $N\text{-}Sn\text{-}Pg'$ | Nam | 161.28° | 6.03° |
| | | Nữ | 162.85° | 5.49° |


---

## 3. Công thức và Quy tắc đánh giá cho phần mềm

Dựa trên nguyên tắc nhân trắc học của luận án, một khuôn mặt được coi là **Hài hòa** khi các chỉ số nằm trong khoảng giá trị trung bình cộng trừ 1 độ lệch chuẩn.

### Công thức xác định ngưỡng Hài hòa (Harmony Range)

$$\text{Range} = [\bar{X} - 1 \times S.D. \quad \text{đến} \quad \bar{X} + 1 \times S.D.]$$

### Quy tắc phân loại (Logic Rules)

#### **Nhóm Hài hòa (Harmonious)**
Nếu kết quả tính toán nằm trong $Range$, báo cáo: **"Chỉ số đạt chuẩn hài hòa người Việt"**

#### **Nhóm Bất thường (Deviation)**

- **Vượt ngưỡng trên** ($> \bar{X} + 1 S.D.$)  
  Ví dụ: ANB cao $\rightarrow$ Chẩn đoán **"Hô xương hạng II"**

- **Dưới ngưỡng dưới** ($< \bar{X} - 1 S.D.$)  
  Ví dụ: ANB thấp/âm $\rightarrow$ Chẩn đoán **"Móm xương hạng III"**

### Ví dụ thực tế: Góc ANB (Nữ)

| Mục | Giá trị |
| :--- | :--- |
| **Giá trị đo được** | 6.0° |
| **Ngưỡng chuẩn** | $3.32 - 2.28$ đến $3.32 + 2.28 = [1.04° \text{ đến } 5.60°]$ |
| **Kết luận** | 6.0° > 5.60° $\rightarrow$ **Sai hình xương hạng II** |

---

## 4. Lưu ý quan trọng

### Xử lý giá trị âm cho chỉ số Ls-E (Nữ)

Đối với chỉ số **Ls-E ở Nữ**, giá trị trung bình là âm (-0.21 mm). Điều này có nghĩa là ở người Nữ Việt Nam hài hòa, **môi trên thường nằm hơi lùi nhẹ sau đường thẩm mỹ E**.

**Phần mềm của bạn cần xử lý chính xác dấu âm này khi tính toán khoảng cách.**