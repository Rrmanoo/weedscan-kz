# Dataset Preparation & Augmentation

## Source Datasets

Two WeedCOCO-format datasets were merged:

| Dataset | Images | Annotations |
|---|---|---|
| `84fd3c3f-dd3e-400b-ac5a-d18ca712c3d0.v2` | 905 | 1,394 |
| `2c14915b-0827-4b65-9908-d2a6df0d48f3` | 5,648 | 9,388 |

---

## Class Filtering

The following classes were excluded from the merged dataset:

- `weed: euphorbia maculata`
- `weed: mollugo verticillata`
- `weed: sida rhombifolia`
- `weed: ambrosia artemisiifolia`
- `weed: amaranthus tuberculatus`

Annotations were capped at **900 per class** before merging to prevent dominance by any single class.

---

## Merged Dataset (No Augmentation)

Located in `images/` + `weedcoco.json`.

| Class | Annotations |
|---|---|
| weed: ipomoea indica | 900 |
| weed: portulaca oleracea | 900 |
| weed: eclipta | 865 |
| weed: amaranthus palmeri | 841 |
| weed: chenopodium album | 464 |
| weed: senna obtusifolia | 243 |
| weed: eleusine indica | 214 |
| weed: taraxacum officinale | 144 |
| weed: physalis angulata | 123 |
| crop: xanthium strumarium | 96 |
| **Total** | **4,790** |

**Total images: 3,461**

Class imbalance ratio: ~9:1 (900 vs 96).

---

## Augmented Dataset

Located in `augmented_dataset/images/` + `augmented_dataset/weedcoco.json`.

Contains all original images plus synthetically augmented images for minority classes.

### Augmentation Targets

| Class | Original | Target |
|---|---|---|
| crop: xanthium strumarium | 96 | 450 |
| weed: physalis angulata | 123 | 500 |
| weed: taraxacum officinale | 144 | 500 |
| weed: eleusine indica | 214 | 600 |
| weed: senna obtusifolia | 243 | 600 |
| weed: chenopodium album | 464 | 700 |
| weed: amaranthus palmeri | 841 | 900 |
| weed: eclipta | 865 | 900 |
| weed: ipomoea indica | 900 | — |
| weed: portulaca oleracea | 900 | — |

### Augmentation Pipeline (Albumentations 2.0.8)

| Transform | Parameters | Probability |
|---|---|---|
| HorizontalFlip | — | 0.5 |
| RandomBrightnessContrast | brightness ±0.2, contrast ±0.2 | 0.7 |
| HueSaturationValue | hue ±10, sat ±25, val ±15 | 0.6 |
| Affine | translate 5%, scale 85–115%, rotate ±15° | 0.7 |
| GaussianBlur | kernel 3–5 | 0.3 |
| RandomShadow | — | 0.2 |
| CLAHE | clip limit 2.0 | 0.3 |
| ImageCompression | quality 75–95% | 0.2 |

**Border mode:** `BORDER_REFLECT_101` — gaps from rotation/translation are filled by mirroring image content (no black borders).

**Bounding box handling:** All bounding box coordinates are recomputed by Albumentations for every geometric transform. Annotations where the transformed box falls below `min_visibility=0.3` are discarded rather than saved with inaccurate coordinates.

### Final Augmented Counts

| Class | Original | Augmented | Total |
|---|---|---|---|
| crop: xanthium strumarium | 96 | +428 | 524 |
| weed: physalis angulata | 123 | +428 | 551 |
| weed: eleusine indica | 214 | +453 | 667 |
| weed: senna obtusifolia | 243 | +438 | 681 |
| weed: taraxacum officinale | 144 | +545 | 689 |
| weed: chenopodium album | 464 | +376 | 840 |
| weed: eclipta | 865 | +42 | 907 |
| weed: ipomoea indica | 900 | +16 | 916 |
| weed: portulaca oleracea | 900 | +41 | 941 |
| weed: amaranthus palmeri | 841 | +102 | 943 |
| **Total** | **4,790** | **+2,869** | **7,659** |

**Total images: 5,588** | Class imbalance ratio reduced from ~9:1 to ~1.8:1.

> Note: some classes exceed their target because augmented images often contain multiple classes — when an image is augmented for one minority class, annotations for all co-occurring classes in that image are also captured.

---

## Directory Structure

```
AITU - publication/
├── images/                  # Original merged images (3,461)
├── weedcoco.json            # Original annotations (4,790)
├── augmented_dataset/
│   ├── images/              # Original + augmented images (5,588)
│   └── weedcoco.json        # Combined annotations (7,659)
└── DATASET.md               # This file
```

---

## Intended Use

Both datasets target YOLO object detection training (YOLOv8l, YOLOv12l). The original dataset can be used as a held-out reference or for ablation studies. The augmented dataset is the primary training set.
