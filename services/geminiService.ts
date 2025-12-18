
import { GoogleGenAI, Type } from "@google/genai";
import { Appointment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartInsights = async (appointments: Appointment[]) => {
  const prompt = `Analyze the following appointment data and provide 3-4 key insights for the business owner. Focus on trends, busy times, or client patterns. Format the output as a clean bulleted list.

  Data: ${JSON.stringify(appointments)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time.";
  }
};

export const generateClientEmailDraft = async (clientName: string, appointmentDate: string, status: string) => {
  const prompt = `Generate a professional and friendly email draft for a client named ${clientName} regarding their appointment on ${appointmentDate}. The current status is ${status}. Keep it concise and welcoming.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating draft.";
  }
};

export const getSmartSummary = async (clientName: string, history: any[]) => {
    const prompt = `You are an AI assistant for a business manager. Summarize the history of interactions for client ${clientName}. 
    History: ${JSON.stringify(history)}
    Provide a concise summary (2-3 sentences) of their relationship with the business.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text;
    } catch (e) {
        return "Summary unavailable.";
    }
}
