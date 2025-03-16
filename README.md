
# Text Translation App

A simple mobile application that allows users to capture an image, extract text from it using OCR (Optical Character Recognition), and translate the text into a desired language.

## Features

- **Capture Image**: Take a photo directly within the app.
- **Text Extraction**: Extract text from images using Google Cloud Vision API.
- **Translation**: Translate extracted text to a specified language using Google Translate API or other translation services.
- **Reset Functionality**: Refresh the app to its initial state for new translations.
- **User-Friendly Interface**: Designed with a clean UI for seamless interaction.

## Requirements

### Backend
- Flask
- Google Cloud Vision API
- Google Translate API

### Frontend
- React Native
- Expo CLI
- Expo libraries:
  - `expo-image-picker`

## Installation

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/jjbmsda/TextTransfer.git
   cd text-translation-app/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up Google Cloud Vision API:
   - Follow [Google Cloud Vision API setup instructions](https://cloud.google.com/vision/docs/setup) to create a service account and download the credentials JSON file.
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="path-to-your-credentials.json"
     ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code from your Expo Go app to launch the application.

## Usage

1. Launch the app on your mobile device.
2. Enter the target language code (e.g., `en` for English, `ko` for Korean).
3. Capture a photo containing text.
4. Click on the "Translate" button.
5. View the translated text on the screen.

## Folder Structure

```
text-translation-app/
│
├── backend/
│   ├── app.py                # Flask backend logic
│   ├── requirements.txt      # Python dependencies
│   └── ...                   # Additional backend files
│
├── frontend/
│   ├── App.js                # Main React Native application
│   ├── package.json          # Frontend dependencies
│   └── ...                   # Additional frontend files
│
└── README.md                 # Documentation
```

## API Endpoints

### `/translate` (POST)

**Description**: Accepts an image and a target language, performs OCR on the image, and translates the extracted text.

**Request**:
- `image` (file): The image to be processed.
- `language` (string): Target language code.

**Response**:
- `translated_text` (string): Translated text.

**Example**:
```json
{
  "translated_text": "This is the translated text."
}
```

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License. 
See the `LICENSE` file for details.

## Contact

For any questions or issues, feel free to reach out. :

- **Email**: jjbmsda@gmail.com
- **GitHub**: [jjbmsda](https://github.com/jjbmsda)
