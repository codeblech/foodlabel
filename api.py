from flask import Flask, request, jsonify
from flask_cors import CORS
from analyze import analyze_product
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# More specific CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": ["https://foodxray.netlify.app", "http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": False,
        "send_wildcard": False
    }
})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    # Get the origin from the request
    origin = request.headers.get('Origin')
    allowed_origins = ["https://foodxray.netlify.app", "http://localhost:5173"]
    
    # Only allow specific origins
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        return response
        
    # Handle URL-based analysis
    if request.is_json:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({
                "success": False,
                "error": "URL is required"
            }), 400
        return jsonify(analyze_product(data['url'], is_url=True))

    # Handle image upload analysis
    if 'image' not in request.files:
        return jsonify({
            "success": False,
            "error": "No image file provided"
        }), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({
            "success": False,
            "error": "No selected file"
        }), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze the uploaded image
        result = analyze_product(filepath, is_url=False)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)

    return jsonify({
        "success": False,
        "error": "Invalid file type"
    }), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# python api.py
