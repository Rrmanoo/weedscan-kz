# WeedScan KZ: Web Application for AI-Powered Weed Detection and Field Mapping

## 3.X Overview of the Developed Web Application

To provide an accessible and practical interface for the trained YOLOv8 weed detection model, a full-stack web application named **WeedScan KZ** was developed. The system enables agricultural specialists and researchers to upload field photographs, receive real-time weed species classification with bounding box annotations, and perform large-scale field mapping with aggregated analytics and treatment recommendations.

The application is deployed as a single-page application (SPA) on GitHub Pages and communicates with a local Python-based inference server for model predictions.

---

## 3.X.1 Technology Stack

### Frontend

The client-side application was built using the following technologies:

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | Component-based UI framework |
| TypeScript | 5.8.3 | Static type checking |
| Vite | 5.4.19 | Build tool with HMR and SWC compilation |
| React Router DOM | 6.30.1 | Client-side routing |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| Framer Motion | 12.35.1 | Page and element animations |
| Recharts | 2.15.4 | Data visualization (bar/pie charts) |
| shadcn/ui (Radix UI) | -- | Accessible UI component primitives |
| Lucide React | 0.462.0 | Icon library |

### Backend (Inference Server)

The inference backend is a lightweight Python server responsible for loading the trained YOLOv8 model and performing real-time object detection:

| Technology | Purpose |
|---|---|
| FastAPI | Asynchronous REST API framework |
| Ultralytics (YOLOv8) | Model loading and inference |
| Pillow (PIL) | Image decoding and preprocessing |
| Uvicorn | ASGI server |

The server exposes a single `/classify` endpoint that accepts base64-encoded images and returns detection results as JSON.

### Deployment

- **Hosting:** GitHub Pages with SPA routing via a `404.html` redirect strategy
- **Base Path:** `/charm-glow-up/`
- **Build Command:** `vite build` producing static assets in `dist/`

---

## 3.X.2 Application Architecture

The application follows a client-server architecture where the React frontend handles user interaction, visualization, and state management, while the Python inference server performs model predictions.

```
User Browser (React SPA)
    |
    |-- POST /classify (base64 image)
    |
FastAPI Inference Server (Python)
    |
    |-- YOLOv8 Model (weed_detector.pt, 6.24 MB)
    |
    |-- Returns JSON: bounding boxes, species, confidence scores
```

The Vite development server proxies `/classify` requests to `http://localhost:8000`, enabling seamless communication between the frontend and backend during development.

---

## 3.X.3 Application Pages and Features

The web application consists of three main pages accessible via a responsive navigation bar.

### 3.X.3.1 Home Page (`/`)

The landing page introduces the system with:

- A full-height hero section with a background field image and a brief description of the system's capabilities
- Two call-to-action buttons directing users to the single image analysis and field analysis tools
- A three-column feature overview highlighting single image analysis, full field reconstruction, and the analytics dashboard

### 3.X.3.2 Single Image Analysis Page (`/analyze`)

This page enables rapid weed detection on individual field photographs.

**Input:**
- Users upload a JPG or PNG image (up to 20 MB) via drag-and-drop or file picker
- An example image is available for demonstration purposes

**Processing:**
1. The uploaded image is converted to base64 encoding
2. A POST request is sent to the `/classify` endpoint on the inference server
3. The YOLOv8 model performs object detection and returns predictions

**Output and Visualization:**
- **Bounding Box Overlay:** Detected weeds are highlighted with color-coded bounding boxes on the original image, each labeled with the species name and confidence score (0--100%). An interactive toggle allows users to show or hide the overlay.
- **Summary Statistics:** Four metric cards display the total weed count, infestation rate (calculated as the cumulative area of bounding boxes relative to the image), number of unique species detected, and the dominant species.
- **Species Distribution:** A horizontal bar chart shows each detected species with its count and relative percentage.
- **Detection Summary:** A text-based description of findings generated from the model output.

### 3.X.3.3 Field Analysis Page (`/field`)

This page supports comprehensive analysis of large agricultural fields (up to 100 hectares) through a hierarchical zone-block structure.

**Field Structure:**
- The field is divided into **9 zones** arranged in a 3x3 grid
- Each zone is subdivided into **9 blocks** (also 3x3)
- Each block accepts **4 to 50 images**
- A minimum of **36 images per zone** (4 per block x 9 blocks) is required

**Upload Methods:**
1. **Individual block upload:** Users select images per block using a drag-and-drop interface with visual progress indicators
2. **ZIP file upload:** A structured ZIP archive with the naming convention `field_name/zone_N/block_N/image.jpg` is automatically parsed and images are assigned to the appropriate zones and blocks

**Field Location:** Users can input GPS coordinates or a textual location description (e.g., "Botanical Garden, Astana").

**Analysis Results:**

Upon clicking "Analyze All Zones," the system processes uploaded images and presents:

