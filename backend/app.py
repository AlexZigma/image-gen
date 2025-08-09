from flask import Flask, jsonify, send_from_directory, request
from gan_model import generate_image
import os
from datetime import datetime
from flask_cors import CORS
import uuid
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///images.db'
app.config['GENERATED_DIR'] = "generated"
db = SQLAlchemy(app)

# create dir 'generated' if it not exists
if not os.path.exists(app.config['GENERATED_DIR']):
    os.makedirs(app.config['GENERATED_DIR'])


class Image(db.Model):
    id = db.Column(db.String(255), primary_key=True)
    filename = db.Column(db.String(255), nullable=False)

# generate new image
@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get('prompt')
    print(prompt)
    
    image_id = str(uuid.uuid4())
    filename = f"{image_id}.png"
    path = os.path.join(app.config['GENERATED_DIR'], filename)
    generate_image(path)

    # save to db
    image = Image(
        id = image_id,
        filename = filename
    )
    db.session.add(image)
    db.session.commit()

    # return image
    image_obj = {'id': image_id, "filename": filename}
    return jsonify(image_obj)

# get all images
@app.route('/images', methods=['GET'])
def get_images():
    images = Image.query.all()
    return jsonify([{
        'id': image.id, 'filename': image.filename
        } for image in images])

# get image by id
@app.route("/images/<filename>")
def get_image(filename):
    # image = db.get_or_404(Image, image_id)
    return send_from_directory(app.config['GENERATED_DIR'], filename)

# delete image by id
@app.route('/delete/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = db.get_or_404(Image, image_id)
    # if not image:
    #     return jsonify({"error": "Image not found"}), 404
    
    # remove from disk
    path = os.path.join(app.config['GENERATED_DIR'], image.filename)
    if os.path.exists(path):
        os.remove(path)

    # remove from db
    db.session.delete(image)
    db.session.commit()
    
    return jsonify({'message': 'Image deleted'})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

