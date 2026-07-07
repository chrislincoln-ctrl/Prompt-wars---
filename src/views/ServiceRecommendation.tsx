import { useState } from "react";
import { Search, Loader2, ArrowRight, Info } from "lucide-react";
import { generateJsonContent } from "../lib/gemini";
import { seedServices } from "../data/seedData";
import { useAppContext } from "../context/AppContext";

interface Recommendation {
  serviceId: string;
  reasoning: string;
  relevanceScore: number;
}

export default function ServiceRecommendation({ setCurrentView }: { setCurrentView: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");
  const { language, setSelectedService } = useAppContext();

  const t = {
    English: {
      title: "Find a Service",
      subtitle: "Describe your situation in your own words, and we will find the right government service for you.",
      placeholder: "e.g., I just had a baby and need to get an official document...",
      button: "Find Services",
      loading: "Searching official records...",
      results: "Recommended Services",
      startDoc: "View Document Checklist"
    },
    Hindi: {
      title: "सेवा खोजें",
      subtitle: "अपनी स्थिति का अपने शब्दों में वर्णन करें, और हम आपके लिए सही सरकारी सेवा खोजेंगे।",
      placeholder: "उदा. मुझे अभी एक बच्चा हुआ है और मुझे एक आधिकारिक दस्तावेज चाहिए...",
      button: "सेवाएं खोजें",
      loading: "आधिकारिक रिकॉर्ड खोज रहे हैं...",
      results: "अनुशंसित सेवाएं",
      startDoc: "दस्तावेज़ चेकलिस्ट देखें"
    },
    // Adding minimal translations for others just to prevent errors, falling back to English mentally or translated text
    Bengali: {
      title: "একটি পরিষেবা খুঁজুন",
      subtitle: "আপনার নিজের কথায় আপনার পরিস্থিতি বর্ণনা করুন...",
      placeholder: "যেমন, আমি একটি অফিসিয়াল নথি পেতে চাই...",
      button: "পরিষেবা খুঁজুন",
      loading: "অনুসন্ধান করা হচ্ছে...",
      results: "প্রস্তাবিত পরিষেবা",
      startDoc: "নথি চেকলিস্ট দেখুন"
    },
    Tamil: {
      title: "சேவையைக் கண்டறியவும்",
      subtitle: "உங்கள் நிலைமையை உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும்...",
      placeholder: "உதாரணமாக, எனக்கு ஒரு அதிகாரப்பூர்வ ஆவணம் தேவை...",
      button: "சேவைகளைக் கண்டறியவும்",
      loading: "தேடப்படுகிறது...",
      results: "பரிந்துரைக்கப்பட்ட சேவைகள்",
      startDoc: "ஆவண சரிபார்ப்புப் பட்டியலைக் காண்க"
    }
  };
  const currentT = t[language];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const prompt = `User describes their situation: "${query}".
Match this situation to the most relevant services from the following list.
Return a list of matches, explaining in plain language why each is relevant to the user's specific situation.
Respond in ${language}.

Available Services (JSON):
${JSON.stringify(seedServices)}
`;

      const schema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            serviceId: { type: "STRING", description: "The id of the matching service from the available list." },
            reasoning: { type: "STRING", description: `Plain language explanation in ${language} of why this applies.` },
            relevanceScore: { type: "NUMBER", description: "Score from 1 to 100 on how relevant it is." }
          },
          required: ["serviceId", "reasoning", "relevanceScore"]
        }
      };

      const sysInstruction = `You are an expert civic service mapper. You strictly map user intents to the provided list of services. Do not invent new services. Respond in ${language}.`;
      
      const result = await generateJsonContent(prompt, schema, sysInstruction);
      
      // Filter out invalid IDs and sort
      const validResults = (result as Recommendation[])
        .filter(r => seedServices.find(s => s.id === r.serviceId))
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3); // top 3

      setRecommendations(validResults);
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't process your request at the moment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectService = (serviceId: string) => {
    const svc = seedServices.find(s => s.id === serviceId);
    if (svc) {
      setSelectedService(svc);
      setCurrentView("documents");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-700">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{currentT.title}</h1>
        </div>
        <p className="text-lg text-slate-600 mb-8">{currentT.subtitle}</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={currentT.placeholder}
              className="w-full p-4 md:p-6 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg resize-none"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {currentT.loading}
                </>
              ) : (
                <>
                  {currentT.button}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
            <Info className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <h2 className="text-2xl font-bold text-slate-900 px-2">{currentT.results}</h2>
          <div className="grid gap-6">
            {recommendations.map((rec, index) => {
              const svc = seedServices.find(s => s.id === rec.serviceId)!;
              return (
                <div key={rec.serviceId} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start hover:border-indigo-300 transition-colors">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        {svc.category}
                      </span>
                      {index === 0 && (
                         <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                         Best Match
                       </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{svc.name}</h3>
                    <p className="text-slate-600 font-medium">Department: {svc.department} • Time: {svc.processingTime}</p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2">
                      <p className="text-slate-800 text-sm leading-relaxed">{rec.reasoning}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectService(svc.id)}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 whitespace-nowrap"
                  >
                    {currentT.startDoc}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
