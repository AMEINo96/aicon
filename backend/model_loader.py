import joblib
import os
import warnings

# Suppress scikit-learn warnings
warnings.filterwarnings("ignore")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "dummy_model.joblib")

def get_prediction(features: list) -> float:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        prediction = model.predict([features])[0]
        return round(prediction, 2)
    else:
        # Fallback dummy logic if model not generated yet
        study, att, quiz = features
        return round((study * 2.5) + (att * 0.4) + (quiz * 0.35), 2)
