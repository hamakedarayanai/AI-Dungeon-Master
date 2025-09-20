
import { GoogleGenAI, Type } from "@google/genai";
import type { StorySegment, UploadedImage, GeminiResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    storyText: {
      type: Type.STRING,
      description: 'The next segment of the story, written in an engaging, narrative style. It should be about 2-3 paragraphs long.'
    },
    choices: {
      type: Type.ARRAY,
      description: 'An array of 3 distinct, actionable choices for the player to make next.',
      items: {
        type: Type.STRING
      }
    }
  },
  required: ['storyText', 'choices'],
};

function buildPrompt(history: StorySegment[]): string {
    const historyText = history.map(segment => {
        if (segment.from === 'user') {
            return `The player chose to: "${segment.text}"`;
        }
        return `Story: ${segment.text}`;
    }).join('\n\n---\n\n');

    return `
You are an expert dungeon master weaving a rich, interactive story. 
Based on the story so far and the player's latest action, write the next part of the adventure.
Keep the tone consistent with the initial premise.
Describe the world, characters, and events vividly.
If an image was provided for the initial premise, use it as strong inspiration for the character or setting.
End the story segment at a point of suspense or decision.
Then, provide three distinct and compelling choices for the player to continue the story.

Here is the story so far:
${historyText}

Now, generate the next story segment and the player's choices.
    `;
}

export async function generateStorySegment(
  history: StorySegment[],
  image: UploadedImage | null
): Promise<GeminiResponse> {
  const prompt = buildPrompt(history);
  
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];

  if (image) {
    parts.push({
        inlineData: {
            mimeType: image.mimeType,
            data: image.base64,
        }
    });
  }
  
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const jsonText = response.text;
    const parsedResponse = JSON.parse(jsonText) as GeminiResponse;

    if (!parsedResponse.storyText || !Array.isArray(parsedResponse.choices) || parsedResponse.choices.length === 0) {
        throw new Error("Invalid response structure from AI.");
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate story segment. The ancient scrolls seem to be blank.");
  }
}
