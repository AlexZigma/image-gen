from flask import Flask, jsonify, send_from_directory
from gan_model import generate_image
import os
from datetime import datetime
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

GENERATED_DIR = "generated"
os.makedirs(GENERATED_DIR, exist_ok=True)

images_data = []

@app.route("/generate", methods=["GET"])
def generate():
    img_id = str(uuid.uuid4())
    filename = f"{img_id}.png"
    path = os.path.join(GENERATED_DIR, filename)
    generate_image(path)
    img_obj = {'id': img_id, "img": f"http://localhost:5000/images/{filename}"}
    images_data.append(img_obj)
    return jsonify(img_obj)

@app.route('/images', methods=['GET'])
def get_images():
    return jsonify(images_data)

@app.route("/images/<path:filename>")
def get_image(filename):
    return send_from_directory(GENERATED_DIR, filename)

@app.route('/delete/<img_id>', methods=['DELETE'])
def delete_image(img_id):
    global images_data
    img = next(filter(lambda x: x['id'] == img_id, images_data))
    if not img:
        return jsonify({"error": "Image not found"}), 404
    images_data = list(filter(lambda x: x['id'] != img_id, images_data))
    image_path = os.path.join(GENERATED_DIR, os.path.basename(img['img']))
    if os.path.exists(image_path):
        os.remove(image_path)
    return jsonify({'message': 'Image deleted'})

if __name__ == "__main__":
    app.run(debug=True)

