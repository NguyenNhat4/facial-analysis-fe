# AI-Assisted Cephalometric Analysis

A web application for exploring AI-assisted cephalometric landmark detection and orthodontic measurements.

The project combines a React analysis interface with a separate backend for image management and model inference. The model work includes fine-tuning a pretrained **HRNet** model on the public **Aariz cephalometric dataset**.

This repository contains the frontend application. Backend code and model implementation are maintained separately.

## Demo and Repositories

- **Demo videos:** [View recordings](https://youtu.be/6OtkT6dGGrs)
- **Frontend:** [facial-analysis-fe](https://github.com/NguyenNhat4/facial-analysis-fe)
- **Backend:** [Backend and model inference source](https://github.com/NguyenNhat4/ceph-landmark-detection.git)

## Overview

Cephalometric analysis involves locating anatomical landmarks on lateral skull X-rays and using their positions to calculate measurements.

This project provides a browser interface for working with patient images, requesting AI landmark predictions, and inspecting measurements derived from landmark coordinates.

The goal is to demonstrate how a computer vision model can be integrated into an interactive analysis workflow.

## Features

- Patient records and image management through backend APIs.
- Image upload support for X-ray, frontal, and profile image categories.
- Backend integration for AI landmark prediction.
- Landmark visualization and analysis interfaces.
- Normalization of backend landmark names into the frontend format.
- Calculation logic for cephalometric angles and distances, including SNA, SNB, ANB, and interincisal angle.
- Backend integration for saving and retrieving analyses.
- Sample prediction data for demonstrating the interface when inference is unavailable.

Support for an image category does not imply that the HRNet model was trained for that category.

## Model and Dataset

### Model

The model development work uses a pretrained **High-Resolution Network (HRNet)** fine-tuned on Aariz for cephalometric landmark detection.

**My contribution:** fine-tuning the pretrained HRNet model on the public Aariz dataset.

Training code, checkpoint details, preprocessing, and inference implementation belong in the backend/model repository. They are not included in this frontend repository.

### Dataset

[Aariz](https://figshare.com/articles/dataset/Aariz_Cephalometric_Dataset/27986417) is a public dataset for cephalometric landmark detection and cervical vertebral maturation stage classification.

It contains 1,000 lateral cephalometric radiographs with annotations for 29 anatomical landmarks. These describe the source dataset; the exact landmark subset and training split used by this project should be documented alongside the training implementation.

Dataset references:

- [Dataset publication](https://www.nature.com/articles/s41597-025-05542-3)
- [Dataset download and usage terms](https://figshare.com/articles/dataset/Aariz_Cephalometric_Dataset/27986417)
- [Dataset authors’ repository](https://github.com/manwaarkhd/aariz)

No quantitative model performance claims are made here. Reproducible evaluation results should identify the checkpoint, evaluation split, preprocessing, and metrics used.

## System Architecture

The application is organized into separate frontend and backend repositories.

1. The frontend manages the analysis interface and user interactions.
2. Backend APIs manage patient records, images, and saved analyses.
3. The prediction API runs model inference and returns landmark data.
4. The frontend normalizes landmark names and uses coordinates for visualization and measurements.

The frontend currently uses these API routes:

| Purpose | Route |
|---|---|
| Request landmark prediction | `POST /api/predict` |
| Patient management | `/api/v1/patients/` |
| Image upload | `/api/v1/images/upload` |
| Retrieve image file | `/api/v1/images/{imageId}/file` |
| Save analysis | `/api/v1/analysis/save` |

See the backend repository for the complete API contract and server setup.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling and UI | Tailwind CSS, Radix UI |
| Shared application state | Zustand |
| API queries and mutations | TanStack Query |
| Routing | Wouter |
| Model development | Pretrained HRNet fine-tuned on Aariz |
| Backend/model source | Separate repository |

## Getting Started

### Prerequisites

- Node.js 22 LTS and npm.
- A compatible backend for patient management and live inference.

The frontend can be started independently, but backend-dependent features require the corresponding services.

### 1. Clone the repository

```bash
git clone https://github.com/NguyenNhat4/facial-analysis-fe.git
cd facial-analysis-fe
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the environment

Copy the example configuration:

```bash
cp .env.example .env
```

The example contains:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DENTAL_TREATMENT_API_URL=http://localhost:8000
VITE_NODE_ENV=development
VITE_ENABLE_API_CHECK=true
```

`VITE_DENTAL_TREATMENT_API_URL` controls the prediction service base URL.

**Current integration detail:** patient and image operations in `src/api/patients.ts` use a hardcoded base URL of `http://localhost:8000/api/v1`. Changing environment variables alone does not redirect those operations. Update that configuration when connecting to a remotely hosted backend.

Variables prefixed with `VITE_` are exposed to the browser bundle. Do not place private credentials in them.

### 4. Start the backend

Follow the installation and inference instructions in the [backend repository](BACKEND_REPOSITORY_URL).

For the default local integration, the backend should be reachable at `http://localhost:8000` and allow requests from the frontend origin.

### 5. Start the frontend

```bash
npm run dev
```

Open the address printed by Vite, normally `http://localhost:5173`.

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run check` | Run TypeScript checks |
| `npm run build` | Build the frontend into `dist/` |
| `npm run preview` | Preview the frontend build locally |
| `npm start` | Run the repository’s Node server |

Building the frontend does not start the backend or model inference service.

## Project Structure

```text
src/
├── api/          # Prediction, patient, image, and analysis API integration
├── components/   # Interface components
├── core/
│   ├── diagnostic/  # Measurement definitions and calculation logic
│   └── geometry/    # Geometry utilities
├── hooks/        # React hooks
├── pages/        # Application screens
├── stores/       # Shared application state
└── utils/        # Supporting types and utilities

docs/             # Architecture and integration notes
public/           # Static assets
```

## Demo Data and Live Inference

The prediction client currently falls back to bundled sample landmark data when the prediction API returns an error or cannot be reached.

Consequently, visible landmarks do not necessarily indicate successful model inference.

When demonstrating or evaluating the model:

- Confirm that `POST /api/predict` succeeds.
- Distinguish live predictions from bundled sample data.
- Use the backend logs and response data to verify inference.
- Evaluate model accuracy on a documented held-out dataset.

Sample predictions are intended for interface demonstrations and must not be reported as model evaluation results.

## Limitations

- This is a development and research demonstration; clinical validation is not established.
- Prediction quality depends on the trained checkpoint, image characteristics, and preprocessing.
- Distance measurements depend on correct image calibration.
- Some API addresses currently require source configuration for remote deployment.
- Running the complete workflow requires the separate backend and its model dependencies.

The application is not intended to provide autonomous diagnosis or treatment decisions.

## Acknowledgments

This project builds on HRNet and the Aariz dataset. Credit belongs to the original model and dataset authors.

Consult the backend/model repository for the exact pretrained checkpoint source and its citation. Follow the applicable dataset and model usage terms.
