
import { GoogleGenAI } from "@google/genai";

export const getCohortInsights = async (stats: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `
    As a senior educational program manager, analyze the following student cohort data and provide 3 actionable insights.
    
    Data Summary:
    - Average Completion Rate: ${stats.completionRate}%
    - Students at Risk: ${stats.riskStudents.join(', ')}
    - Top Performers: ${stats.topPerformers.join(', ')}
    - Task breakdown: HW1 (${stats.tasks.hw1}%), Group Attendance (${stats.tasks.attendance}%)

    Focus on identifying bottlenecks and recommending interventions for struggling students. Keep the tone professional and encouraging.
    Format your response as a clean bulleted list.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate insights at this time. Please check your connection.";
  }
};
