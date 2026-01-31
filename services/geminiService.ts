
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AvatarSpecs } from "../types";

// AI Coach interactions with history management
export const getTutorAdvice = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Você é o Coach Virtual do Núcleo Basquete, fundado por Carlos Guerra. 
        Seu tom é motivador, técnico e direto. Use termos como "bola no aro", "clutch", "defense win championships". 
        Sempre incentive o atleta a registrar seus treinos no app para subir no ranking.`,
      },
      history: history,
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    return { text: response.text || "Continue focado! Não consegui processar sua dúvida agora." };
  } catch (error) {
    console.error("Erro no Gemini Tutor:", error);
    return { text: "Erro ao conectar com o servidor de treinamento." };
  }
};

// Player style analysis for skill development with JSON Output
export const getPlayerModeling = async (player: string): Promise<any> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analise detalhadamente o estilo de jogo de ${player}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        nickname: { type: Type.STRING },
                        mentality: { type: Type.STRING },
                        keyMove: { type: Type.STRING },
                        trainingDrill: { type: Type.STRING },
                        rating: { type: Type.NUMBER, description: "Nível de dificuldade de 1 a 100" }
                    },
                    required: ["name", "nickname", "mentality", "keyMove", "trainingDrill", "rating"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Erro ao carregar modelagem técnica:", e);
        return null;
    }
}

// Generate a cinematic card photo for the player based on Avatar Specs
export const generatePlayerArt = async (playerName: string, specs?: AvatarSpecs): Promise<string | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let prompt = `A high-quality cinematic artistic portrait of basketball player ${playerName} in action.`;
        
        if (specs) {
            prompt = `A full body 3D stylized character design of a basketball player. 
            Characteristics: ${specs.nationality} nationality, ${specs.skinTone} skin tone, ${specs.hairStyle} hairstyle.
            Physique: Height ${specs.height}cm, Weight ${specs.weight}kg.
            Outfit: Wearing a futuristic basketball jersey, main color ${specs.jerseyColor}.
            Style: High fidelity, Unreal Engine 5 render, dramatic lighting, sports card background.`;
        } else {
             prompt += ` Dynamic movement, dramatic lighting, vibrant colors, sports card style, hyper-detailed.`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt }
                ]
            },
            config: {
                imageConfig: {
                    aspectRatio: "3:4"
                }
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Erro ao gerar arte do jogador:", e);
        return null;
    }
}

// Location service with Maps grounding integration
export const findNearbyCourts = async (lat: number, lng: number, query?: string): Promise<{ text: string, links: { uri: string; title: string }[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userQuery = query || "Encontre quadras de basquete públicas e centros esportivos próximos a estas coordenadas para um treino de alta performance.";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: userQuery,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const text = response.text || "Encontrei estes locais para o seu treino:";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links: { uri: string; title: string }[] = [];

    chunks.forEach((chunk: any) => {
      if (chunk.maps && chunk.maps.uri) {
        links.push({
          uri: chunk.maps.uri,
          title: chunk.maps.title || "Ver no Mapa"
        });
      }
    });

    return { text, links };
  } catch (error) {
    console.error("Erro ao buscar quadras:", error);
    return { text: "Não foi possível carregar o mapa no momento.", links: [] };
  }
};
