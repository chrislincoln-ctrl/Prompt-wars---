import { useState, useEffect } from "react";
import { FileText, CheckCircle2, Circle, Loader2, HelpCircle, ArrowRight, Volume2 } from "lucide-react";
import { generateJsonContent, generateContent } from "../lib/gemini";
import { seedServices } from "../data/seedData";
import { useAppContext } from "../context/AppContext";
import ReactMarkdown from "react-markdown";

interface DocItem {
  id: string;
  name: string;
  explanation: string;
  commonMistakes: string;
}

export default function DocumentAssistant() {
  const { language, selectedService, setSelectedService } = useAppContext();
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [helpLoadingId, setHelpLoadingId] = useState<string | null>(null);
  const [helpTexts, setHelpTexts] = useState<Record<string, string>>({});

  const t = {
    English: {
      title: "Document Assistant",
      subtitle: "Select a service to get a plain-language checklist of required documents.",
      selectService: "Select a service...",
      generating: "Generating your personalized checklist...",
      ready: "Ready",
      of: "of",
      needHelp: "Don't have this?",
      getHelp: "Get advice"
    },
    Hindi: {
      title: "दस्तावेज़ सहायक",
      subtitle: "आवश्यक दस्तावेज़ों की चेकलिस्ट प्राप्त करने के लिए एक सेवा चुनें।",
      selectService: "एक सेवा चुनें...",
      generating: "आपकी व्यक्तिगत चेकलिस्ट तैयार की जा रही है...",
      ready: "तैयार",
      of: "में से",
      needHelp: "यह नहीं है?",
      getHelp: "सलाह लें"
    },
    Bengali: {
      title: "নথি সহকারী",
      subtitle: "প্রয়োজনীয় নথির চেকলিস্ট পেতে একটি পরিষেবা নির্বাচন করুন।",
      selectService: "একটি পরিষেবা নির্বাচন করুন...",
      generating: "আপনার চেকলিস্ট তৈরি করা হচ্ছে...",
      ready: "প্রস্তুত",
      of: "এর",
      needHelp: "এটা নেই?",
      getHelp: "উপদেশ পান"
    },
    Tamil: {
      title: "ஆவண உதவியாளர்",
      subtitle: "தேவையான ஆவணங்களின் சரிபார்ப்புப் பட்டியலைப் பெற ஒரு சேவையைத் தேர்ந்தெடுக்கவும்.",
      selectService: "ஒரு சேவையைத் தேர்ந்தெடுக்கவும்...",
      generating: "உங்கள் சரிபார்ப்புப் பட்டியலை உருவாக்குகிறது...",
      ready: "தயார்",
      of: "இல்",
      needHelp: "இது இல்லையா?",
      getHelp: "ஆலோசனை பெறுங்கள்"
    }
  };
  const currentT = t[language];

  useEffect(() => {
    if (selectedService) {
      generateChecklist();
    } else {
      setDocuments([]);
      setCheckedItems(new Set());
      setHelpTexts({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService, language]);

  const generateChecklist = async () => {
    if (!selectedService) return;
    setIsLoading(true);
    setDocuments([]);
    setCheckedItems(new Set());
    setHelpTexts({});

    try {
      const prompt = `Generate a comprehensive list of required documents to apply for "${selectedService.name}" (Department: ${selectedService.department}).
For each document, provide:
1. The standard name of the document.
2. A one-line explanation of why it is needed.
3. Common mistakes to avoid (e.g., "Must be attested", "Must not be older than 3 months").
Respond in ${language}.`;

      const schema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING" },
            name: { type: "STRING" },
            explanation: { type: "STRING" },
            commonMistakes: { type: "STRING" }
          },
          required: ["id", "name", "explanation", "commonMistakes"]
        }
      };
      
      const sysInstruction = `You are a helpful government assistant. Keep explanations extremely simple and actionable. Return data in ${language}.`;
      const result = await generateJsonContent(prompt, schema, sysInstruction);
      setDocuments(result as DocItem[]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (id: string) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCheckedItems(newSet);
  };

  const handleGetHelp = async (doc: DocItem) => {
    if (helpTexts[doc.id]) return; // already loaded
    
    setHelpLoadingId(doc.id);
    try {
      const prompt = `I am applying for "${selectedService?.name}". I do not have the document: "${doc.name}". 
Explain alternative or substitute documents I can use instead, or explain exactly how I can obtain the original one. 
Structure the answer with clear bullet points.
Respond in ${language}.`;
      
      const sysInstruction = `You are Nagrik Saathi. Answer in simple, plain language. Never use jargon. Structure the answer clearly. Output in ${language}.`;
      const reply = await generateContent(prompt, sysInstruction);
      setHelpTexts(prev => ({ ...prev, [doc.id]: reply }));
    } catch(e) {
      console.error(e);
      setHelpTexts(prev => ({ ...prev, [doc.id]: "Unable to load advice. Please try again later." }));
    } finally {
      setHelpLoadingId(null);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'Hindi') utterance.lang = 'hi-IN';
      else if (language === 'Tamil') utterance.lang = 'ta-IN';
      else if (language === 'Bengali') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-700">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{currentT.title}</h1>
        </div>
        <p className="text-lg text-slate-600 mb-8">{currentT.subtitle}</p>

        <div className="max-w-md">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Selected Service</label>
          <select 
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 bg-white"
            value={selectedService?.id || ""}
            onChange={(e) => {
              const svc = seedServices.find(s => s.id === e.target.value);
              setSelectedService(svc || null);
            }}
          >
            <option value="">{currentT.selectService}</option>
            {seedServices.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-lg font-medium">{currentT.generating}</p>
        </div>
      )}

      {!isLoading && documents.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center sticky top-16 z-10">
            <h2 className="text-xl font-bold text-slate-900">{selectedService?.name} Checklist</h2>
            <div className="flex items-center bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm font-bold text-indigo-700">
              <span className="mr-2">{currentT.ready}:</span> 
              {checkedItems.size} {currentT.of} {documents.length}
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => {
              const isChecked = checkedItems.has(doc.id);
              const showingHelp = !!helpTexts[doc.id];
              const isLoadingHelp = helpLoadingId === doc.id;
              
              return (
                <div key={doc.id} className={`p-6 transition-colors ${isChecked ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-start">
                    <button 
                      onClick={() => toggleCheck(doc.id)}
                      className="mt-1 mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <Circle className="w-8 h-8 text-slate-300 hover:text-indigo-400" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h3 className={`text-lg font-bold ${isChecked ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {doc.name}
                        </h3>
                        <button 
                          onClick={() => handleSpeak(`${doc.name}. ${doc.explanation}. Common mistakes: ${doc.commonMistakes}`)}
                          className="text-slate-400 hover:text-indigo-600 focus:outline-none ml-2"
                          aria-label="Read document details aloud"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <p className={`mt-1 mb-2 ${isChecked ? 'text-slate-400' : 'text-slate-600'}`}>
                        {doc.explanation}
                      </p>
                      
                      {!isChecked && (
                        <div className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                           ⚠️ {doc.commonMistakes}
                        </div>
                      )}

                      {!isChecked && (
                        <div className="mt-4">
                          <button 
                            onClick={() => handleGetHelp(doc)}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center focus:outline-none focus:underline"
                          >
                            <HelpCircle className="w-4 h-4 mr-1" />
                            {currentT.needHelp} {currentT.getHelp}
                            {isLoadingHelp && <Loader2 className="w-3 h-3 ml-2 animate-spin" />}
                          </button>
                          
                          {showingHelp && (
                            <div className="mt-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm prose prose-sm prose-slate max-w-none">
                              <ReactMarkdown>{helpTexts[doc.id]}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
