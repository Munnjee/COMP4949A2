from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import re
from scipy.sparse import hstack
import os

# Create Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Load model and vectorizers once at startup
model = joblib.load("toxic_comment_model_logistic_regression.pkl")
char_vectorizer = joblib.load("toxic_char_vectorizer.pkl")
word_vectorizer = joblib.load("toxic_word_vectorizer.pkl")

# Text preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s!@#$%^&*()]', '', text)
    return text

# Serve the main page
@app.route("/")
def index():
    return render_template("index.html")

# Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    comment = data.get("text", "")

    clean_comment = preprocess_text(comment)
    word_features = word_vectorizer.transform([clean_comment])
    char_features = char_vectorizer.transform([clean_comment])
    combined_features = hstack([word_features, char_features])

    prob = model.predict_proba(combined_features)[0][1]
    prediction = int(prob >= 0.3)

    return jsonify({
        "prediction": prediction,
        "probability": float(prob)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render uses PORT env variable
    app.run(debug=True, host="0.0.0.0", port=port)