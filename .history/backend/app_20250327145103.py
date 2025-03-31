from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from ultralytics import YOLO  # YOLOv8
from flask_cors import CORS
from uuid import uuid4
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained YOLOv8 model
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

# Allowed file types
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4'}

# Directory to temporarily store uploads
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Check for valid file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
def predict():
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No valid files selected"}), 400

    detection_results = []
    class_labels = ["glass", "metal", "plastic"]  # Must match your model training order

    for file in files:
        if file.filename == '' or not allowed_file(file.filename):
            continue  # Skip invalid files

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Run YOLOv8 detection
        results = model(file_path)

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls.item())
                label = class_labels[class_id].capitalize()

                # Append detection result
                detection_results.append({
                    "detectionId": "",
                    "type": label,
                    "latitude": "",
                    "longitude": "",
                    "location": "",
                    "timestamp": ""
                })

        os.remove(file_path)  # Cleanup

    return jsonify(detection_results)

if __name__ == '__main__':
    app.run(debug=True)
