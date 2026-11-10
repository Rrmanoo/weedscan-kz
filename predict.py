"""Run an explicitly selected, trained WeedScan KZ checkpoint."""
import argparse
import os
from pathlib import Path

REPO_ID = "Rmano-Rudeson/weedscan-kz"
VARIANTS = ("yolov26n-10class", "yolov8n-15class", "yolov8n-5class")


def load_model(variant="yolov26n-10class", model_path=None):
    from ultralytics import YOLO
    from huggingface_hub import hf_hub_download

    if variant not in VARIANTS:
        raise ValueError(f"Unknown variant: {variant}")
    path = model_path or os.environ.get("WEEDSCAN_MODEL_PATH")
    if path:
        if not Path(path).is_file():
            raise FileNotFoundError(path)
    else:
        path = hf_hub_download(REPO_ID, f"models/{variant}/best.pt")
    return YOLO(str(path))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", required=True)
    parser.add_argument("--variant", choices=VARIANTS, default=VARIANTS[0])
    parser.add_argument("--model-path")
    parser.add_argument("--device", default="cpu")
    args = parser.parse_args()
    if not Path(args.image).is_file():
        parser.error("Image file does not exist")
    model = load_model(args.variant, args.model_path)
    results = model.predict(args.image, device=args.device, verbose=False)
    for result in results:
        print(result.to_json())


if __name__ == "__main__":
    main()
