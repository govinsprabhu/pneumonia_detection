from flask import Flask, request, jsonify, render_template
import os
import model_file
from PIL import Image
import numpy as np
import logging
import traceback

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok = True)

model = model_file.create_model()
model.load_weights('pneumonia.weights.h5')

def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}

def process_image(image_path):
    try:
        img = Image.open(image_path)

        if img.mode in ['RGB', 'RGBA']:
            img = img.convert('L')

        try:
            img = img.resize((150, 150), Image.Resampling.LANCZOS)
        except AttributeError:
            # Fallback for older Pillow versions
            img = img.resize((150, 150), Image.LANCZOS)
        img_array = np.array(img, dtype=np.float32)/255.0
        img_array = np.expand_dims(img_array, axis=0)

        return img_array

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        logger.error(traceback.format_exc())
        raise

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error':'No File Uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error':'No File Selected'}), 400
        
        if not allowedFile(file.filename):
            return jsonify({'error':'unvalid file type'}), 400
        
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        logger.debug(f"Saving file to: {filepath}")
        file.save(filepath)

        try:
            processedImage = process_image(filepath)
            prediction = model.predict(processedImage)

            if prediction[0][0] > 0.5:
                result='Pneumonia'
                confidence = float(prediction[0][0])
            else:
                result='Normal'
                confidence = 1 - prediction[0][0]

            return jsonify({
                'result':result,
                'confidence':f"{confidence:.2%}",
            })
        
        except Exception as e:
            logger.error(f"Error Processing Image: {str(e)}")

            if os.path.exists(filepath):
                os.remove(filepath)

            return jsonify({'error':'Error processing image'}), 500
        


    except Exception as e:
        raise

# Configure the app for production
app.config['DEBUG'] = False
port = int(os.environ.get('PORT', 8000))

if __name__ == '__main__':
    # This block will only run when you execute app.py directly (not through gunicorn)
    app.run(host='0.0.0.0', port=port)