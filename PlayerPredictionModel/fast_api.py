from fastapi import FastAPI, Request
import numpy as np
import joblib

# Load it later
loaded_model = joblib.load('random_forest_model_compress_3.pkl')

app = FastAPI()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predicts")
async def predict(data: Request):
    json_data = await data.json()
    features = np.array(json_data["features"]).reshape(1, -1)
    prediction = loaded_model.predict(features)
    return {"prediction": prediction.tolist()[0]}