1. **Aggregate Statistics:** Four summary cards showing total weed count, average infestation rate, unique species count, and the most affected zone with severity rating.

2. **Field Reconstruction Tabs:**
   - *Image Mosaic:* A stitched preview of uploaded field images organized by zone and block
   - *Satellite Overlay:* A 3x3 grid of satellite map tiles with zone overlays showing infestation rates. Each zone can be selected to reveal a 9-cell heatmap and species breakdown.

3. **Analytics Dashboard:**
   - *Bar Chart:* Infestation rate by zone (Z1--Z9), enabling identification of hotspots
   - *Pie Chart:* Weed species distribution across the entire field

4. **Treatment Recommendations:** An accordion-based panel providing species-specific management strategies.

---

## 3.X.4 Treatment Recommendation System

The application includes an integrated treatment database covering 10 major weed species relevant to the Kazakhstan agricultural context. For each detected species, the system provides:

| Field | Description |
|---|---|
| Common and scientific name | Species identification |
| Chemical control | Pre-emergent and post-emergent herbicide options |
| Cultural/mechanical control | Non-chemical management methods |
| Application timing | Optimal growth stage for treatment |
| Severity classification | Low, Moderate, or High threat level |

The species covered include:

1. *Portulaca oleracea* (Common Purslane)
2. *Amaranthus retroflexus* (Redroot Pigweed)
3. *Cyperus rotundus* (Purple Nutsedge)
4. *Echinochloa crus-galli* (Barnyardgrass)
5. *Digitaria sanguinalis* (Large Crabgrass)
6. *Chenopodium album* (Lambsquarters)
7. *Convolvulus arvensis* (Field Bindweed)
8. *Setaria viridis* (Green Foxtail)
9. *Sorghum halepense* (Johnsongrass)
10. *Cirsium arvense* (Canada Thistle)

High-threat species (e.g., *Convolvulus arvensis*, *Sorghum halepense*, *Cirsium arvense*) are flagged with warning indicators to draw attention to urgent management needs.

---

## 3.X.5 ML Model Integration

### Model Specifications

| Parameter | Value |
|---|---|
| Architecture | YOLOv8 (Ultralytics) |
| Model file | `weed_detector.pt` (6.24 MB) |
| Training performance | mAP50 = 0.833 |
| Training epochs | 80 |
| Dataset | Kazakhstan 14-class weed detection dataset |

### Inference Pipeline

The inference pipeline processes images through the following steps:

1. **Input:** The frontend sends a base64-encoded image to the `/classify` endpoint
2. **Decoding:** The server decodes the base64 string and converts it to an RGB PIL image
3. **Inference:** The image is passed through the YOLOv8 model, which returns bounding box coordinates, class IDs, and confidence scores
4. **Post-processing:**
   - Bounding box coordinates are normalized to relative values (0--1) with respect to image dimensions
   - The infestation rate is computed as the sum of all bounding box areas as a percentage of total image area
   - Detections are aggregated by species class to compute per-species counts and percentages
5. **Response:** The server returns a JSON object containing `weedCount`, `infestationRate`, `species` array, `boundingBoxes` array, and a text `summary`

### API Response Format

```json
{
  "weedCount": 12,
  "infestationRate": 34.2,
  "species": [
    { "name": "Amaranthus retroflexus", "count": 7, "percentage": 58.3 },
    { "name": "Chenopodium album", "count": 5, "percentage": 41.7 }
  ],
  "boundingBoxes": [
    {
      "x": 0.15, "y": 0.22,
      "width": 0.08, "height": 0.12,
      "label": "Amaranthus retroflexus",
      "confidence": 0.91
    }
  ],
  "summary": "Detected 12 weeds with an infestation rate of 34.2%."
}
```

---

## 3.X.6 User Interface Design

The interface was designed with the following principles:

- **Responsive layout:** All pages adapt to desktop, tablet, and mobile viewports using Tailwind CSS breakpoints
- **Dark-themed aesthetic:** A nature-inspired color palette with green accent tones reflecting the agricultural domain
- **Progressive disclosure:** Complex information (treatment details, zone breakdowns) is hidden behind expandable panels and tabs to avoid overwhelming users
- **Visual feedback:** Loading spinners, animated transitions (Framer Motion), and toast notifications provide real-time feedback during analysis
- **Accessibility:** Built on Radix UI primitives (shadcn/ui) ensuring keyboard navigation and screen reader compatibility

---

## 3.X.7 Summary

The WeedScan KZ web application serves as a practical deployment interface for the YOLOv8 weed detection model, bridging the gap between deep learning research and agricultural field application. It offers two complementary analysis modes -- single image for rapid assessment and full field reconstruction for comprehensive mapping -- combined with data visualizations and actionable treatment recommendations. The system demonstrates an end-to-end machine learning application pipeline from model inference to user-facing decision support, applicable to precision agriculture workflows in the Kazakhstan context.
