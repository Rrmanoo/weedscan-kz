"""Local FastAPI adapter for the recovered WeedScan KZ frontend."""
import base64
import binascii
import io
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field
from predict import load_model


@asynccontextmanager
async def lifespan(app):
    app.state.model = load_model(os.environ.get("WEEDSCAN_VARIANT", "yolov26n-10class"))
    yield


app = FastAPI(title="WeedScan KZ", lifespan=lifespan)


class InferRequest(BaseModel):
    imageBase64: str = Field(max_length=20_000_000)


@app.post("/classify")
def classify(payload: InferRequest, request: Request):
    try:
        raw = base64.b64decode(payload.imageBase64, validate=True)
        image = Image.open(io.BytesIO(raw))
        if image.width * image.height > 25_000_000:
            raise ValueError("Image exceeds 25 megapixels")
        image = image.convert("RGB")
    except (binascii.Error, UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise HTTPException(status_code=400, detail="Invalid image or unsupported image size") from exc

    model = request.app.state.model
    result = model.predict(image, device="cpu", verbose=False)[0]
    width, height = image.size
    boxes, counts = [], {}
    weed_count, weed_box_area = 0, 0.0
    for box in result.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        label = model.names[int(box.cls[0])]
        item = {"x": x1 / width, "y": y1 / height,
                "width": (x2 - x1) / width, "height": (y2 - y1) / height,
                "label": label, "confidence": round(float(box.conf[0]), 4)}
        boxes.append(item)
        counts[label] = counts.get(label, 0) + 1
        if label.startswith("weed:"):
            weed_count += 1
            weed_box_area += item["width"] * item["height"]
    total = len(boxes)
    species = [{"name": name, "count": count, "percentage": round(100 * count / total, 1)}
               for name, count in counts.items()]
    return {"weedCount": weed_count, "infestationRate": round(min(100 * weed_box_area, 100), 1),
            "species": species, "boundingBoxes": boxes,
            "summary": f"Detected {weed_count} weed instances among {total} plant detections. "
                       "Coverage is an uncalibrated bounding-box area estimate."}
