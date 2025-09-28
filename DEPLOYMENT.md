# Deployment Guide

## Local Development (macOS)
Use the main `requirements.txt` file which includes macOS-specific TensorFlow packages:
```bash
pip install -r requirements.txt
python3 app.py
```

## Render.com Deployment
Use the `requirements-render.txt` file which includes standard TensorFlow packages for Linux:
```bash
pip install -r requirements-render.txt
```

## Key Differences

### Local (requirements.txt)
- `tensorflow-macos==2.15.0` - macOS optimized TensorFlow
- `tensorflow-metal==1.1.0` - Metal GPU acceleration for Apple Silicon

### Render (requirements-render.txt)
- `tensorflow==2.15.0` - Standard TensorFlow for Linux servers
- No Metal package (not needed on Linux)

## Files for Deployment
- `requirements-render.txt` - Dependencies for Render.com
- `render.yaml` - Render.com configuration
- `runtime.txt` - Python version specification
- `app.py` - Main Flask application
- `model_file.py` - TensorFlow model definition
- `pneumonia.weights.h5` - Pre-trained model weights
