import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, GeminiEnhancement } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
}

export const enhanceProductInfo = async (product: ProductData): Promise<GeminiEnhancement> => {
  const ai = getClient();
  if (!ai) {
    return {
      aiStorageTip: "AI key missing.",
      recipeIdea: "AI features unavailable.",
      funFact: "Did you know? This app uses Open Food Facts!"
    };
  }

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

export const generateStorageImage = async (productName: string, storageTip: string): Promise<string | null> => {
    const ai = getClient();
    if (!ai) return null;

    const prompt = `A photorealistic, clean, bright educational photo showing exactly how to store ${productName}. 
    The storage instruction is: "${storageTip}". 
    Show the food in the correct context (e.g. inside a fridge, on a shelf, in a jar). 
    Make it look like a high-quality lifestyle stock photo.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                // Image generation doesn't use responseMimeType/Schema
            }
        });

        // Iterate through parts to find the image
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Image Gen Error:", error);
        return null;
    }
};

export const generateVeoVideo = async (
  imageBase64: string, 
  prompt: string, 
  aspectRatio: '16:9' | '9:16'
): Promise<string | null> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  // Extract pure base64 and mimeType
  // Expect format: data:image/png;base64,.....
  const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data format. Please use a valid image file.");
  }
  const mimeType = match[1];
  const imageBytes = match[2];

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Cinematic video of this food",
      image: {
        imageBytes: imageBytes,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', 
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned from model");

    // Append API Key for access
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};
