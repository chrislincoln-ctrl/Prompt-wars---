import { useState } from "react";
import { AlertCircle, Camera, MapPin, Send, Loader2 } from "lucide-react";
import { generateJsonContent } from "../lib/gemini";
import { useAppContext } from "../context/AppContext";
import { Complaint } from "../types";

export default function ReportIssue({ setCurrentView }: { setCurrentView: (v: string) => void }) {
  const { language, addComplaint } = useAppContext();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("other");
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  const t = {
    English: {
      title: "Report an Issue",
      subtitle: "Tell us about the problem in your area. We'll summarize it and create an official report.",
      formCat: "Category",
      formDesc: "Description of the problem",
      formDescPlace: "E.g., There is a large pothole on Main Street that has been there for two weeks...",
      formLoc: "Location (Optional)",
      formPhoto: "Upload Photo (Optional)",
      photoAdded: "Photo added successfully",
      submit: "Submit Report",
      submitting: "Processing report...",
    },
    Hindi: {
      title: "समस्या दर्ज करें",
      subtitle: "अपने क्षेत्र की समस्या के बारे में बताएं। हम इसका सारांश बनाएंगे और एक आधिकारिक रिपोर्ट तैयार करेंगे।",
      formCat: "श्रेणी",
      formDesc: "समस्या का विवरण",
      formDescPlace: "उदा. मुख्य सड़क पर एक बड़ा गड्ढा है जो दो सप्ताह से है...",
      formLoc: "स्थान (वैकल्पिक)",
      formPhoto: "फोटो अपलोड करें (वैकल्पिक)",
      photoAdded: "फोटो सफलतापूर्वक जोड़ा गया",
      submit: "रिपोर्ट दर्ज करें",
      submitting: "रिपोर्ट संसाधित की जा रही है...",
    },
    Bengali: {
      title: "সমস্যা রিপোর্ট করুন",
      subtitle: "আপনার এলাকার সমস্যা সম্পর্কে আমাদের জানান। আমরা এটি সংক্ষিপ্ত করব এবং একটি অফিসিয়াল রিপোর্ট তৈরি করব।",
      formCat: "বিভাগ",
      formDesc: "সমস্যার বর্ণনা",
      formDescPlace: "যেমন, মেইন স্ট্রিটে একটি বড় গর্ত আছে...",
      formLoc: "অবস্থান (ঐচ্ছিক)",
      formPhoto: "ছবি আপলোড করুন (ঐচ্ছিক)",
      photoAdded: "ছবি যোগ করা হয়েছে",
      submit: "রিপোর্ট জমা দিন",
      submitting: "রিপোর্ট প্রসেস করা হচ্ছে...",
    },
    Tamil: {
      title: "சிக்கலைப் புகாரளி",
      subtitle: "உங்கள் பகுதியில் உள்ள பிரச்சனையைப் பற்றி எங்களிடம் கூறுங்கள். அதைச் சுருக்கி அதிகாரப்பூர்வ அறிக்கையை உருவாக்குவோம்.",
      formCat: "வகை",
      formDesc: "பிரச்சனையின் விளக்கம்",
      formDescPlace: "உதாரணமாக, பிரதான சாலையில் ஒரு பெரிய குழி உள்ளது...",
      formLoc: "இடம் (விருப்பம்)",
      formPhoto: "புகைப்படம் பதிவேற்றவும் (விருப்பம்)",
      photoAdded: "புகைப்படம் சேர்க்கப்பட்டது",
      submit: "அறிக்கையைச் சமர்ப்பிக்கவும்",
      submitting: "அறிக்கை செயலாக்கப்படுகிறது...",
    }
  };
  const currentT = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setIsLoading(true);

    try {
      const prompt = `A citizen is reporting a civic issue. 
Raw description: "${description}"
Category selected by user: "${category}"

Analyze this issue and output a JSON object with:
1. "category": Auto-categorize strictly into one of: "roads", "water", "electricity", "sanitation", "public_safety", "other".
2. "aiSummary": A clear, well-structured, professional 1-2 sentence summary of the issue.
3. "priority": Assign a priority level ("Low", "Medium", "High").
4. "priorityJustification": A one-line justification for the priority.
Provide all text responses in ${language}.`;

      const schema = {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          aiSummary: { type: "STRING" },
          priority: { type: "STRING" },
          priorityJustification: { type: "STRING" }
        },
        required: ["category", "aiSummary", "priority", "priorityJustification"]
      };

      const sysInstruction = `You are a civic service AI. You structure citizen complaints cleanly and accurately.`;
      
      const result = await generateJsonContent(prompt, schema, sysInstruction);
      
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        trackingId: `NS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        category: result.category,
        description: description,
        location: location,
        status: "Submitted",
        date: new Date().toISOString(),
        aiSummary: result.aiSummary,
        priority: result.priority as any,
        priorityJustification: result.priorityJustification
      };

      addComplaint(newComplaint);
      setCurrentView("track");

    } catch (err) {
      console.error(err);
      alert("Failed to submit report. Please try again.");
      setIsLoading(false);
    }
  };

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsPhotoUploaded(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-rose-100 p-3 rounded-lg text-rose-700">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{currentT.title}</h1>
        </div>
        <p className="text-lg text-slate-600 mb-8">{currentT.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{currentT.formCat}</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 bg-white"
            >
              <option value="roads">Roads & Transport</option>
              <option value="water">Water Supply</option>
              <option value="electricity">Electricity</option>
              <option value="sanitation">Sanitation & Waste</option>
              <option value="public_safety">Public Safety</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">{currentT.formDesc}</label>
             <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={currentT.formDescPlace}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-base resize-none"
              rows={5}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{currentT.formLoc}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900"
                placeholder="e.g., Near City Hall, Block A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{currentT.formPhoto}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-indigo-400 transition-colors bg-slate-50 relative overflow-hidden">
              <div className="space-y-1 text-center">
                {isPhotoUploaded ? (
                  <div className="text-emerald-600 flex flex-col items-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-emerald-500" />
                    <p className="mt-2 text-sm font-semibold">{currentT.photoAdded}</p>
                  </div>
                ) : (
                  <>
                    <Camera className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleMockUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="flex items-center px-8 py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {currentT.submitting}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {currentT.submit}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
