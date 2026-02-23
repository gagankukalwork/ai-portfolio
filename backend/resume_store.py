import os

FILE = "resume_text.txt"

def save_resume(text):
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(text)

def load_resume():
    if not os.path.exists(FILE):
        return ""
    with open(FILE, "r", encoding="utf-8") as f:
        return f.read()