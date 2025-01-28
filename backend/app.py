from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision
from googletrans import Translator
from google.cloud.vision import Image as VisionImage
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

    try:
        # 이미지 파일 읽기
        image_file = request.files['image']
        target_language = request.form['language']

        # 이미지 내용을 바이트 형식으로 읽기
        image_content = image_file.read()

        # Google Vision API를 위한 이미지 객체 생성
        image = VisionImage(content=image_content)

        # OCR 처리
        response = client.text_detection(image=image)
        texts = response.text_annotations

        if not texts:
            return jsonify({"error": "No text detected"}), 400

        extracted_text = texts[0].description

        # 번역 처리
        translated = translator.translate(extracted_text, dest=target_language)

        return jsonify({"translated_text": translated.text})

    except Exception as e:
        # 오류 처리 및 로그 출력
        app.logger.error(f"Error in translate_image: {e}")
        return jsonify({"error": "An error occurred during processing"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
