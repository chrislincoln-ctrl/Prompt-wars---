import { ArrowRight, FileText, Search, AlertCircle, TrendingUp, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Home({ setCurrentView }: { setCurrentView: (v: string) => void }) {
  const { language } = useAppContext();

  const content = {
    English: {
      heroTitle: "Government services, simplified.",
      heroSubtitle: "Nagrik Saathi helps you find the right service, gather your documents, and report issues in your neighborhood without the confusion.",
      actionServices: { title: "Find a Service", desc: "Not sure what you need? Tell us your situation." },
      actionDocs: { title: "Document Assistant", desc: "Get a clear checklist of what you need to apply." },
      actionReport: { title: "Report an Issue", desc: "Potholes, water leaks, or streetlight issues." },
      actionTrack: { title: "Track Complaint", desc: "Check the status of your reported issues." },
    },
    Hindi: {
      heroTitle: "सरकारी सेवाएं, सरल बनाई गईं।",
      heroSubtitle: "नागरिक साथी आपको सही सेवा खोजने, अपने दस्तावेज़ इकट्ठा करने और बिना किसी भ्रम के अपने पड़ोस में समस्याओं की रिपोर्ट करने में मदद करता है।",
      actionServices: { title: "सेवा खोजें", desc: "पता नहीं आपको क्या चाहिए? हमें अपनी स्थिति बताएं।" },
      actionDocs: { title: "दस्तावेज़ सहायक", desc: "आवेदन करने के लिए क्या आवश्यक है, इसकी स्पष्ट चेकलिस्ट प्राप्त करें।" },
      actionReport: { title: "समस्या दर्ज करें", desc: "गड्ढे, पानी का रिसाव, या स्ट्रीटलाइट की समस्या।" },
      actionTrack: { title: "शिकायत ट्रैक करें", desc: "अपनी दर्ज की गई समस्याओं की स्थिति जांचें।" },
    },
    Bengali: {
      heroTitle: "সরকারি পরিষেবা, সরলীকৃত।",
      heroSubtitle: "নাগরিক সাথী আপনাকে সঠিক পরিষেবা খুঁজে পেতে, আপনার নথিপত্র সংগ্রহ করতে এবং কোনো বিভ্রান্তি ছাড়াই আপনার আশেপাশে সমস্যাগুলি রিপোর্ট করতে সহায়তা করে।",
      actionServices: { title: "একটি পরিষেবা খুঁজুন", desc: "আপনি কি প্রয়োজন নিশ্চিত না? আমাদের আপনার পরিস্থিতি বলুন।" },
      actionDocs: { title: "নথি সহকারী", desc: "আবেদন করার জন্য আপনার কী দরকার তার একটি পরিষ্কার চেকলিস্ট পান।" },
      actionReport: { title: "একটি সমস্যা রিপোর্ট করুন", desc: "গর্ত, জল ফুটো, বা রাস্তার আলোর সমস্যা।" },
      actionTrack: { title: "অভিযোগ ট্র্যাক করুন", desc: "আপনার রিপোর্ট করা সমস্যাগুলির অবস্থা পরীক্ষা করুন।" },
    },
    Tamil: {
      heroTitle: "அரசு சேவைகள், எளிமைப்படுத்தப்பட்டுள்ளன.",
      heroSubtitle: "சரியான சேவையைக் கண்டறியவும், உங்கள் ஆவணங்களைச் சேகரிக்கவும், எந்தக் குழப்பமும் இல்லாமல் உங்கள் அருகிலுள்ள சிக்கல்களைப் புகாரளிக்கவும் நாக்ரிக் சாதி உங்களுக்கு உதவுகிறது.",
      actionServices: { title: "சேவையைக் கண்டறியவும்", desc: "உங்களுக்கு என்ன தேவை என்று தெரியவில்லையா? உங்கள் நிலைமையை எங்களிடம் கூறுங்கள்." },
      actionDocs: { title: "ஆவண உதவியாளர்", desc: "விண்ணப்பிக்க உங்களுக்கு என்ன தேவை என்பதற்கான தெளிவான சரிபார்ப்புப் பட்டியலைப் பெறவும்." },
      actionReport: { title: "ஒரு சிக்கலைப் புகாரளி", desc: "குழிகள், நீர் கசிவுகள் அல்லது தெருவிளக்கு பிரச்சினைகள்." },
      actionTrack: { title: "புகாரைக் கண்காணிக்கவும்", desc: "நீங்கள் புகாரளித்த சிக்கல்களின் நிலையைக் சரிபார்க்கவும்." },
    }
  };

  const t = content[language];

  const actions = [
    { id: 'services', icon: Search, color: 'bg-blue-100 text-blue-700', ...t.actionServices },
    { id: 'documents', icon: FileText, color: 'bg-emerald-100 text-emerald-700', ...t.actionDocs },
    { id: 'report', icon: AlertCircle, color: 'bg-rose-100 text-rose-700', ...t.actionReport },
    { id: 'track', icon: TrendingUp, color: 'bg-amber-100 text-amber-700', ...t.actionTrack },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-600"></div>
        <ShieldCheck className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          {t.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => setCurrentView(action.id)}
              className="group flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:-translate-y-1"
            >
              <div className={`p-4 rounded-xl ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{action.title}</h2>
              <p className="text-slate-600 mb-4 flex-grow">{action.desc}</p>
              <div className="flex items-center text-indigo-600 font-semibold mt-auto group-hover:translate-x-2 transition-transform">
                <span>Start</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
