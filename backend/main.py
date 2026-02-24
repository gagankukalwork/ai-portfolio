from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import requests
import pdfplumber

from database import engine, Base, SessionLocal
from models import Chat
from resume_store import save_resume, load_resume

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Fallback resume if user hasn't uploaded PDF yet
RESUME_CONTEXT = """
Gagan is a Full Stack Developer skilled in:
- HTML, CSS, JavaScript
- React, TypeScript
- Node.js, Express
- Python, FastAPI
- PostgreSQL
- REST API development
- AI integrations using OpenRouter

He has built full stack applications including DOM based drum kit,
API testing tool like Postman, and analytics dashboards.
""".strip()


@app.get("/")
def home():
    return {"status": "Backend running"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["application/pdf", "application/x-pdf"]:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    text = ""
    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read PDF")

    text = text.strip()
    if len(text) < 50:
        raise HTTPException(status_code=400, detail="Could not extract enough text from PDF")

    save_resume(text)
    return {"ok": True, "message": "Resume uploaded", "chars": len(text)}


@app.post("/chat")
def chat(data: dict):
    question = (data.get("question") or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    
    uploaded_resume = load_resume()
    resume_source = uploaded_resume if uploaded_resume else RESUME_CONTEXT

    prompt = f"""
You are an AI assistant. Answer ONLY using the resume content below.
If the answer is not in the resume, say: "I don't have that information in the resume."

RESUME:
{resume_source}

User Question: {question}
""".strip()

    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY missing in .env")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                # Use any free model you prefer on OpenRouter.
                # If this model doesn't work for you, replace it with another available one.
                "model": "openai/gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=60,
        )
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to reach OpenRouter")

    if response.status_code != 200:
        
        raise HTTPException(status_code=502, detail=f"OpenRouter error: {response.text}")

    data_json = response.json()
    try:
        answer = data_json["choices"][0]["message"]["content"]
    except Exception:
        raise HTTPException(status_code=502, detail="Unexpected OpenRouter response format")

    
    db: Session = SessionLocal()
    try:
        entry = Chat(question=question, answer=answer)
        db.add(entry)
        db.commit()
    finally:
        db.close()

    return {"answer": answer}
