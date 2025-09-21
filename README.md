# Pneumonia Detection Web Application

This is a web application that uses a deep learning model to detect pneumonia from chest X-ray images. The application provides a user-friendly interface for uploading X-ray images and displays the prediction results with confidence scores.

## Features

- Drag and drop interface for image upload
- Real-time image preview
- Pneumonia detection with confidence score
- Responsive design for all devices
- Modern and clean user interface

## Setup Instructions

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your web browser and navigate to:
```
http://localhost:5000
```

## Usage

1. Click on the upload area or drag and drop an X-ray image
2. Wait for the analysis to complete
3. View the results showing whether the X-ray indicates pneumonia or not
4. The confidence score indicates how certain the model is about its prediction

## Technical Details

- Backend: Python Flask
- Frontend: HTML, CSS, JavaScript
- Model: TensorFlow/Keras
- Image Processing: Pillow

## Note

This application is for educational and research purposes only. Always consult with healthcare professionals for medical diagnosis. 