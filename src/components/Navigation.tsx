import { Menu, X, Globe, User } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { SupportedLanguage } from "../types";

const NAV_ITEMS = [
  { id: "home", label: { English: "Home", Hindi: "मुख्य पृष्ठ", Bengali: "নীড়পাতা", Tamil: "முகப்பு" } },
  { id: "services", label: { English: "Find a Service", Hindi: "सेवा खोजें", Bengali: "একটি পরিষেবা খুঁজুন", Tamil: "சேவையைக் கண்டறியவும்" } },
  { id: "documents", label: { English: "Documents", Hindi: "दस्तावेज़", Bengali: "নথিপত্র", Tamil: "ஆவணங்கள்" } },
  { id: "report", label: { English: "Report Issue", Hindi: "समस्या दर्ज करें", Bengali: "সমস্যা রিপোর্ট করুন", Tamil: "சிக்கலைப் புகாரளி" } },
  { id: "track", label: { English: "Track Complaint", Hindi: "शिकायत ट्रैक करें", Bengali: "অভিযোগ ট্র্যাক করুন", Tamil: "புகாரைக் கண்காணிக்கவும்" } },
  { id: "community", label: { English: "Community", Hindi: "समुदाय", Bengali: "সম্প্রদায়", Tamil: "சமூகம்" } },
  { id: "dashboard", label: { English: "Dashboard", Hindi: "डैशबोर्ड", Bengali: "ড্যাশবোর্ড", Tamil: "டாஷ்போர்டு" } },
];

const LANGUAGES: SupportedLanguage[] = ["English", "Hindi", "Bengali", "Tamil"];

export default function Navigation({ currentView, setCurrentView, largeText, setLargeText }: { currentView: string; setCurrentView: (v: string) => void; largeText: boolean; setLargeText: (v: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useAppContext();

  return (
    <nav className="bg-indigo-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView("home")}
              className="flex-shrink-0 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-900" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">Nagrik Saathi</span>
            </button>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                  currentView === item.id
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                {item.label[language]}
              </button>
            ))}
            
            <div className="flex items-center border-l border-indigo-700 pl-4 ml-2 space-x-3">
              <button
                onClick={() => setLargeText(!largeText)}
                className={`px-2 py-1 rounded text-xs font-bold border transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                  largeText ? 'bg-amber-500 text-indigo-900 border-amber-500' : 'bg-transparent text-indigo-200 border-indigo-500 hover:border-indigo-300'
                }`}
                aria-pressed={largeText}
                aria-label="Toggle larger text"
              >
                aA
              </button>
              <div className="relative flex items-center">
                <Globe className="w-5 h-5 text-indigo-200 mr-2" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="bg-indigo-800 text-white border-none rounded focus:ring-2 focus:ring-white p-1 text-sm cursor-pointer"
                  aria-label="Select Language"
                >
                  {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => setLargeText(!largeText)}
              className={`px-2 py-1 rounded text-xs font-bold border mr-1 ${
                largeText ? 'bg-amber-500 text-indigo-900 border-amber-500' : 'bg-transparent text-indigo-200 border-indigo-500'
              }`}
              aria-label="Toggle larger text"
            >
              aA
            </button>
             <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-indigo-800 text-white border border-indigo-700 rounded focus:ring-2 focus:ring-white p-1 text-sm cursor-pointer mr-2 max-w-[100px]"
                aria-label="Select Language"
              >
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang.substring(0,3)}</option>)}
              </select>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-indigo-800 shadow-xl border-t border-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  currentView === item.id
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                {item.label[language]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
