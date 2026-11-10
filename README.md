# WeedScan KZ

Computer vision and spatial analytics for agricultural weed detection, developed by **[Arman Nurken](https://github.com/Rrmanoo)** for an MSc in Applied Data Analytics at Astana IT University. This release gathers the available trained models, original experiment logs, training scripts, and React/FastAPI application.

[Trained models on Hugging Face](https://huggingface.co/Rmano-Rudeson/weedscan-kz) · [Source code](https://github.com/Rrmanoo/weedscan-kz) · [2026 publication](https://ojs.publisher.agency/index.php/RMS/article/view/8742)

## Models and evidence

| Experiment | Classes | Peak logged validation mAP@0.5 | Weights in this release |
|---|---:|---:|---|
| YOLOv26n | 10 | 96.727% | Available |
| YOLOv8l | 10 | 97.169% | Missing from recovered files |
| YOLOv26l | 10 | 97.700% | Missing from recovered files |
| YOLOv8n baseline | 15 | 83.318% | Available |
| YOLOv8n historical baseline | 5 | 90.701% | Available |

Values above are maxima in the recovered `results.csv` files, **not a fresh test-set evaluation** and not necessarily the selected checkpoint's metrics. Ultralytics selects `best.pt` by fitness, which can select a different epoch. The 5-, 15-, and 10-class experiments use different datasets and are not a controlled architecture comparison. The publication reports rounded values for the three ten-class experiments. Missing weights have not been substituted with pretrained base models. See `experiments/manifest.json` for checksums, label order, and run summaries.

## Run inference

Use Python 3.10+ in a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python predict.py --image path/to/field.jpg --variant yolov26n-10class
```

`predict.py` downloads the selected trained checkpoint from this project's public Hugging Face repository. Available variants are `yolov26n-10class`, `yolov8n-15class`, and `yolov8n-5class`. Detection output includes the model's original label names.

## Run the application

```bash
uvicorn inference_server:app --host 127.0.0.1 --port 8000
# In another terminal:
cd web
npm ci
npm run dev
```

Open the URL Vite prints with the retained `/charm-glow-up/` base path. The API downloads the ten-class YOLOv26n model on first startup. Set `WEEDSCAN_VARIANT` to select another released variant, or `WEEDSCAN_MODEL_PATH` for a local checkpoint. The web application includes image analysis, a zone/block field grid, species summaries, and field visualizations. Stored example results are illustrative.

## Data and training

The ten-class preparation notes describe **5,588 images and 7,659 annotations**, including augmented samples. See `docs/dataset-preparation.md`. Original training scripts are preserved in `training/archive/`; they contain historical filesystem paths that must be adapted to a new environment. Raw training images and third-party datasets are not redistributed in this release.

The archived converter performs a random image split. The available evidence does not establish that source images and their augmented derivatives were grouped before splitting. The validation results therefore require an independent, source-grouped field test before making generalization claims.

## Limitations

This is a research prototype. Class strings, including `crop: xanthium strumarium`, are inherited dataset labels rather than verified agronomic classifications. Bounding-box area is an image coverage proxy; it is not calibrated ground coverage, biomass, or yield loss. The proposed 100-hectare grid is a sampling and reconstruction framework, not evidence of a completed field trial. Treatment text in the historical frontend is illustrative and is not validated for pesticide selection or dosage.

The paper, local preparation notes, and CV contain different dataset counts and research dates. This release uses experiment files for metrics and the linked publication for publication metadata. It does not infer missing experiments or measured cost savings.

## Publications

- **Nurken, A. & Kasekeyeva, A. (2026).** Deep Learning-Based Multi-Class Weed Detection for Kazakhstan Agriculture: A Region-Specific Dataset and Hierarchical Field Analysis System. *Reviews of Modern Science*, No. 13, published May 24, 2026. [Article](https://ojs.publisher.agency/index.php/RMS/article/view/8742).
- **Nurken, A. N. (2025).** Comparative Evaluation of Machine Learning Approaches for Weed Identification in Precision Farming. *Central Asian Scientific Journal*, No. 1 (25), Vol. 2, pp. 100–110. Bibliographic details recovered from the author's publication PDF.

Citation entries are in `docs/publications.bib`. The supplied 2025 PDF also contains administrative pages and other journal material, so it is not included as a model artifact.

## License

The released Ultralytics checkpoints embed an AGPL-3.0 license notice. This repository's source release uses AGPL-3.0; third-party components retain their respective notices. The 2026 article page states CC BY-SA 4.0 for the article. That article license is distinct from the model and source-code license.
