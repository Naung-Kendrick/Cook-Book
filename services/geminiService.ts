import { GoogleGenAI, Type } from "@google/genai";
import { RecipeFormData, RecipeSuggestion } from "../types";

const MODEL_ID = 'gemini-2.5-flash';

// Helper to safely initialize the AI client
const getAI = () => {
  let apiKey: string | undefined;

  // 1. Try process.env.API_KEY (Standard & Local)
  try {
    if (process.env.API_KEY) apiKey = process.env.API_KEY;
  } catch (e) {}

  // 2. Try VITE_API_KEY (Vite / Vercel default for some setups)
  if (!apiKey) {
    try {
      // @ts-ignore
      if (import.meta.env?.VITE_API_KEY) apiKey = import.meta.env.VITE_API_KEY;
    } catch (e) {}
  }

  // 3. Try REACT_APP_API_KEY (Create React App)
  if (!apiKey) {
    try {
      if (process.env.REACT_APP_API_KEY) apiKey = process.env.REACT_APP_API_KEY;
    } catch (e) {}
  }

  // 4. Try NEXT_PUBLIC_API_KEY (Next.js)
  if (!apiKey) {
    try {
      if (process.env.NEXT_PUBLIC_API_KEY) apiKey = process.env.NEXT_PUBLIC_API_KEY;
    } catch (e) {}
  }
  
  if (!apiKey) {
    throw new Error("API Key is missing. On Vercel, please rename your environment variable to 'VITE_API_KEY' (or 'REACT_APP_API_KEY') in Settings and REDEPLOY.");
  }
  
  // Initialize Gemini with the API key
  return new GoogleGenAI({ apiKey });
};

export const generateRecipeWithAI = async (prompt: string): Promise<RecipeFormData> => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: `Generate a cooking recipe for: ${prompt}. 
    Determine the most appropriate category strictly from this list: 'Drinks', 'Soups', 'Grilled Food', 'Myanmar Traditional Food', 'Thai Traditional Food', 'Ta'ang (Palaung) Traditional Food', 'Other'.
    Return a JSON object only.`,
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
          category: {
            type: Type.STRING,
            description: "One of: 'Drinks', 'Soups', 'Grilled Food', 'Myanmar Traditional Food', 'Thai Traditional Food', 'Ta'ang (Palaung) Traditional Food', 'Other'",
            enum: ['Drinks', 'Soups', 'Grilled Food', 'Myanmar Traditional Food', 'Thai Traditional Food', 'Ta\'ang (Palaung) Traditional Food', 'Other']
          }
        },
        required: ["name", "ingredients", "steps", "cookingTime", "category"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text) as RecipeFormData;
};

export const suggestRecipesFromIngredients = async (ingredients: string): Promise<RecipeSuggestion[]> => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: `I have these ingredients: ${ingredients}. Suggest 3 distinct recipes I can make. 
    Focus on rustic, home-cooked meals.
    For each suggestion, list what ingredients from my list are used, and what key ingredients might be missing (salt, pepper, oil, water are assumed to be available).
    Return a JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the suggested dish" },
            description: { type: Type.STRING, description: "A appetizing 1-sentence description" },
            usedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "description", "usedIngredients", "missingIngredients"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text) as RecipeSuggestion[];
};