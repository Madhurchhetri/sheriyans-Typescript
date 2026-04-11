import { HumanMessage } from "@langchain/core/messages";
import { geminiModel } from "./model.ai.js";

// Returns a text description of the image content using gemini-flash
export default async function processImageWithAI(prompt: string, mimeType: string, base64Data: string) {
    const message = new HumanMessage({
        content: [
            { type: "text", text: prompt || "What is in this image? Provide a helpful description." },
            { 
                type: "image_url", 
                image_url: {
                    url: `data:${mimeType};base64,${base64Data}`
                }
            },
        ],
    });

    const response = await geminiModel.invoke([message]);
    return response.content;
}
