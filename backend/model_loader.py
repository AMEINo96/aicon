import joblib
import os
import warnings

# Suppress scikit-learn warnings
warnings.filterwarnings("ignore")

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_MODEL_FILENAME = "dummy_model.joblib"


def _resolve_model_path():
    """Find dummy_model.joblib next to this file, in cwd, or at repo root."""
    candidates = [
        os.path.join(_BACKEND_DIR, _MODEL_FILENAME),
        os.path.join(os.getcwd(), _MODEL_FILENAME),
        os.path.join(os.path.dirname(_BACKEND_DIR), _MODEL_FILENAME),
    ]
    seen = set()
    for path in candidates:
        normalized = os.path.normpath(path)
        if normalized in seen:
            continue
        seen.add(normalized)
        if os.path.isfile(normalized):
            return normalized
    return None


def get_prediction(features: list) -> float:
    model_path = _resolve_model_path()
    if model_path:
        model = joblib.load(model_path)
        prediction = model.predict([features])[0]
        return round(prediction, 2)

    # Fallback dummy logic if model not generated yet
    study, att, quiz = features
    return round((study * 2.5) + (att * 0.4) + (quiz * 0.35), 2)
