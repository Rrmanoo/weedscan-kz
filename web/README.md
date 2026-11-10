# WeedScan KZ web client

Historical React/TypeScript frontend from the MSc project. Run from this directory:

```bash
npm ci
npm run dev
```

Start the inference server from the repository root as described in the root README. Vite proxies `/classify` to port 8000. The original `/charm-glow-up/` base path is retained. Example mode uses a stored illustration and mock results; uploaded-image mode calls the model. The recovered hosted-service scaffold is omitted; this release uses the local inference API.
