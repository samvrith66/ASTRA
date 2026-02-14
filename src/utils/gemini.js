export async function callGemini(prompt) {

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    console.log("Gemini key exists:", !!apiKey);

    if (!apiKey) {
        throw new Error("Gemini API key missing from .env");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    "Return ONLY valid raw JSON. No markdown. No explanation.\n\n" +
                                    prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 4096
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API error:", error);
        throw new Error(error.error?.message || "Gemini failed");
    }

    const data = await response.json();

    console.log("Gemini raw response:", data);

    let text =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
        throw new Error("Empty Gemini response");
    }

    // Clean markdown safely
    text = text.replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("Invalid JSON format from Gemini");
    }

    const jsonString = text.substring(start, end + 1);

    console.log("Clean JSON:", jsonString);

    return JSON.parse(jsonString);
}
