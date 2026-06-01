# Patient Management System Documentation

## Overview

The backend now supports complete patient information management with the following core features:

1. **Patient Information Storage** - Store patient details (fullname, phone number, consultation date)
2. **Image Management** - Store X-ray images linked to patients
3. **Analysis Results** - Store landmark detection results and analysis data
4. **Search & Retrieval** - Query patients by name or phone number

## Database Schema

### Tables

#### `patients` Table
```
- id (INT, Primary Key)
- fullname (VARCHAR(255)) - Patient full name
- phone (VARCHAR(20)) - Patient phone number (unique)
- consultation_date (DATETIME) - Date of consultation
- created_at (DATETIME) - Record creation timestamp
- updated_at (DATETIME) - Last update timestamp
```

#### `images` Table
```
- id (INT, Primary Key)
- patient_id (INT, Foreign Key) - References patients.id
- filename (VARCHAR(255)) - Original filename
- file_path (VARCHAR(512)) - Storage file path
- image_type (VARCHAR(50)) - Type of image (lateral, panoramic, etc.)
- upload_date (DATETIME) - Upload timestamp
```

#### `analyses` Table
```
- id (INT, Primary Key)
- patient_id (INT, Foreign Key) - References patients.id
- image_id (INT, Foreign Key) - References images.id
- landmarks (JSON) - Detected landmarks data
- confidence_score (FLOAT) - Overall confidence score
- notes (VARCHAR(1000)) - Additional notes
- analysis_date (DATETIME) - Analysis timestamp
```

## API Endpoints

### Patient Management

#### Create Patient
**POST** `/api/v1/patients/`

Request body:
```json
{
  "fullname": "Nguyen Van A",
  "phone": "0901234567",
  "consultation_date": "2024-06-01T10:30:00"
}
```

Response:
```json
{
  "id": 1,
  "fullname": "Nguyen Van A",
  "phone": "0901234567",
  "consultation_date": "2024-06-01T10:30:00",
  "created_at": "2024-06-01T10:30:00",
  "updated_at": "2024-06-01T10:30:00"
}
```

#### Get Patient by ID
**GET** `/api/v1/patients/{patient_id}`

#### List All Patients
**GET** `/api/v1/patients/?skip=0&limit=100`

#### Update Patient
**PUT** `/api/v1/patients/{patient_id}`

Request body (all fields optional):
```json
{
  "fullname": "Nguyen Van B",
  "phone": "0909876543",
  "consultation_date": "2024-06-02T14:00:00"
}
```

#### Delete Patient
**DELETE** `/api/v1/patients/{patient_id}`

#### Get Patient Images
**GET** `/api/v1/patients/{patient_id}/images`

#### Search Patients
**GET** `/api/v1/patients/search?q=Nguyen`

Searches by fullname or phone number

### Analysis Management

#### Save Analysis Results
**POST** `/api/v1/analysis/save`

Form data:
- `patient_id` (int, required) - Patient ID
- `image_file` (file, required) - X-ray image
- `landmarks` (string, optional) - JSON string of landmarks
- `confidence_score` (float, optional) - Confidence score
- `notes` (string, optional) - Additional notes

Example using curl:
```bash
curl -X POST "http://localhost:8000/api/v1/analysis/save" \
  -F "patient_id=1" \
  -F "image_file=@path/to/image.jpg" \
  -F "landmarks=[{\"name\": \"A\", \"x\": 100, \"y\": 200}]" \
  -F "confidence_score=0.95" \
  -F "notes=Good quality X-ray"
```

#### Get Analysis
**GET** `/api/v1/analysis/{analysis_id}`

#### Get Patient Analyses
**GET** `/api/v1/analysis/patient/{patient_id}`

## Usage Examples

### 1. Create a New Patient
```bash
curl -X POST "http://localhost:8000/api/v1/patients/" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Nguyen Van A",
    "phone": "0901234567",
    "consultation_date": "2024-06-01T10:30:00"
  }'
```

### 2. Upload Image and Save Analysis
```bash
curl -X POST "http://localhost:8000/api/v1/analysis/save" \
  -F "patient_id=1" \
  -F "image_file=@xray_image.jpg" \
  -F "confidence_score=0.92" \
  -F "notes=Lateral view - good quality"
```

