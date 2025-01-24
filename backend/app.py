import os
from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
from googletrans import Translator

# Flask 앱 초기화
app = Flask(__name__)
UPLOAD_FOLDER = './temp'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Google Translator 초기화
translator = Translator()

# OCR로 텍스트 추출
def extract_text_from_image(image_path):
    return pytesseract.image_to_string(Image.open(image_path))

# 번역 함수
def translate_text(text, target_language='en'):
    translated = translator.translate(text, dest=target_language)
    return translated.text

# API 엔드포인트
@app.route('/translate', methods=['POST'])
def translate():
    if 'image' not in request.files:
        return jsonify({'error': '이미지가 필요합니다'}), 400
    
    # 이미지 저장
    image = request.files['image']
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(image_path)

    # OCR로 텍스트 추출
    extracted_text = extract_text_from_image(image_path)

    # 번역 (기본: 영어로 번역)
    target_language = request.form.get('language', 'en')
    translated_text = translate_text(extracted_text, target_language)

    return jsonify({
        'original_text': extracted_text,
        'translated_text': translated_text
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
