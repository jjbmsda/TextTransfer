from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision
from googletrans import Translator
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

client = vision.ImageAnnotatorClient()  # Google Cloud Vision Client
translator = Translator()  # Google Translate API

@app.route('/translate', methods=['POST'])
def translate_image():
    if 'image' not in request.files or 'language' not in request.form:
        return jsonify({"error": "Missing image or language"}), 400

    image_file = request.files['image']
    target_language = request.form['language']

    # OCR 처리
    image = Image.open(io.BytesIO(image_file.read()))
    image_byte_array = io.BytesIO()
    image.save(image_byte_array, format='JPEG')
    image_content = image_byte_array.getvalue()

    response = client.text_detection(image=image_content)
    texts = response.text_annotations

    if not texts:
        return jsonify({"error": "No text detected"}), 400

    extracted_text = texts[0].description

    # 번역 처리
    translated = translator.translate(extracted_text, dest=target_language)

    return jsonify({"translated_text": translated.text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