### 3. Search for Patient
```bash
curl "http://localhost:8000/api/v1/patients/search?q=Nguyen"
```

### 4. Get Patient with All Images and Analyses
```bash
# Get patient info
curl "http://localhost:8000/api/v1/patients/1"

# Get patient images
curl "http://localhost:8000/api/v1/patients/1/images"

# Get patient analyses
curl "http://localhost:8000/api/v1/analysis/patient/1"
```

## Service Layer

### PatientService
Located in `app/services/patient.py`

Methods:
- `create_patient(db, patient_data)` - Create new patient
- `get_patient(db, patient_id)` - Get patient by ID
- `get_patient_by_phone(db, phone)` - Get patient by phone
- `get_all_patients(db, skip, limit)` - List patients with pagination
- `update_patient(db, patient_id, patient_data)` - Update patient
- `delete_patient(db, patient_id)` - Delete patient
- `get_patient_analyses(db, patient_id)` - Get analyses for patient
- `get_patient_images(db, patient_id)` - Get images for patient
- `search_patients(db, query)` - Search by name or phone

### AnalysisService
Located in `app/services/analysis.py`

Methods:
- `create_analysis(db, patient_id, image_id, landmarks, confidence_score, notes)` - Save analysis
- `get_analysis(db, analysis_id)` - Get analysis by ID
- `get_patient_latest_analysis(db, patient_id)` - Get latest analysis
- `get_image_analyses(db, image_id)` - Get analyses for image

### StorageService
Located in `app/services/storage.py`

Methods:
- `save_image(file, patient_id)` - Save uploaded image
- `get_image_path(file_path)` - Get full file path
- `delete_image(file_path)` - Delete image file

## Configuration

### Environment Variables

- `DATABASE_URL` - Database connection string (default: SQLite at `./cephalometric.db`)
- `STORAGE_DIR` - Directory for storing images (default: `/tmp/cephalometric_storage`)

Example `.env` file:
```
DATABASE_URL=sqlite:///./cephalometric.db
STORAGE_DIR=/var/cephalometric/storage
```

### Supported Databases

1. **SQLite** (default for development)
   ```
   DATABASE_URL=sqlite:///./cephalometric.db
   ```

2. **PostgreSQL**
   ```
   DATABASE_URL=postgresql://user:password@localhost/cephalometric
   ```

3. **MySQL**
   ```
   DATABASE_URL=mysql+pymysql://user:password@localhost/cephalometric
   ```

## Data Flow

### Patient Registration Flow
```
1. Frontend sends patient info (fullname, phone, consultation_date)
   ↓
2. Backend creates patient record in DB
   ↓
3. Return patient ID and info
   ↓
4. Use patient_id for subsequent operations
```

### Analysis Workflow
```
1. User uploads X-ray image for patient
   ↓
2. Image saved to patient-specific directory
   ↓
3. Run landmark detection inference
   ↓
4. Save results (landmarks, confidence, notes) to DB
   ↓
5. Link analysis to patient and image records
```

## Error Handling

### Common Errors

1. **Patient not found** (404)
   ```json
   {
     "detail": "Patient 999 not found"
   }
   ```

2. **Duplicate phone number** (400)
   ```json
   {
     "detail": "Phone number 0901234567 already exists"
   }
   ```

3. **Invalid request data** (422)
   ```json
   {
     "detail": [
       {
         "loc": ["body", "fullname"],
         "msg": "ensure this value has at least 1 characters",
         "type": "value_error.string.too_short"
       }
     ]
   }
   ```

## Testing

### Prerequisites
```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

### Start Development Server
```bash
cd /home/nhatnm/code/myprojects/ceph-landmark-detection/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Access API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Next Steps

1. **Frontend Integration** - Update UI to create patients and store analysis results
2. **Advanced Search** - Add date range filtering, image type filtering
3. **Export Analysis** - Add PDF report generation for analysis results
4. **Multi-Image Analysis** - Support comparing multiple images for same patient
5. **Audit Trail** - Track modifications to patient records
