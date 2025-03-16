
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface SymptomDetails {
  symptom: string;
  severity: string;
  duration: string;
  additionalInfo: string;
}

export async function generateHealthAssessment(apiKey: string, symptoms: SymptomDetails) {
  const prompt = `
    I need a detailed health assessment based on the following symptoms:
    - Symptom: ${symptoms.symptom}
    - Severity: ${symptoms.severity}
    - Duration: ${symptoms.duration}
    - Additional Information: ${symptoms.additionalInfo}
    
    Please provide a comprehensive analysis including:
    1. Potential health risks associated with these symptoms
    2. Possible causes and related medical conditions
    3. Recommended medicines (if applicable) with dosage guidelines
    4. Whether a doctor consultation is needed

    Format the response in JSON with these sections:
    {
      "analysis": "detailed analysis of the symptoms",
      "possibleCauses": ["cause1", "cause2"],
      "medicineRecommendations": [
        {"name": "medicine1", "dosage": "dosage info", "purpose": "what it treats"}
      ],
      "doctorConsultation": {"needed": true/false, "urgency": "low/medium/high", "reason": "reason"}
    }
  `;

  try {
    // Updated to use v1 API endpoint and gemini-1.5-flash model
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate health assessment");
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: "Could not parse AI response" };
    } catch (e) {
      console.error("Error parsing JSON from AI response:", e);
      return { error: "Could not parse AI response", rawResponse: responseText };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

// Update other functions to use gemini-1.5-flash model
export async function analyzeHealthReport(apiKey: string, reportType: string, reportContent: string) {
  const prompt = `
    Analyze the following ${reportType} report and provide insights:
    
    ${reportContent}
    
    Please provide a comprehensive analysis including:
    1. A summary of key findings
    2. Any abnormal values or concerning results
    3. Health trends or patterns
    4. Risk assessments
    5. Recommended lifestyle changes or precautions

    Format the response in JSON with these sections:
    {
      "summary": "overall summary of the report",
      "abnormalFindings": [
        {"metric": "name", "value": "value", "normalRange": "range", "concern": "explanation"}
      ],
      "healthTrends": ["trend1", "trend2"],
      "riskAssessment": {"level": "low/medium/high", "details": "explanation"},
      "recommendations": ["recommendation1", "recommendation2"]
    }
  `;

  try {
    // Updated to use v1 API endpoint and gemini-1.5-flash model
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to analyze health report");
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: "Could not parse AI response" };
    } catch (e) {
      console.error("Error parsing JSON from AI response:", e);
      return { error: "Could not parse AI response", rawResponse: responseText };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

export async function generateLifestyleChanges(apiKey: string, healthData: any) {
  const prompt = `
    Based on the following health data, suggest personalized lifestyle changes:
    
    ${JSON.stringify(healthData)}
    
    Please provide:
    1. Diet recommendations (foods to include and avoid)
    2. Exercise suggestions tailored to this health profile
    3. Stress management techniques
    4. Sleep improvement strategies
    5. Other wellness tips

    Format the response in JSON with these sections:
    {
      "dietRecommendations": {
        "include": ["food1", "food2"],
        "avoid": ["food1", "food2"],
        "mealPlanSuggestion": "brief meal plan idea"
      },
      "exerciseRecommendations": ["recommendation1", "recommendation2"],
      "stressManagement": ["technique1", "technique2"],
      "sleepStrategies": ["strategy1", "strategy2"],
      "wellnessTips": ["tip1", "tip2"]
    }
  `;

  try {
    // Updated to use v1 API endpoint and gemini-1.5-flash model
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate lifestyle changes");
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: "Could not parse AI response" };
    } catch (e) {
      console.error("Error parsing JSON from AI response:", e);
      return { error: "Could not parse AI response", rawResponse: responseText };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

export async function chatWithHealthAssistant(apiKey: string, message: string, chatHistory: Array<{role: string, content: string}> = []) {
  // Prepare the chat history for Gemini
  const updatedChatHistory = [
    {
      role: "system",
      content: `You are a health assistant AI. Provide accurate, evidence-based health information. 
      If a question is medical in nature and requires professional diagnosis, advise the user to consult a healthcare provider.
      Be conversational but focused on providing reliable health information.`
    },
    ...chatHistory,
    { role: "user", content: message }
  ];
  
  const conversations = updatedChatHistory.map(entry => ({
    role: entry.role === "system" ? "user" : entry.role,
    parts: [{ text: entry.content }]
  }));

  try {
    // Updated to use v1 API endpoint and gemini-1.5-flash model
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: conversations,
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from health assistant");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

export const analyzeHealthData = async (apiKey: string, healthData: any) => {
  try {
    // Structure the prompt with the health data
    const prompt = `
      Analyze the following health data and provide personalized lifestyle recommendations:
      
      - Steps: ${healthData.steps} steps
      - Heart Rate: ${healthData.heartRate} bpm
      - Sleep: ${healthData.sleepHours} hours
      - Calories Burned: ${healthData.caloriesBurned} calories
      - Water Intake: ${healthData.waterIntake} glasses
      - Mood Level: ${healthData.mood}/5
      
      Based on this data, provide:
      1. A brief analysis of the current health status
      2. 3-5 specific, actionable lifestyle recommendations to improve health
      3. Any areas of concern that might need attention
      
      Format the response as a JSON object with the following structure:
      {
        "analysis": "Overall health analysis",
        "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
        "concerns": ["concern 1", "concern 2"]
      }
    `;

    // Updated to use v1 API endpoint and gemini-1.5-flash model
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Error generating content");
    }

    // Extract and parse the JSON response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("No response received from API");
    }

    // Extract JSON from the response (might be surrounded by markdown code blocks)
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       textResponse.match(/```\n([\s\S]*?)\n```/) ||
                       textResponse.match(/{[\s\S]*}/);
                       
    const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : textResponse;
    
    try {
      const parsedData = JSON.parse(jsonStr);
      return {
        recommendations: parsedData.recommendations || []
      };
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      // Fallback to returning recommendations as an array with the whole response
      return {
        recommendations: [textResponse]
      };
    }
  } catch (error) {
    console.error("Health data analysis error:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to analyze health data" 
    };
  }
};
