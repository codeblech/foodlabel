from flask import Flask, request, jsonify
from flask_cors import CORS
from analyze import analyze_product

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if not data or 'url' not in data:
        return jsonify({
            "success": False,
            "error": "URL is required"
        }), 400

    result = analyze_product(data['url'])
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
