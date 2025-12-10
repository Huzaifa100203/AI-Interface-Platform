// Free AI API providers (using server-side APIs to avoid CORS)
export const AI_PROVIDERS = {
  GROQ: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    // Keep this in sync with the model used in app/api/groq/route.ts
    models: ["llama-3.1-8b-instant"],
    free: true
  },
  TOGETHER: {
    name: "Together AI", 
    baseUrl: "https://api.together.xyz/v1/chat/completions",
    models: ["meta-llama/Llama-2-7b-chat-hf"],
    free: true
  }
};

import { authenticatedFetch } from './api-client';

export async function callGroqAPI(message: string, temperature: number = 0.7) {
  const response = await authenticatedFetch("/api/groq", {
    method: "POST",
    body: JSON.stringify({ message, temperature })
  });
  
  if (!response.ok) {
    let errorMessage = "Failed to get response from Groq API";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  return data.content;
}

export async function callTogetherAPI(message: string, temperature: number = 0.7) {
  const response = await authenticatedFetch("/api/together", {
    method: "POST",
    body: JSON.stringify({ message, temperature })
  });
  
  if (!response.ok) {
    let errorMessage = "Failed to get response from Together API";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  return data.content;
}