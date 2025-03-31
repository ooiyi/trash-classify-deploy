from flask import Flask, request, jsonify
import torch
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename
from ultralytics import YOLO  # Using YOLOv8
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

@app.route('/predict', methods=['POST'])
def predict():
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No valid files selected"}), 400

    results_dict = {}

    for file in files:
        if file.filename == '' or not allowed_file(file.filename):
            continue  # Skip invalid files

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Run inference
        results = model(file_path)
        
        # Process results
        class_counts = {"glass": 0, "metal": 0, "plastic": 0}
        class_labels = ["glass", "metal", "plastic"]  # Ensure these match your model labels

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls.item())  # Get class ID
                label = class_labels[class_id]
                if label in class_counts:
                    class_counts[label] += 1

        results_dict[filename] = class_counts

        os.remove(file_path)  # Cleanup

    return jsonify(results_dict)

if __name__ == '__main__':
    app.run(debug=True)