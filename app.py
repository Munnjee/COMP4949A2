from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
from scipy.sparse import hstack

# Load model and both vectorizers
model = joblib.load("toxic_comment_model_logistic_regression.pkl")
char_vectorizer = joblib.load("toxic_char_vectorizer.pkl")
word_vectorizer = joblib.load("toxic_word_vectorizer.pkl")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Text preprocessing function (same as in training)
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Remove punctuation except ones important for toxicity
    text = re.sub(r'[^\w\s!@#$%^&*()]', '', text)
    
    return text

@app.route("/")
def home():
    return "Toxic Comment Model API is live!"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    comment = data.get("text", "")
    
    # Preprocess the comment
    clean_comment = preprocess_text(comment)
    
    # Transform with both vectorizers
    char_features = char_vectorizer.transform([clean_comment])
    word_features = word_vectorizer.transform([clean_comment])
    
    # Combine features
    combined_features = hstack([char_features, word_features])
    
    # Predict using combined features
    prob = model.predict_proba(combined_features)[0][1]  # Probability of being toxic
    prediction = int(prob >= 0.3)  # Threshold can be adjusted
    
    return jsonify({
        "prediction": int(prediction),
        "probability": float(prob)
    })


if __name__ == "__main__":
    app.run(debug=True)