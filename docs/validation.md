# Release verification

Checked on 10 November 2026 on macOS/Apple Silicon with Python 3.13 and Ultralytics 8.4.9.

- All three released trained checkpoints loaded and completed CPU inference on the recovered frontend sample image. Label counts were 5, 15, and 10; parameter counts and detection totals are recorded in `experiments/inference-smoke-check.json`. This is a functional smoke check, not an accuracy evaluation.
- The FastAPI `/classify` endpoint completed real-image inference using the 15-class checkpoint, returned normalized boxes, and rejected malformed image content with HTTP 400. Weed count excludes detections whose inherited label starts with `crop:`.
- The recovered React client completed its production build with the locked npm dependencies. The build reports a large bundle warning and stale Browserslist metadata.
- Environment files, unused hosted-service scaffold, build output, local environments, and installed dependencies are excluded from the source release.
- Original CSV logs are retained, and SHA-256 checksums identify the uploaded checkpoint bytes.

No independent test-set accuracy, field deployment, treatment recommendation, or dataset-license audit was performed. Raw datasets are not part of this release.
