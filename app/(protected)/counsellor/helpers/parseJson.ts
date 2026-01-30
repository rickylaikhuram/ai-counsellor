/**
 * Safely parse JSON from AI responses
 * Handles common issues like markdown code blocks, extra text, etc.
 */
export function parseAIJson<T>(rawResponse: string): T {
  // Remove markdown code blocks if present
  let cleaned = rawResponse.trim();

  // Remove ```json and ``` markers
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```\s*$/i, "");

  // Try to extract JSON object from text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(cleaned);
    return parsed as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    console.error("Raw response:", rawResponse);
    console.error("Cleaned response:", cleaned);

    // Throw error to trigger fallback in actions
    throw new Error(`Failed to parse AI response as JSON: ${error}`);
  }
}

/**
 * Validate that parsed JSON has required fields
 */
export function validateJsonStructure<T extends Record<string, any>>(
  data: any,
  requiredFields: (keyof T)[],
): data is T {
  if (!data || typeof data !== "object") {
    return false;
  }

  return requiredFields.every((field) => field in data);
}
