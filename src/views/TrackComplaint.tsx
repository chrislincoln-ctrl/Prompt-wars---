import { useState } from "react";
import { Search, MapPin, Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function TrackComplaint() {
  const { complaints, language } = useAppContext();
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<typeof complaints[0] | null | undefined>(undefined);

  const t = {
    English: {
      title: "Track My Complaint",
      subtitle: "Enter your tracking ID to see the current status of your reported issue.",
      placeholder: "e.g., NS-2026-00012",
      button: "Track",
      notFound: "No complaint found with this tracking ID. Please check and try again.",
      statusMap: { "Submitted": "Submitted", "Under Review": "Under Review", "In Progress": "In Progress", "Resolved": "Resolved" },
    },
    Hindi: {
      title: "शिकायत ट्रैक करें",
      subtitle: "अपनी दर्ज की गई समस्या की वर्तमान स्थिति देखने के लिए अपनी ट्रैकिंग आईडी दर्ज करें।",
      placeholder: "उदा. NS-2026-00012",
      button: "ट्रैक करें",
      notFound: "इस ट्रैकिंग आईडी से कोई शिकायत नहीं मिली। कृपया जांचें और पुनः प्रयास करें।",
      statusMap: { "Submitted": "प्रस्तुत", "Under Review": "समीक्षाधीन", "In Progress": "प्रगति पर", "Resolved": "हल हो गया" },
    },
    Bengali: {
      title: "অভিযোগ ট্র্যাক করুন",
      subtitle: "আপনার রিপোর্ট করা সমস্যার বর্তমান অবস্থা দেখতে আপনার ট্র্যাকিং আইডি লিখুন।",
      placeholder: "যেমন, NS-2026-00012",
      button: "ট্র্যাক",
      notFound: "এই ট্র্যাকিং আইডি দিয়ে কোনো অভিযোগ পাওয়া যায়নি।",
      statusMap: { "Submitted": "জমা দেওয়া হয়েছে", "Under Review": "পর্যালোচনাধীন", "In Progress": "চলছে", "Resolved": "মীমাংসিত" },
    },
    Tamil: {
      title: "புகாரைக் கண்காணிக்கவும்",
      subtitle: "உங்கள் புகாரின் தற்போதைய நிலையைக் காண உங்கள் கண்காணிப்பு ஐடியை உள்ளிடவும்.",
      placeholder: "உதாரணமாக, NS-2026-00012",
      button: "கண்காணிப்பு",
      notFound: "இந்த கண்காணிப்பு ஐடியுடன் எந்த புகாரும் கிடைக்கவில்லை.",
      statusMap: { "Submitted": "சமர்ப்பிக்கப்பட்டது", "Under Review": "பரிசீலனையில்", "In Progress": "செயலில்", "Resolved": "தீர்க்கப்பட்டது" },
    }
  };
  const currentT = t[language];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = complaints.find(c => c.trackingId.toLowerCase() === searchId.toLowerCase());
    setResult(found || null);
  };

  const statusList = ["Submitted", "Under Review", "In Progress", "Resolved"];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentT.title}</h1>
        <p className="text-lg text-slate-600 mb-8">{currentT.subtitle}</p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={currentT.placeholder}
            className="flex-1 p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg uppercase"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {currentT.button}
          </button>
        </form>
      </div>

      {result === null && (
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center">
          {currentT.notFound}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Tracking ID</p>
              <h2 className="text-3xl font-bold text-slate-900">{result.trackingId}</h2>
            </div>
            <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-sm font-semibold text-slate-500 mr-2">Status:</span>
              <span className="font-bold text-indigo-700">{currentT.statusMap[result.status as keyof typeof currentT.statusMap] || result.status}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block"></div>
            <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
              {statusList.map((step, index) => {
                const currentIndex = statusList.indexOf(result.status);
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                  <div key={step} className="flex flex-row sm:flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-100 text-white' 
                        : 'bg-slate-100 border-white text-slate-300'
                    } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="ml-4 sm:ml-0 sm:mt-4 text-left sm:text-center">
                      <p className={`font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {currentT.statusMap[step as keyof typeof currentT.statusMap] || step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary</h3>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <p className="text-slate-800 font-medium leading-relaxed">{result.aiSummary}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Original Description</h3>
                <p className="text-slate-600">{result.description}</p>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="flex items-center text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                <span>{result.location || "Location not provided"}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                <span>{new Date(result.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Clock className="w-5 h-5 text-slate-400 mr-3" />
                <span>{new Date(result.date).toLocaleTimeString()}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="flex items-center">
                  <AlertTriangle className={`w-5 h-5 mr-3 ${
                    result.priority === 'High' ? 'text-rose-500' : 
                    result.priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                  }`} />
                  <div>
                    <span className="font-bold text-slate-700 block">{result.priority} Priority</span>
                    <span className="text-sm text-slate-500">{result.priorityJustification}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
