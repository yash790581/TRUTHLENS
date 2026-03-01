from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    
    # 🔥 Here you will add deepfake model later
    
    return {
        "result": "Deepfake",
        "confidence": 91.2,
        "risk": "High"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)