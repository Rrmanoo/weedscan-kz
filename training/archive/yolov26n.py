import json
import os
import shutil
from pathlib import Path
import yaml
from PIL import Image
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

# Block all outbound network attempts by ultralytics
os.environ["ULTRALYTICS_OFFLINE"] = "1"
os.environ["YOLO_OFFLINE"] = "1"
os.environ["HUB_OFFLINE"] = "1"

from ultralytics import YOLO
import ultralytics
ultralytics.checks = lambda: None  # skip online checks


class COCOToYOLOConverter:
    """Convert COCO format dataset to YOLO format"""

    def __init__(self, coco_json_path, images_dir, output_dir):
        self.coco_json_path = coco_json_path
        self.images_dir = Path(images_dir)
        self.output_dir = Path(output_dir)

        # Load COCO annotations
        with open(coco_json_path, 'r') as f:
            self.coco_data = json.load(f)

        # Create output directories
        self.setup_directories()

    def setup_directories(self):
        """Create necessary directories for YOLO format"""
        self.output_dir.mkdir(exist_ok=True)

        # Create train/val directories
        for split in ['train', 'val']:
            (self.output_dir / split / 'images').mkdir(parents=True, exist_ok=True)
            (self.output_dir / split / 'labels').mkdir(parents=True, exist_ok=True)

    def convert_bbox_to_yolo(self, bbox, img_width, img_height):
        """Convert COCO bbox format to YOLO format"""
        x, y, w, h = bbox

        # Convert to center coordinates and normalize
        x_center = (x + w / 2) / img_width
        y_center = (y + h / 2) / img_height
        width = w / img_width
        height = h / img_height

        return [x_center, y_center, width, height]

    def convert_dataset(self, train_split=0.8):
        """Convert COCO dataset to YOLO format"""
        print("Converting COCO dataset to YOLO format...")

        # Create image_id to filename mapping
        image_info = {img['id']: img for img in self.coco_data['images']}

        # Group annotations by image_id
        annotations_by_image = {}
        for ann in self.coco_data['annotations']:
            image_id = ann['image_id']
            if image_id not in annotations_by_image:
                annotations_by_image[image_id] = []
            annotations_by_image[image_id].append(ann)

        # Split dataset into train/val
        image_ids = list(image_info.keys())
        train_ids, val_ids = train_test_split(image_ids, train_size=train_split, random_state=42)

        # Process each split
        for split_name, split_ids in [('train', train_ids), ('val', val_ids)]:
            print(f"Processing {split_name} split ({len(split_ids)} images)...")

            for image_id in split_ids:
                img_info = image_info[image_id]
                img_filename = img_info['file_name']
                img_width = img_info['width']
                img_height = img_info['height']

                # Copy image to appropriate directory
                src_img_path = self.images_dir / img_filename
                dst_img_path = self.output_dir / split_name / 'images' / img_filename

                if src_img_path.exists():
                    shutil.copy2(src_img_path, dst_img_path)

                    # Create label file
                    label_filename = img_filename.replace('.jpg', '.txt').replace('.png', '.txt')
                    label_path = self.output_dir / split_name / 'labels' / label_filename

                    with open(label_path, 'w') as f:
                        if image_id in annotations_by_image:
                            for ann in annotations_by_image[image_id]:
                                category_id = ann['category_id']
                                bbox = ann['bbox']

                                # Convert bbox to YOLO format
                                yolo_bbox = self.convert_bbox_to_yolo(bbox, img_width, img_height)

                                # Write to label file
                                f.write(f"{category_id} {' '.join(map(str, yolo_bbox))}\n")
                else:
                    print(f"Warning: Image {img_filename} not found in {self.images_dir}")

        # Create class names file
        class_names = [cat['name'] for cat in self.coco_data['categories']]
        return class_names

    def create_yaml_config(self, class_names):
        """Create YAML configuration file for YOLO training"""
        config = {
            'path': str(self.output_dir.absolute()),
            'train': 'train/images',
            'val': 'val/images',
            'nc': len(class_names),
            'names': class_names
        }

        yaml_path = self.output_dir / 'dataset.yaml'
        with open(yaml_path, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)

        print(f"Dataset configuration saved to: {yaml_path}")
        return yaml_path


