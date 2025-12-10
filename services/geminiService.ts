import { GoogleGenAI, Type } from "@google/genai";
import { RecipeFormData } from "../types";

// Initialize Gemini
// Note: In a real environment, allow the user to input their key or use a proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRecipeWithAI = async (prompt: string): Promise<RecipeFormData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const modelId = 'gemini-2.5-flash';

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Generate a cooking recipe for: ${prompt}. Return a JSON object only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the dish" },
          ingredients: { 
            type: Type.STRING, 
            description: "List of ingredients, each on a new line or comma separated" 
          },
          steps: { 
            type: Type.STRING, 
            description: "Cooking instructions, step by step, separated by newlines" 
          },
          cookingTime: { 
            type: Type.NUMBER, 
            description: "Total cooking time in minutes" 
          },
        },
        required: ["name", "ingredients", "steps", "cookingTime"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text) as RecipeFormData;
};
