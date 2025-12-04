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

export async function callGroqAPI(message: string, temperature: number = 0.7) {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, temperature })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API failed: ${error}`);
  }
  
  const data = await response.json();
  return data.content;
}

export async function callTogetherAPI(message: string, temperature: number = 0.7) {
  const response = await fetch("/api/together", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, temperature })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together API failed: ${error}`);
  }
  
  const data = await response.json();
  return data.content;
}