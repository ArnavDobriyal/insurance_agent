"""
Whisper Speech-to-Text Server
Local speech recognition using OpenAI Whisper
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os

app = Flask(__name__)
CORS(app)

# Load Whisper model (base model - good balance of speed and accuracy)
# Options: tiny, base, small, medium, large
print("Loading Whisper model...")
model = whisper.load_model("base", download_root="~/.cache/whisper")
print("✅ Whisper model loaded!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model": "whisper-base"})

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """
    Transcribe audio to text using Whisper
    Accepts: audio file (webm, mp3, wav, etc.)
    Returns: { "text": "transcribed text" }
    """
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name
        
        try:
            # Transcribe using Whisper
            print(f"🎤 Transcribing audio...")
            result = model.transcribe(temp_path, language='en')
            text = result["text"].strip()
            
            print(f"✅ Transcription: {text}")
            
            return jsonify({
                "text": text,
                "language": result.get("language", "en")
            })
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        print(f"❌ Transcription error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Whisper server on http://localhost:5001")
    print("📝 Endpoint: POST /transcribe")
    print("💡 Send audio file as 'audio' in form-data")
    app.run(host='0.0.0.0', port=5001, debug=False)
