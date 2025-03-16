
import { useState } from "react";
import { chatWithHealthAssistant } from "@/services/gemini-api";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  expertise: string[];
  rating: number;
  location: string;
  consultationFee: number;
  availability: string[];
  about: string;
  education: string[];
  experience: string[];
  reviews: Array<{
    patientName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
};

export function useDoctorSearch() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey] = useLocalStorage<string>("gemini-api-key", "");

  const search = async (query: string, location: string = "") => {
    if (!apiKey) {
      setError("Gemini API key is required. Please set it in your profile settings.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build the prompt for Gemini API
      const prompt = `
        I need a list of doctors that specialize in treating the following condition or symptoms: "${query}"
        ${location ? `Located in or near: ${location}` : ""}
        
        Please provide the information about 6 doctors in JSON format with the following structure:
        [
          {
            "id": "unique-id",
            "name": "Doctor Name",
            "specialization": "Medical Specialization",
            "expertise": ["expertise1", "expertise2", "expertise3"],
            "rating": 4.5,
            "location": "City, State",
            "consultationFee": 100,
            "availability": ["Monday 9AM-5PM", "Wednesday 10AM-4PM", "Friday 9AM-3PM"],
            "about": "Brief background about the doctor",
            "education": ["Medical School, Year", "Residency, Year"],
            "experience": ["Position at Hospital, Years", "Another Position, Years"],
            "reviews": [
              {
                "patientName": "Patient Name",
                "rating": 5,
                "comment": "Review comment",
                "date": "Month Year"
              }
            ]
          }
        ]
        
        Ensure the data is realistic and appropriate for the medical condition/symptoms provided. 
        The ratings should be between 3.5 and 5.0. Make location realistic for ${location || "various cities"}.
        For each doctor, include at least 2 reviews from patients.
      `;

      // Call Gemini API
      const response = await chatWithHealthAssistant(apiKey, prompt);
      
      // Parse the JSON from the response
      const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        const doctorsData: Doctor[] = JSON.parse(jsonMatch[0]);
        setDoctors(doctorsData);
      } else {
        setDoctors([]);
        setError("Could not find doctor information for your query");
      }
    } catch (err) {
      setError("Failed to search for doctors. Please try again.");
      console.error("Doctor search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { doctors, isLoading, error, search };
}
