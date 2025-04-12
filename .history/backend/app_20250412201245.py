from flask import Flask, request, jsonify
import torch
import os
import cv2
import numpy as np
import uuid
from werkzeug.utils import secure_filename
from ultralytics import YOLO  # YOLOv8
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

# Allowed file types
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4'}

# Ensure the uploads directory exists
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return '✅ Flask is running'

@app.route('/predict', methods=['POST'])
def predict():
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No valid files selected"}), 400

    detection_results = []
    class_labels = ["glass", "metal", "plastic"]

    for file in files:
        if file.filename == '' or not allowed_file(file.filename):
            continue  # Skip invalid files

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Run inference
        results = model(file_path)

        # Extract predictions
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls.item())
                label = class_labels[class_id].capitalize()

                detection_results.append({
                    "filename": filename,
                    "detectionId": "",       # Can fill with uuid if needed
                    "type": label,           # Detected class
                    "latitude": "",          # Optional
                    "longitude": "",         # Optional
                    "location": "",          # Optional
                    "timestamp": ""          # Optional
                })

        os.remove(file_path)  # Clean up

    return jsonify(detection_results)

# Remove this for Railway:
if __name__ == '__main__':
    app.run(debug=True)
