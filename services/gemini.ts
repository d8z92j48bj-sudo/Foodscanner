import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, GeminiEnhancement } from "../types";

export const enhanceProductInfo = async (product: ProductData): Promise<GeminiEnhancement> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API_KEY found for Gemini.");
    return {
      aiStorageTip: "AI key missing.",
      recipeIdea: "AI features unavailable.",
      funFact: "Did you know? This app uses Open Food Facts!"
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    I have a food product with the following details:
    Name: ${product.name}
    Brand: ${product.brand}
    Categories: ${product.categories}
    Ingredients: ${product.ingredientsText || 'Unknown'}

    Please provide:
    1. A smart, concise storage tip specifically for this product type to maximize freshness.
    2. A simple, creative 1-sentence serving suggestion or mini-recipe idea.
    3. A short, interesting fun fact about this type of food.

    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                aiStorageTip: { type: Type.STRING },
                recipeIdea: { type: Type.STRING },
                funFact: { type: Type.STRING }
            }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text) as GeminiEnhancement;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      aiStorageTip: "Could not retrieve AI tips.",
      recipeIdea: "Could not retrieve recipe.",
      funFact: "Could not retrieve fun fact."
    };
  }
};