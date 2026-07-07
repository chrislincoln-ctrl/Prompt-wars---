import { useState, useMemo } from "react";
import { Filter, MapPin, MessageSquare, AlertTriangle } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function CommunityIssues() {
  const { complaints, language } = useAppContext();
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const t = {
    English: { title: "Community Issues", subtitle: "See anonymized reports from your area to understand what's being fixed.", category: "All Categories", status: "All Statuses" },
    Hindi: { title: "सामुदायिक समस्याएं", subtitle: "यह समझने के लिए कि क्या ठीक किया जा रहा है, अपने क्षेत्र से अनाम रिपोर्ट देखें।", category: "सभी श्रेणियां", status: "सभी स्थितियां" },
    Bengali: { title: "সম্প্রদায়ের সমস্যা", subtitle: "আপনার এলাকা থেকে কি ঠিক করা হচ্ছে তা বুঝতে বেনামী রিপোর্ট দেখুন।", category: "সব বিভাগ", status: "সমস্ত স্থিতি" },
    Tamil: { title: "சமூக சிக்கல்கள்", subtitle: "என்ன சரிசெய்யப்படுகிறது என்பதைப் புரிந்து கொள்ள உங்கள் பகுதியிலிருந்து அநாமதேய அறிக்கைகளைப் பார்க்கவும்.", category: "அனைத்து பிரிவுகளும்", status: "அனைத்து நிலைகளும்" }
  };
  const currentT = t[language];

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchCat = filterCat === "all" || c.category === filterCat;
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      return matchCat && matchStatus;
    });
  }, [complaints, filterCat, filterStatus]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentT.title}</h1>
          <p className="text-lg text-slate-600">{currentT.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <select 
              value={filterCat} 
              onChange={e => setFilterCat(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700"
            >
              <option value="all">{currentT.category}</option>
              <option value="roads">Roads & Transport</option>
              <option value="water">Water Supply</option>
              <option value="electricity">Electricity</option>
              <option value="sanitation">Sanitation</option>
            </select>
          </div>
          
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700"
            >
              <option value="all">{currentT.status}</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 font-medium">No issues reported matching these filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 
                    c.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                  {c.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">{new Date(c.date).toLocaleDateString()}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{c.aiSummary}</h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate max-w-[120px]">{c.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className={`w-4 h-4 mr-1 ${
                    c.priority === 'High' ? 'text-rose-500' : c.priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                  }`} />
                  <span>{c.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
