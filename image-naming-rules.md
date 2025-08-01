
## 🔍 **Logic Xử Lý Khi Load Nhiều Ảnh**


### **Cách Đặt Tên File Để Hệ Thống Phân Phối Đúng:**

#### **📋 Quy Tắc Đặt Tên File:**

| **Loại Ảnh** | **Patterns Hợp Lệ** | **Ví Dụ** |
|-------------|-------------------|-----------|
| **Lateral (Cephalometric)** | `*lateral*`, `*ceph*`, `*cephalometric*`, `*side*x*ray*`, `*nghieng*` | `case01_lateral.jpg`, `ceph_side.jpg`, `nghieng_xray.png` |
| **General X-Ray (Panoramic)** | `*pano*`, `*panoramic*`, `*general*x*ray*`, `*toan*canh*`, `*xquang*tong*` | `case01_pano.jpg`, `panoramic_xray.png`, `toan_canh.jpg` |
| **Frontal Face** | `*frontal*`, `*front*`, `*face*front*`, `*portrait*`, `*mat*truoc*`, `*chinh*dien*` | `case01_frontal.jpg`, `face_front.png`, `mat_truoc.jpg` |
| **Profile Face** | `*profile*`, `*side*face*`, `*lateral*face*`, `*mat*nghieng*`, `*ben*hong*` | `case01_profile.jpg`, `side_face.png`, `mat_nghieng.jpg` |
| **3D Upper Jaw** | `*3d*upper*`, `*upper*3d*`, `*model*upper*`, `*upper*stl`, `*ham*tren*` | `case01_upper_3d.stl`, `upper_model.stl`, `ham_tren.obj` |
| **3D Lower Jaw** | `*3d*lower*`, `*lower*3d*`, `*model*lower*`, `*lower*stl`, `*ham*duoi*` | `case01_lower_3d.stl`, `lower_model.stl`, `ham_duoi.obj` |

#### **�� Case ID Detection:**
Hệ thống sẽ tự động detect case ID từ tên file:
- `case01_lateral.jpg` → Case ID: `case01`
- `patient02_frontal.png` → Case ID: `case02`
- `bn03_profile.jpg` → Case ID: `case03`

### **Ví Dụ Thực Tế:**

#### **✅ Cách Đặt Tên File Đúng:**

```
📁 Case Files:
├── case01_lateral.jpg      → Phân vào ô "Lateral Cephalometric"
├── case01_panoramic.jpg    → Phân vào ô "General X-Ray"  
├── case01_frontal.jpg      → Phân vào ô "Frontal Face"
├── case01_profile.jpg      → Phân vào ô "Profile Face"

```

#### **❌ Cách Đặt Tên File Sai:**

```
📁 Case Files:
├── image1.jpg              → Không detect được type
├── photo.jpg               → Không detect được type
├── scan.stl                → Không biết upper hay lower
└── xray.png                → Không biết lateral hay panoramic
```

### **5. Logic Xử Lý Trong Component:**

```typescript
// Trong fakeLoadImages function:
try {
  // 1. Validate files
  const validFiles = files.filter(validateFileType);
  
  // 2. Group by type
  const { detected } = await groupFilesByType(validFiles);
  
  // 3. Extract case ID
  let detectedCaseId: string | null = null;
  for (const file of validFiles) {
    detectedCaseId = extractCaseIdFromInputFile(file);
    if (detectedCaseId) break;
  }
  
  // 4. Process each detected type
  for (const [imageType, typeFiles] of Object.entries(detected)) {
    if (typeFiles.length > 0) {
      const file = typeFiles[0]; // Lấy file đầu tiên
      
      // 5. Create preview URL
      const inputPreviewUrl = URL.createObjectURL(file);
      
      // 6. Update states
      setImagePreviewUrls(prev => ({ ...prev, [imageType]: inputPreviewUrl }));
      setUploadedImages(prev => ({ ...prev, [imageType]: true }));
    }
  }
} catch (error) {
  console.error("Failed to process uploaded images:", error);
}
```

### **6. Tips Cho User:**

1. **Đặt tên file rõ ràng** với keywords như `lateral`, `frontal`, `profile`, `pano`
2. **Thêm case ID** vào tên file: `case01_lateral.jpg`
3. **Phân biệt upper/lower** cho 3D files: `upper_scan.stl`, `lower_scan.stl`
4. **Sử dụng underscore** thay vì space: `case01_frontal.jpg` ✅, `case01 frontal.jpg` ❌

Hệ thống sẽ tự động detect và phân phối ảnh vào đúng ô dựa trên tên file! 🎯