// services/extractCV.js
import { readFileSync } from 'fs';
import pdfParse from 'pdf-parse';
import { extractRawText } from 'mammoth';
import path from 'path';

export async function extractTextFromCV(filePath, mimetype) {
    if (mimetype === 'application/pdf') {
        const absolutePath = path.resolve(filePath);
        const dataBuffer = readFileSync(absolutePath);
        const rawData = await pdfParse(dataBuffer);
        // const formatData = parseCVText(rawData.text);
        return rawData.text;
    } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        const result = await extractRawText({ path: filePath });
        return result.value;
    } else {
        throw new Error('Unsupported file type');
    }
}

function parseCVText(text) {
  const data = {
    fullname: null,
    phone: null,
    email: null,
    address: null,
    description: null,
    experience: [],
    education: [],
    skills: [],
    certificates: [],
    job: null,
    hobbies: [],
    languages: [],
    references: null
  };

  // Chuẩn hóa văn bản
  const cleanedText = text.replace(/\r/g, '').trim();

  // Phân dòng
  const lines = cleanedText.split('\n').map(line => line.trim()).filter(Boolean);

  // 1. Fullname: thường ở dòng đầu
  data.fullname = lines[0];

  // 2. Phone (UK format: 44 20 7123 4567 hoặc 0123456789)
  const phoneMatch = text.match(/(?:\+?\d{1,3})?[ -]?\(?\d{2,4}\)?[ -]?\d{3,4}[ -]?\d{3,4}/);
  data.phone = phoneMatch ? phoneMatch[0] : null;

  // 3. Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  data.email = emailMatch ? emailMatch[0] : null;

  // 4. Address (dò theo từ khoá thành phố thường ở dòng đầu hoặc dòng 2–3)
  const addressMatch = cleanedText.match(/\bBirmingham.*(United Kingdom)?\b/i);
  data.address = addressMatch ? addressMatch[0] : null;

  // 5. Description (từ "SUMMARY" đến "EXPERIENCE")
  const summaryMatch = cleanedText.match(/SUMMARY\s+([\s\S]+?)\s+(EXPERIENCE|WORK EXPERIENCE)/i);
  data.description = summaryMatch ? summaryMatch[1].trim() : null;

  // 6. Experience (từ "EXPERIENCE" đến "VOLUNTEERING|EDUCATION")
  const expMatch = cleanedText.match(/EXPERIENCE\s+([\s\S]+?)(VOLUNTEERING|EDUCATION)/i);
  if (expMatch) {
    data.experience = expMatch[1]
      .split(/\n(?=\w)/)
      .map(exp => exp.trim())
      .filter(Boolean);
  }

  // 7. Volunteering → coi như là 1 phần của experience nếu muốn
  const volMatch = cleanedText.match(/VOLUNTEERING\s+([\s\S]+?)\s+(EDUCATION)/i);
  if (volMatch) {
    const volunteering = volMatch[1]
      .split(/\n(?=\w)/)
      .map(v => v.trim())
      .filter(Boolean);
    data.experience.push(...volunteering);
  }

  // 8. Education
  const eduMatch = cleanedText.match(/EDUCATION\s+([\s\S]+?)\s+(KEY ACHIEVEMENTS|SKILLS|COURSES)/i);
  if (eduMatch) {
    data.education = eduMatch[1]
      .split(/\n(?=\w)/)
      .map(e => e.trim())
      .filter(Boolean);
  }

  // 9. Skills
  const skillsMatch = cleanedText.match(/SKILLS\s+([\s\S]+?)(COURSES|INTERESTS|LANGUAGES)/i);
  if (skillsMatch) {
    data.skills = skillsMatch[1]
      .split(/[\n•]+/)
      .map(skill => skill.trim())
      .filter(Boolean);
  }

  // 10. Certificates (dùng KEY ACHIEVEMENTS)
  const certMatch = cleanedText.match(/KEY ACHIEVEMENTS\s+([\s\S]+?)(SKILLS|COURSES|INTERESTS)/i);
  if (certMatch) {
    data.certificates = certMatch[1]
      .split(/\n(?=\w)/)
      .map(c => c.trim())
      .filter(Boolean);
  }

  // 11. Job: có thể lấy từ dòng đầu hoặc description
  const jobTitleMatch = lines[1]?.toLowerCase().includes('engineer') ? lines[1] : data.description?.split('.')[0];
  data.job = jobTitleMatch?.trim();

  // 12. Hobbies / Interests
  const hobbyMatch = cleanedText.match(/INTERESTS\s+([\s\S]+?)(LANGUAGES|$)/i);
  if (hobbyMatch) {
    data.hobbies = hobbyMatch[1]
      .split(/[\n•]+/)
      .map(h => h.trim())
      .filter(Boolean);
  }

  // 13. Languages
  const langMatch = cleanedText.match(/LANGUAGES\s+([\s\S]+?)$/i);
  if (langMatch) {
    data.languages = Array.from(
      new Set(langMatch[1]
        .replace(/Powered.+/gi, '')
        .split(/[\n•]+/)
        .map(l => l.trim())
        .filter(l => l && l.toLowerCase() !== 'languages'))
    );
  }

  // 14. References (nếu có)
  if (cleanedText.toLowerCase().includes('references available on request')) {
    data.references = 'Available on request';
  }

  return data;
}