class WeedClassificationTrainer:
    """Train YOLOv8 model for weed classification"""

    def __init__(self, dataset_yaml_path, model_path, device='1'):
        self.dataset_yaml_path = dataset_yaml_path
        self.model_path = model_path
        self.device = device
        self.model = None

    def initialize_model(self):
        """Initialize YOLOv8 model from a LOCAL .pt file only (no downloads)"""
        model_file = Path(self.model_path)

        if not model_file.exists():
            raise FileNotFoundError(
                f"Model weights not found at: {self.model_path}\n"
                f"This script runs fully offline — place the .pt file manually.\n"
                f"Expected path: {model_file.absolute()}"
            )

        print(f"Loading local model weights: {self.model_path}")
        self.model = YOLO(str(model_file))
        print(f"Model loaded successfully ({model_file.stat().st_size / 1e6:.1f} MB)")

    def train_model(self, epochs=100, img_size=640, batch_size=8, patience=50):
        """Train the YOLO model"""
        print("Starting model training...")
        print(f"Using CUDA device: {self.device}")

        # Training parameters
        training_args = {
            'data': self.dataset_yaml_path,
            'epochs': epochs,
            'imgsz': img_size,
            'batch': batch_size,
            'patience': patience,
            'save': True,
            'device': self.device,
            'workers': 4,
            'project': 'weed_classification',
            'name': 'yolov8_combined_weed_detector',
            'exist_ok': True,
            'pretrained': True,
            'optimizer': 'SGD',
            'lr0': 0.01,
            'lrf': 0.1,
            'momentum': 0.937,
            'weight_decay': 0.0005,
            'warmup_epochs': 3,
            'warmup_momentum': 0.8,
            'warmup_bias_lr': 0.1,
            'box': 7.5,
            'cls': 0.5,
            'dfl': 1.5,
            'hsv_h': 0.015,
            'hsv_s': 0.7,
            'hsv_v': 0.4,
            'degrees': 0.0,
            'translate': 0.1,
            'scale': 0.5,
            'shear': 0.0,
            'perspective': 0.0,
            'flipud': 0.0,
            'fliplr': 0.5,
            'mosaic': 1.0,
            'mixup': 0.0,
            'copy_paste': 0.0,
            'amp': True,  # AMP stays on but skip online AMP check
        }

        # Start training
        results = self.model.train(**training_args)

        print("Training completed!")
        return results

    def save_model(self, save_path='weed_classification_model.pt'):
        """Save the trained model"""
        if self.model is not None:
            best_model_path = Path('weed_classification/yolov8_combined_weed_detector/weights/best.pt')

            if best_model_path.exists():
                shutil.copy2(best_model_path, save_path)
                print(f"Model saved to: {save_path}")
            else:
                print("Best model not found. Training may not have completed successfully.")
        else:
            print("No model to save. Please train the model first.")

    def validate_model(self):
        """Validate the trained model"""
        if self.model is not None:
            print("Validating model...")
            results = self.model.val()
            return results
        else:
            print("No model to validate. Please train the model first.")

    def predict_sample(self, image_path, conf_threshold=0.25):
        """Make predictions on a sample image"""
        if self.model is not None:
            print(f"Making predictions on: {image_path}")
            results = self.model.predict(image_path, conf=conf_threshold, save=True)
            return results
        else:
            print("No model loaded. Please train or load a model first.")


def main():
    """Main training pipeline for combined balanced dataset"""
    # ── Configuration ──────────────────────────────────────────
    BASE_DIR = Path(__file__).parent
    COCO_JSON_PATH = BASE_DIR / "augmented_dataset" / "weedcoco.json"
    IMAGES_DIR = BASE_DIR / "augmented_dataset" / "images"
    OUTPUT_DIR = BASE_DIR / "YOLO_combined_data"
    MODEL_PATH = str(BASE_DIR / "yolov26n.pt")  # Must exist locally

    # GPU 1 has more free VRAM (GPU 0 is occupied by vLLM)
    DEVICE = '1'

    print("=" * 60)
    print("COMBINED WEED CLASSIFICATION MODEL TRAINING PIPELINE")
    print("=" * 60)
    print(f"\nDataset: Combined Balanced Dataset")
    print(f"  - 15 classes")
    print(f"  - Max 200 images per class")
    print(f"  - Mixed sources for overlapping classes")
    print(f"\nMode: FULLY OFFLINE (no GitHub/internet downloads)")
    print(f"Device: CUDA:{DEVICE}")
    print("=" * 60)

    # Step 1: Convert COCO to YOLO format
    print("\n1. Converting COCO dataset to YOLO format...")
    converter = COCOToYOLOConverter(str(COCO_JSON_PATH), str(IMAGES_DIR), str(OUTPUT_DIR))
    class_names = converter.convert_dataset(train_split=0.8)
    yaml_path = converter.create_yaml_config(class_names)

    print(f"\nClasses detected ({len(class_names)} total):")
    for i, name in enumerate(class_names):
        print(f"  {i}: {name}")

    # Step 2: Initialize and train the model
    print("\n2. Initializing YOLOv8 model (local weights only)...")
    trainer = WeedClassificationTrainer(str(yaml_path), MODEL_PATH, device=DEVICE)
    trainer.initialize_model()

    print("\n3. Starting model training...")
    print("This may take several hours depending on your hardware...")

    training_results = trainer.train_model(
        epochs=100,
        img_size=640,
        batch_size=4,
        patience=50
    )

    # Step 3: Validate the model
    print("\n4. Validating trained model...")
    validation_results = trainer.validate_model()

    # Step 4: Save the model
    print("\n5. Saving the trained model...")
    trainer.save_model("weed_classification_combined_model.pt")

    print("\n" + "=" * 60)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print(f"Model saved as: weed_classification_combined_model.pt")
    print(f"Training results saved in: weed_classification/yolov8_combined_weed_detector/")
    print("\nTo use the model for inference:")
    print("  from ultralytics import YOLO")
    print("  model = YOLO('weed_classification_combined_model.pt')")
    print("  results = model.predict('your_image.jpg')")

    # Optional: Test prediction on a sample image from the dataset
    sample_images = list(IMAGES_DIR.glob("*.jpg"))
    if sample_images:
        sample_image = sample_images[0]
        print(f"\n6. Testing prediction on sample image: {sample_image.name}")
        trainer.predict_sample(str(sample_image))


if __name__ == "__main__":
    main()
