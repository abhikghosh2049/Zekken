import { GoogleGenAI, Type } from "@google/genai";
import type { CabApiResponse, CabOption } from '../types';

// Ensure the API key is available from environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    locations: {
      type: Type.OBJECT,
      description: "Inferred geographic coordinates for the route.",
      properties: {
        pickup: {
          type: Type.OBJECT,
          properties: {
            latitude: { type: Type.NUMBER, description: "Latitude of the pickup location." },
            longitude: { type: Type.NUMBER, description: "Longitude of the pickup location." },
          },
          required: ["latitude", "longitude"],
        },
        dropoff: {
          type: Type.OBJECT,
          properties: {
            latitude: { type: Type.NUMBER, description: "Latitude of the drop-off location." },
            longitude: { type: Type.NUMBER, description: "Longitude of the drop-off location." },
          },
          required: ["latitude", "longitude"],
        },
      },
      required: ["pickup", "dropoff"],
    },
    cabs: {
      type: Type.ARRAY,
      description: "A list of simulated cab options.",
      items: {
        type: Type.OBJECT,
        properties: {
          provider: {
            type: Type.STRING,
            description: "Service provider name (e.g., 'Uber', 'Ola', 'inDrive').",
            enum: ['Uber', 'Ola', 'inDrive'],
          },
          cabType: {
            type: Type.STRING,
            description: "Type of cab (e.g., 'Sedan', 'SUV', 'Mini', 'Auto').",
          },
          fare: {
            type: Type.NUMBER,
            description: "Estimated fare in the local currency.",
          },
          eta: {
            type: Type.INTEGER,
            description: "Estimated time of arrival in minutes.",
          },
          capacity: {
            type: Type.INTEGER,
            description: "The maximum number of passengers the vehicle can accommodate.",
          },
        },
        required: ["provider", "cabType", "fare", "eta", "capacity"],
      },
    },
  },
  required: ["locations", "cabs"],
};

const locationSuggestionsSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      description: "A list of plausible location suggestions.",
      items: {
        type: Type.STRING,
        description: "A single location suggestion as a full address."
      }
    }
  },
  required: ["suggestions"],
};


export const fetchCabOptions = async (pickup: string, dropoff: string, seats: number): Promise<CabApiResponse> => {
  const prompt = `
    Act as a cab fare aggregator AI. Your primary task is to provide simulated cab options and the geographic coordinates for a given route.
    The user requires a cab that can seat at least ${seats} passengers. Prioritize generating cabs that meet this requirement. For every cab you generate, you MUST provide its passenger 'capacity'.

    First, for the provided pickup and drop-off locations, infer and determine a single, plausible pair of latitude and longitude coordinates for EACH location.
    
    Then, based on these locations, generate a realistic but **simulated** list of 8 to 12 available cabs from Uber, Ola, and inDrive. For each cab, provide the service provider, type, estimated fare, ETA in minutes, and its passenger capacity.
    
    Ensure a very diverse mix of providers and all possible cab types. Include common options like 'Sedan', 'SUV', 'Hatchback', 'Auto', 'Bike', and 'Luxury', but also include all service-specific tiers like 'UberGo', 'Go Sedan', 'Premier', 'UberXL' (for Uber) and 'Micro', 'Mini', 'Prime Sedan', 'Prime SUV' (for Ola). A Bike would have a capacity of 1 passenger besides the driver. An Auto would typically have 3. An SUV or XL vehicle should have a capacity of 6 or more.
    
    A location may be provided as a physical address or as existing latitude/longitude coordinates. Interpret either format correctly for your coordinate inference.

    Pickup Location: "${pickup}"
    Drop-off Location: "${dropoff}"
    Required Seats: ${seats}

    Your final output MUST be a JSON object containing both the inferred 'locations' (with pickup and dropoff coordinates) and the list of 'cabs'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8, // Slightly increased temperature for more variety
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.error("Gemini API returned an empty text response.");
        throw new Error("AI returned an empty response.");
    }
    
    const result = JSON.parse(jsonText);

    if (result && Array.isArray(result.cabs) && result.locations?.pickup && result.locations?.dropoff) {
      return result as CabApiResponse;
    } else {
      console.error("Parsed JSON does not match expected CabApiResponse structure:", result);
      throw new Error("AI response has an invalid structure.");
    }

  } catch (error) {
    console.error("Error fetching or parsing cab options:", error);
    
    const errorString = String(error);

    if (errorString.includes("PERMISSION_DENIED") || errorString.includes("API key not valid")) {
      throw new Error("Connection to the AI service failed. This may be due to an invalid or restricted API key. Please check the application's configuration.");
    }
    if (errorString.includes('SAFETY')) {
        throw new Error("The request was blocked due to safety concerns. Please try different locations.");
    }
    if (error instanceof SyntaxError || errorString.includes("malformed")) {
        throw new Error("The AI returned a malformed response. Please try your search again.");
    }
    
    throw new Error("Sorry, we couldn't fetch cab details. The AI might be busy or the locations are invalid. Please try again.");
  }
};

export const fetchLocationSuggestions = async (query: string): Promise<string[]> => {
  if (query.length < 3) {
    return [];
  }

  const prompt = `
    Act as a geocoding suggestion service for India. A user is typing a location. Based on their input, provide up to 5 plausible, realistic, and distinct full address suggestions located **only within India**.
    For example, if the input is "Gateway", a good suggestion would be "Gateway Of India, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India".
    Do not suggest any locations outside of India.
    
    User input: "${query}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: locationSuggestionsSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.error("Gemini API returned an empty text response for suggestions.");
      return [];
    }
    
    const result = JSON.parse(jsonText);

    if (result && Array.isArray(result.suggestions)) {
      return result.suggestions;
    } else {
      console.error("Parsed JSON for suggestions does not match expected structure:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return []; 
  }
};