import { GoogleGenerativeAI } from "@google/generative-ai";

export async function checkApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing Gemini API Key. Please check your .env file.");
  }
  return key;
}

const getGenAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("API Key not found in environment variables");
  return new GoogleGenerativeAI(key);
};

export async function extractSkillsFromText(text) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Extract all technical and non-technical skills from this resume. 
    Return ONLY a JSON array of strings, nothing else.
    Include: programming languages, frameworks, tools, databases, cloud platforms, soft skills, certifications, methodologies.
    Resume text: ${text.substring(0, 10000)}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonStr = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function analyzeSkillGap(userProfile, targetRole) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const extractedSkills = [
    ...userProfile.languages || [],
    ...userProfile.topics || [],
    ...(userProfile.rawText ? ["(Extracted from text: " + userProfile.rawText.substring(0, 200) + "...)"] : [])
  ].join(", ");

  const roleRequirements = [
    ...targetRole.skills.technical,
    ...targetRole.skills.nonTechnical
  ].join(", ");

  const prompt = `
    You are a career analysis AI. Always respond in valid JSON only.

    Analyze this profile for the target role.
    Profile skills: ${extractedSkills}
    Target role: ${targetRole.title}
    Required skills for ${targetRole.title}: ${roleRequirements}

    Respond in this exact JSON format:
    {
      "strengths": ["skill1", "skill2"],
      "criticalGaps": ["skill1", "skill2"],  
      "niceToHaveGaps": ["skill1", "skill2"],
      "experienceLevel": "beginner|intermediate|advanced",
      "readinessScore": 0-100,
      "summary": "One paragraph analysis"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function generateRoadmap(userProfile, targetRole, gaps, experienceLevel) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const criticalGaps = gaps.critical.join(", ");

  const prompt = `
    You are a career roadmap generator. Always respond in valid JSON only.

    Generate a 30-day learning roadmap.
    Person's level: ${experienceLevel}
    Target role: ${targetRole.title}
    Critical gaps to fill: ${criticalGaps}
    Time available: 1-2 hours per day

    Respond in this exact JSON:
    {
      "weeks": [
        {
          "weekNumber": 1,
          "theme": "Week theme name",
          "days": [
            {
              "day": 1,
              "focus": "Topic to learn",
              "resource": {
                "title": "Resource name",
                "url": "https://actual-url.com",
                "type": "video|article|course|docs"
              },
              "project": "Mini exercise or project",
              "checkpoint": "What you should know by end of day"
            }
            // ... 7 days
          ]
        }
        // ... 4 weeks
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function reevaluateRoadmap(weekNumber, completedTopics, remainingPlan) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Week ${weekNumber} of the roadmap is complete. 
    Completed topics: ${JSON.stringify(completedTopics)}
    Original plan for remaining weeks: ${JSON.stringify(remainingPlan)}
    Should the remaining weeks be adjusted? 
    If yes, return updated JSON for the remaining weeks only (weeks ${weekNumber + 1} to 4).
    If no changes needed, return {"adjusted": false}
    
    Always respond in valid JSON only.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonStr);
}
