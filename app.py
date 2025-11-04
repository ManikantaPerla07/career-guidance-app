from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import numpy as np
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

print("Loading models...")
try:
    with open('rf_model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✓ Model loaded")
except FileNotFoundError:
    print("ERROR: rf_model.pkl not found!")

try:
    with open('label_encoder.pkl', 'rb') as f:
        label_encoder = pickle.load(f)
    print("✓ Label encoder loaded")
except FileNotFoundError:
    print("ERROR: label_encoder.pkl not found!")

try:
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    print("✓ Scaler loaded")
except FileNotFoundError:
    print("ERROR: scaler.pkl not found!")

FEATURES = [
    'O_score', 'C_score', 'E_score', 'A_score', 'N_score',
    'Numerical Aptitude', 'Spatial Aptitude', 'Perceptual Aptitude',
    'Abstract Reasoning', 'Verbal Reasoning'
]

print(f"✓ Total careers: {len(label_encoder.classes_)}")
print("=" * 50)

# ==================== ROUTES ====================

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        missing = [f for f in FEATURES if f not in data]
        if missing:
            return jsonify({
                'success': False,
                'error': f'Missing fields: {", ".join(missing)}'
            }), 400
        
        values = []
        for feature in FEATURES:
            val = float(data[feature])
            if val < 0 or val > 10:
                return jsonify({
                    'success': False,
                    'error': f'{feature} must be between 0 and 10'
                }), 400
            values.append(val)
        
        input_array = np.array([values])
        scaled = scaler.transform(input_array)
        probs = model.predict_proba(scaled)[0]
        
        top_indices = np.argsort(probs)[-5:][::-1]
        
        recommendations = []
        for rank, idx in enumerate(top_indices, 1):
            recommendations.append({
                'rank': rank,
                'career': label_encoder.classes_[idx],
                'confidence': round(float(probs[idx]) * 100, 2)
            })
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/careers', methods=['GET'])
def get_careers():
    return jsonify({
        'total': len(label_encoder.classes_),
        'careers': sorted(label_encoder.classes_.tolist())
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')