import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateEmailTemplate = async (
  topic: string, 
  audience: string, 
  tone: string
): Promise<{ subject: string; body: string }> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("No API Key found, returning mock response");
      return {
        subject: `Opportunity regarding ${topic}`,
        body: `Hi {name},\n\nI noticed you work at {company} and wanted to reach out regarding ${topic}. \n\nWe specialize in helping companies like yours succeed. \n\nBest,\n[Your Name]`
      };
    }

    const model = 'gemini-3-flash-preview';
    const prompt = `Write a cold email subject line and body. 
    Topic: ${topic}
    Audience: ${audience}
    Tone: ${tone}
    
    The email body should use variables like {name} and {company}.
    Return the response as a valid JSON object with keys "subject" and "body".
    Do not include markdown code block syntax (like \`\`\`json). Just the raw JSON string.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response from Gemini");

    // Basic cleanup in case the model adds backticks despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini generation failed:", error);
    throw error;
  }
};

export const analyzeCampaignPerformance = async (
  stats: { sent: number; opened: number; replied: number; bounced: number }
): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return "Simulation completed. Metrics look good relative to industry standards.";
        }
        
        const model = 'gemini-3-flash-preview';
        const prompt = `Analyze these email campaign stats and give a 1-sentence summary of performance:
        Sent: ${stats.sent}
        Opened: ${stats.opened}
        Replied: ${stats.replied}
        Bounced: ${stats.bounced}
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text || "Analysis complete.";
    } catch (error) {
        console.error("Gemini analysis failed", error);
        return "Could not generate AI analysis.";
    }
}
