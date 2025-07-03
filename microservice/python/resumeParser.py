# resume_gpt_agent.py
import os
from flask import Flask, request, jsonify
from docling.document_converter import DocumentConverter
from flask_cors import CORS
import re
import tempfile
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
converter = DocumentConverter()

def extract_info(text):
    # Các regex mẫu
    email = re.findall(r'[\w\.-]+@[\w\.-]+', text)
    phone = re.findall(r'\+?\d[\d\s\-]{8,}', text)
    name = re.findall(r'(?i)(?:name|full name)[:\-]?\s*(.+)', text)
    address = re.findall(r'(?i)(?:address)[:\-]?\s*(.+)', text)

    # Giả lập ví dụ tách bằng từ khóa
    skills = re.findall(r'(?i)skills?[:\-]?\s*(.+)', text)
    experience = re.findall(r'(?i)experience|work history[:\-]?\s*(.+)', text)
    education = re.findall(r'(?i)education[:\-]?\s*(.+)', text)
    certifications = re.findall(r'(?i)certifications?[:\-]?\s*(.+)', text)
    summary = re.findall(r'(?i)summary[:\-]?\s*(.+)', text)

    return {
        "full_name": name[0] if name else None,
        "email": email[0] if email else None,
        "phone": phone[0] if phone else None,
        "address": address[0] if address else None,
        "skills": skills[0].split(',') if skills else [],
        "experience": experience[0] if experience else None,
        "education": education[0] if education else None,
        "certifications": certifications[0].split(',') if certifications else [],
        "summary": summary[0] if summary else None
    }

@app.route("/upload", methods=["POST"])
def upload_resume():
    print(request.form)
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # 🔧 Lưu file vào file tạm thời và lấy đường dẫn
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            file.save(tmp.name)
            temp_path = tmp.name

        # ✅ Truyền đúng kiểu vào converter (path dạng string)
        result = converter.convert(temp_path)
        text = result.document.export_to_markdown()
        extracted = extract_info(text)

        return jsonify({
            "message": "CV parsed successfully",
            "content": extracted
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # 🧹 Xoá file tạm sau xử lý
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(debug=True)
