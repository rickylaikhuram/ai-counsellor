
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Profile,
  DecisionPath,
  University,
  ShortlistedUniversity,
  Level,
  UniversityCategory,
  Priority,
} from "@/app/generated/prisma/client";
import { parseAIJson } from "./parseJson";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * STAGE 2: Analyze user profile and determine risk level
 */
export async function analyzeProfile(profile: Profile) {
  const prompt = `You are an expert study-abroad counsellor analyzing a student profile.

STUDENT PROFILE:
- Education: ${profile.educationLevel} in ${profile.major || "N/A"}
- GPA: ${profile.normalizedGpa || profile.gpa}/100 (Normalized)
- Target Degree: ${profile.targetDegree}
- Field: ${profile.fieldOfStudy}
- Countries: ${profile.preferredCountries?.join(", ") || "Not specified"}
- Budget: $${profile.budgetMin || 0} - $${profile.budgetMax || 0}
- Funding: ${profile.fundingPlan}
- IELTS: ${profile.ieltsStatus}
- GRE: ${profile.greStatus}
- SOP: ${profile.sopStatus}

TASK:
Analyze this profile and determine:
1. Risk level (LOW, MEDIUM, or HIGH) based on academic readiness and financial preparation
2. Clear reasoning for the risk assessment
3. Suitable regions for this student

OUTPUT REQUIREMENTS:
Return ONLY valid JSON in this exact format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "reasoning": "Detailed 2-3 sentence explanation of the risk assessment",
  "suitableRegions": ["region1", "region2", "region3"]
}

DO NOT include markdown formatting, code blocks, or any text outside the JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    const parsed = parseAIJson<{
      riskLevel: Level;
      reasoning: string;
      suitableRegions: string[];
    }>(response);

    return {
      riskLevel: parsed.riskLevel,
      reasoning: parsed.reasoning,
      suitableRegions: parsed.suitableRegions,
    };
  } catch (error) {
    console.error("Gemini profile analysis error:", error);
    throw error; // Let the action handle fallback
  }
}

/**
 * STAGE 4: Generate university shortlist based on decision path
 */
export async function generateShortlist(
  profile: Profile,
  decisionPath: DecisionPath,
  availableUniversities: University[],
) {
  // Format universities for prompt
  const universityList = availableUniversities
    .map(
      (uni, idx) =>
        `${idx + 1}. ${uni.name} (${uni.country}) - Tuition: $${uni.tuition}, Acceptance: ${
          uni.acceptanceRate || "N/A"
        }%`,
    )
    .join("\n");

  const pathDescription = {
    LOW_COST:
      "Focus on affordability and scholarships, prioritize cost-effective options",
    BALANCED: "Balance between cost, reputation, and acceptance chances",
    HIGH_RISK:
      "Prioritize prestigious universities even if acceptance rates are lower",
  };

  const prompt = `You are an expert study-abroad counsellor creating a university shortlist.

STUDENT PROFILE:
- Normalized GPA: ${profile.normalizedGpa || profile.gpa}/100
- Target Field: ${profile.fieldOfStudy}
- Preferred Countries: ${profile.preferredCountries?.join(", ")}
- Budget: $${profile.budgetMin} - $${profile.budgetMax}
- Decision Path: ${decisionPath} (${pathDescription[decisionPath]})

AVAILABLE UNIVERSITIES:
${universityList}

TASK:
Select 6-8 universities from the list above that best match this student's profile and chosen path.
Distribute them as:
- 2 DREAM universities (reach schools)
- 3-4 TARGET universities (match schools)
- 2-3 SAFE universities (safety schools)

For each selected university, provide:
1. The exact universityId (use the index number from the list)
2. Category (DREAM, TARGET, or SAFE)
3. Reasoning (why this university fits)
4. Risks (potential challenges)
5. Cost level (LOW, MEDIUM, or HIGH relative to budget)
6. Acceptance chance (LOW, MEDIUM, or HIGH for this student)

OUTPUT REQUIREMENTS:
Return ONLY valid JSON in this exact format:
{
  "reasoning": "Brief 2-3 sentence overview of the selection strategy",
  "universities": [
    {
      "universityId": "actual-university-id-from-database",
      "category": "DREAM" | "TARGET" | "SAFE",
      "reasoning": "Why this university was selected",
      "risks": "Potential challenges or concerns",
      "costLevel": "LOW" | "MEDIUM" | "HIGH",
      "acceptanceChance": "LOW" | "MEDIUM" | "HIGH"
    }
  ]
}

CRITICAL: Use the actual university IDs from the provided list, not the index numbers.
DO NOT include markdown formatting, code blocks, or any text outside the JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    const parsed = parseAIJson<{
      reasoning: string;
      universities: Array<{
        universityId: string;
        category: UniversityCategory;
        reasoning: string;
        risks: string;
        costLevel: Level;
        acceptanceChance: Level;
      }>;
    }>(response);

    // Validate that university IDs exist
    const validatedUniversities = parsed.universities
      .map((uni) => {
        // Check if universityId is actually an index (number)
        const indexMatch = uni.universityId.match(/^\d+$/);
        if (indexMatch) {
          const index = parseInt(uni.universityId) - 1;
          if (index >= 0 && index < availableUniversities.length) {
            return {
              ...uni,
              universityId: availableUniversities[index].id,
            };
          }
        }

        // Otherwise, check if it's a valid university ID
        const university = availableUniversities.find(
          (u) => u.id === uni.universityId,
        );
        return university ? uni : null;
      })
      .filter((uni): uni is NonNullable<typeof uni> => uni !== null);

    if (validatedUniversities.length === 0) {
      throw new Error("No valid universities in AI response");
    }

    return {
      reasoning: parsed.reasoning,
      universities: validatedUniversities.slice(0, 8), // Max 8 universities
    };
  } catch (error) {
    console.error("Gemini shortlist generation error:", error);
    throw error; // Let the action handle fallback
  }
}

