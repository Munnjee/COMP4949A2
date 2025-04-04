# NSFW Text Checker

A web application that evaluates text for workplace appropriateness using machine learning.

## Overview

This application helps users check if their message, comment, or "roast" is appropriate for workplace communication. It uses a machine learning model to analyze text and provides a probability score indicating how likely the content might be considered inappropriate.

## Features

- Real-time text analysis
- Visual probability meter
- Humorous feedback based on toxicity level
- Mobile-friendly responsive design

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Machine Learning**: scikit-learn
  - Logistic regression model
  - Character and word vectorization

## Getting Started

### Prerequisites

- Python 
- pip package manager

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/nsfw-checker.git
   cd nsfw-checker
   ```

2. Install dependencies
   ```
   pip install -r requirements.txt
   ```

3. Run the application
   ```
   python app.py
   ```

4. Visit `http://localhost:10000` in your browser

### Configuration

- The API endpoint is configured in `config.js`
- Default port is set to 10000 but can be changed via the PORT environment variable

## Deployment

This application is configured for deployment on Render using the provided `render.yaml` file:

```yaml
services:
  - type: web
    name: nsfw-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python app.py"
    plan: free
```

You can access my deployed version at [NSFW Checker](https://comp4949a2.onrender.com/).

Please note that Render may take a few minutes to spin up the service.

## How It Works

1. The application uses a machine learning model trained on toxic comment data
2. Text is processed through character and word vectorizers
3. The model predicts a probability score from 0-1
4. Scores above 0.3 are flagged as potentially inappropriate
5. User-friendly feedback is provided based on the score range

## Model Development

The machine learning model powering this application was developed in the `model.ipynb` Jupyter notebook. The development process includes:

- Data preprocessing and cleaning of toxic comment datasets
- Feature engineering using both character-level and word-level vectorization
- Model selection comparing various algorithms (Logistic Regression, Random Forest, etc.)
- Hyperparameter tuning for optimal performance
- Evaluation using precision, recall, and F1 scores
- Model serialization into the pickle files loaded by the Flask application

For those interested in the data science aspects of this project, the notebook provides detailed documentation of the entire model development process with visualizations and performance metrics.

## API Endpoints

### POST /predict

Accepts a JSON payload with text to analyze:

```json
{
  "text": "Your text here"
}
```

Returns a JSON response with prediction results:

```json
{
  "prediction": 0,
  "probability": 0.15
}
```

- `prediction`: Binary classification (1 = inappropriate, 0 = appropriate)
- `probability`: Score between 0-1 indicating likelihood of inappropriate content

## License

[MIT License](LICENSE)

## Acknowledgments

- Model trained using scikit-learn
