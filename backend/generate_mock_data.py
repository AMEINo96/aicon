import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

def main():
    np.random.seed(42)

    # Generate 50 rows of mock data for EdTech scenario
    data = {
        "study_hours": np.random.uniform(0, 10, 50).round(1),
        "past_attendance": np.random.randint(50, 100, 50),
        "quiz_scores": np.random.randint(40, 100, 50),
    }
    df = pd.DataFrame(data)
    
    # Target: Performance Score (0-100)
    noise = np.random.normal(0, 5, 50)
    df["performance_score"] = (
        df["study_hours"] * 2.5 + 
        df["past_attendance"] * 0.4 + 
        df["quiz_scores"] * 0.35 + 
        noise
    ).clip(0, 100).round(2)

    df.to_csv("dataset.csv", index=False)
    print("Mock data generated at 'dataset.csv'")

    # Train a simple Linear Regression model
    X = df[["study_hours", "past_attendance", "quiz_scores"]]
    y = df["performance_score"]
    
    model = LinearRegression()
    model.fit(X, y)

    # Save the model
    joblib.dump(model, "dummy_model.joblib")
    print("Dummy model saved at 'dummy_model.joblib'")

if __name__ == "__main__":
    main()
