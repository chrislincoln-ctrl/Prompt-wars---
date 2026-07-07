import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Volume2 } from "lucide-react";
import { chat } from "../lib/gemini";
import { useAppContext } from "../context/AppContext";
import { ChatMessage } from "../types";
import ReactMarkdown from "react-markdown";

export default function ChatCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useAppContext();

  const t = {
    English: { title: "AI Companion", placeholder: "Ask me anything...", disclaimer: "Powered by Generative AI — verify critical details with the official department." },
    Hindi: { title: "AI साथी", placeholder: "मुझसे कुछ भी पूछें...", disclaimer: "जेनरेटिव AI द्वारा संचालित - आधिकारिक विभाग से महत्वपूर्ण विवरणों की पुष्टि करें।" },
    Bengali: { title: "এআই সঙ্গী", placeholder: "আমাকে কিছু জিজ্ঞাসা করুন...", disclaimer: "জেনারেটিভ এআই দ্বারা চালিত - অফিসিয়াল বিভাগের সাথে যাচাই করুন।" },
    Tamil: { title: "AI தோழன்", placeholder: "என்னை ஏதாவது கேளுங்கள்...", disclaimer: "ஜெனரேட்டிவ் AI மூலம் இயக்கப்படுகிறது - அதிகாரப்பூர்வ சரிபார்க்கவும்." }
  };
  const currentT = t[language];

  const starterPrompts = {
    English: ["How do I get an income certificate?", "What documents do I need for a passport renewal?"],
    Hindi: ["आय प्रमाण पत्र कैसे प्राप्त करें?", "पासपोर्ट नवीनीकरण के लिए क्या दस्तावेज चाहिए?"],
    Bengali: ["আমি কিভাবে আয়ের শংসাপত্র পাব?", "পাসপোর্ট নবায়নের জন্য আমার কী কী নথি দরকার?"],
    Tamil: ["வருமானச் சான்றிதழை எவ்வாறு பெறுவது?", "பாஸ்போர்ட் புதுப்பிக்க என்ன ஆவணங்கள் தேவை?"]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "init",
        role: "model",
        text: `Namaste! I am your Nagrik Saathi (Citizen Companion). I can help you find government services, understand what documents you need, or report local issues. How can I assist you today? (Answering in ${language})`
      }]);
    }
  }, [isOpen, language, messages.length]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));
      const sysInstruction = `You are Nagrik Saathi, a friendly and helpful AI companion for citizens. 
Your goal is to explain government processes and terminology in plain, simple language.
NEVER use unexplained jargon.
ALWAYS structure multi-step answers as numbered steps.
You must respond in the user's chosen language: ${language}.
If the user types in a language different from ${language}, politely offer to switch the app's language, but still answer their question in the language they used.
Keep your answers concise, practical, and highly legible.`;

      const reply = await chat(text, historyForApi, sysInstruction);
      
      const modelMsg: ChatMessage = { id: (Date.now()+1).toString(), role: "model", text: reply };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: "Sorry, I am having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to set appropriate lang
      if (language === 'Hindi') utterance.lang = 'hi-IN';
      else if (language === 'Tamil') utterance.lang = 'ta-IN';
      else if (language === 'Bengali') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-IN';
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl bg-amber-500 text-indigo-900 hover:bg-amber-400 transition-transform hover:scale-105 z-40 focus:outline-none focus:ring-4 focus:ring-amber-300 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Companion Chat"
      >
        <MessageSquare className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-[400px] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-indigo-900 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-amber-500" />
              <h2 className="font-bold text-lg">{currentT.title}</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-indigo-800 rounded focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="text-xs text-center text-slate-500 mb-4 bg-slate-100 p-2 rounded-md border border-slate-200">
              {currentT.disclaimer}
            </div>
            
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                  {msg.role === 'model' && (
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-indigo-600">Nagrik Saathi</span>
                      <button onClick={() => handleSpeak(msg.text)} className="text-slate-400 hover:text-indigo-600 focus:outline-none" aria-label="Read aloud">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="text-sm prose prose-sm prose-slate max-w-none">
                    {msg.role === 'model' ? (
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                       <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter Prompts */}
          {messages.length <= 1 && (
            <div className="p-2 flex flex-wrap gap-2 bg-slate-50 border-t border-slate-100 shrink-0">
              {starterPrompts[language].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="p-3 bg-white border-t border-slate-200 shrink-0"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentT.placeholder}
                className="flex-1 p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
