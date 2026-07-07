export async function generateContent(prompt: string, systemInstruction?: string): Promise<string> {
  const res = await fetch("/api/gemini/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemInstruction }),
  });
  if (!res.ok) throw new Error("Failed to generate content");
  const data = await res.json();
  return data.text;
}

export async function generateJsonContent(prompt: string, schema: any, systemInstruction?: string): Promise<any> {
  const res = await fetch("/api/gemini/generate-json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, schema, systemInstruction }),
  });
  if (!res.ok) throw new Error("Failed to generate content");
  const data = await res.json();
  try {
    return JSON.parse(data.text);
  } catch(e) {
    console.error("Failed to parse json:", data.text);
    throw e;
  }
}

export async function chat(message: string, history: {role: string, text: string}[], systemInstruction?: string): Promise<string> {
  const res = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, systemInstruction }),
  });
  if (!res.ok) throw new Error("Failed to chat");
  const data = await res.json();
  return data.text;
}
