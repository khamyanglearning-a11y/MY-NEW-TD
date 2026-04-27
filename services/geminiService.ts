import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAIVoice = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/mp3;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};

export const getAIWordSuggestions = async (word: string, sourceLang: string) => {
  // AI features removed as per user request
  return null;
};

export const getAIPronunciation = async (word: string) => {
  // AI features removed as per user request
  return null;
};

export const generateSmsMessage = async (otp: string): Promise<string> => {
  // AI features removed as per user request
  return `Your TaiHub verification code is ${otp}. Please do not share this with anyone.`;
};

/**
 * generateWordImage
 * @param context - Object containing translations to give AI the best context
 */
export const generateWordImage = async (context: { english: string; assamese: string; tai: string; category?: string }): Promise<string | null> => {
  // AI features removed as per user request
  return null;
};

export const searchTaiHeritage = async (query: string) => {
  // AI features removed as per user request
  return null;
};
