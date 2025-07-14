import { extractTextFromCV } from "../utils/fileReader.js";
import OpenAI from "openai";
import { GEMINI_API_KEY, OPENAI_API_KEY } from "../config/env.config.js";
import { GoogleGenAI } from "@google/genai";
import { HTTP_SUCCESS } from "../constants/httpCode.js";

const openAI = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const uploadFile = async (req, res, next) => {
    try {
        console.log(req.file);

        const filePath = req.file.path;
        const cvText = await extractTextFromCV(filePath, req.file.mimetype);

        const PROMPT = `
- You are a resume parsing agent. Extract structured information from the following resume text and return it as a plain JSON format as specified:
{
    "fullname": "",
    "email": "",
    "phone": "",
    "dob": "",
    "address": "",
    "skills": {
        "primarySkills": [],
        "softSkills": []
    },
    "projects": [
        {
            "projectName": "",
            "projectDescription": "",
            "projectStartDate": "",
            "projectEndDate": "",
        }
    ],
    "experiences": [
        {
        "startDate": "",
        "endDate": "",
        "company": "",
        "position": "",
        "description": ""
        }
    ],
    "educations": [
        {
        "startDate": "",
        "endDate": "",
        "school": "",
        "gpa": "",
        "degree": ""
        }
    ],
    "certificates": [
        {
        "startDate": "",
        "endDate": "",
        "name": "",
        "link": ""
        }
    ],
    "summary": ""
}

 - Keys explain:
 1. fullname - user's fullname
 2. email - user's email
 3. phone - user's phone number
 4. dob - user's date of birth
 5. address - user's address
 6. skills - an object of user's skill
 6.1. primarySkills - an array of skills which user is good at base on their experiences, projects and the amount of point user assign to that skill
 6.2. softSkills - an array of skills which are remain skills or other skills or additional skills
 7. projects - an array of user's projects, each project is an object
 7.1 projectName - the project's name
 7.2 projectDescription - the project's description
 7.3 projectStartDate - the project's start date or initial date
 7.4 projectEndDate - the project's end date
 8. experiences - an array of user's working experiences, each experience is an object
 8.1. startDate - start working date
 8.2. endDate - end working date
 8.3. company - the company name which is user worked at
 8.4. position - the position of the user when working at the company
 8.5. description - the working experience description
 9. educations - an array of user's educations, each is an object
 9.1. startDate - the start date of education
 9.2. endDate - the end date of education
 9.3. school - the school name
 9.4. gpa - the user's gpa
 9.5. degree - the user's degree
 10. certificates - an array of user's certificates, each certificate is an object
 10.1. startDate - the start date of certificate
 10.2. endDate - the end date of certificate
 10.3. name - the name of certificate
 10.4. link - the link of certificate
 11. summary - user's introduction or user's description

 *Note: 
  - Some resume is in different languages
  - If some key is empty or not found the value, then specified the value of the key with null
`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: cvText,
                config: {
                    systemInstruction: PROMPT,
                    responseMimeType: "application/json",
                },
            });
            
            const parseText = JSON.parse(response.text);
            console.log(parseText);
            return res.status(HTTP_SUCCESS.OK).json({
                data: parseText
            })
        } catch (error) {
            throw new Error(error)
        }
    } catch (error) {
        next(error);
    }
}