/**
 * STAGE 6: Generate action plan with specific tasks
 */
export async function generateActionPlan(
  shortlistedUniversities: (ShortlistedUniversity & {
    university: University;
  })[],
) {
  const universityList = shortlistedUniversities
    .map((su) => `- ${su.university.name} (${su.category})`)
    .join("\n");

  const prompt = `You are an expert study-abroad counsellor creating a 30-60 day action plan.

SHORTLISTED UNIVERSITIES:
${universityList}

TASK:
Create a comprehensive action plan with 8-12 specific tasks covering:
1. Document preparation (transcripts, recommendations, essays)
2. Test preparation/completion (if needed)
3. Application submission milestones
4. Financial planning (scholarships, visa fees)
5. University-specific requirements

Each task should:
- Have a clear, actionable title
- Include detailed description
- Be assigned appropriate priority (LOW, MEDIUM, HIGH)
- Have a realistic due date (within 30-60 days from today)
- Optionally link to a specific university if applicable

OUTPUT REQUIREMENTS:
Return ONLY valid JSON in this exact format:
{
  "reasoning": "Brief overview of the action plan strategy",
  "tasks": [
    {
      "title": "Clear, actionable task title",
      "description": "Detailed description with specific steps",
      "priority": "LOW" | "MEDIUM" | "HIGH",
      "dueDate": "YYYY-MM-DD",
      "universityId": "optional-university-id-or-null"
    }
  ]
}

Today's date: ${new Date().toISOString().split("T")[0]}
DO NOT include markdown formatting, code blocks, or any text outside the JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    const parsed = parseAIJson<{
      reasoning: string;
      tasks: Array<{
        title: string;
        description: string;
        priority: Priority;
        dueDate: string;
        universityId?: string | null;
      }>;
    }>(response);

    // Convert date strings to Date objects and validate university IDs
    const validatedTasks = parsed.tasks.map((task) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      universityId: task.universityId || null,
    }));

    return {
      reasoning: parsed.reasoning,
      tasks: validatedTasks,
    };
  } catch (error) {
    console.error("Gemini action plan generation error:", error);
    throw error; // Let the action handle fallback
  }
}
