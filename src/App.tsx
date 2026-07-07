import { useState } from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import Navigation from "./components/Navigation";
import ChatCompanion from "./components/ChatCompanion";
import Home from "./views/Home";
import ServiceRecommendation from "./views/ServiceRecommendation";
import DocumentAssistant from "./views/DocumentAssistant";
import ReportIssue from "./views/ReportIssue";
import TrackComplaint from "./views/TrackComplaint";
import CommunityIssues from "./views/CommunityIssues";
import TransparencyDashboard from "./views/TransparencyDashboard";

function AppContent() {
  const [currentView, setCurrentView] = useState("home");
  const [largeText, setLargeText] = useState(false);
  const { language } = useAppContext();

  // Basic translation dictionary for static UI shell
  const t = {
    English: {
      appName: "Nagrik Saathi",
      tagline: "Your Citizen Companion",
      skipNav: "Skip to main content",
      largeText: "Larger Text"
    },
    Hindi: {
      appName: "नागरिक साथी",
      tagline: "आपका नागरिक साथी",
      skipNav: "मुख्य सामग्री पर जाएं",
      largeText: "बड़ा टेक्स्ट"
    },
    Bengali: {
      appName: "নাগরিক সাথী",
      tagline: "আপনার নাগরিক সঙ্গী",
      skipNav: "মূল সামগ্রীতে যান",
      largeText: "বড় টেক্সট"
    },
    Tamil: {
      appName: "நாக்ரிக் சாதி",
      tagline: "உங்கள் குடிமகன் தோழன்",
      skipNav: "முக்கிய உள்ளடக்கத்திற்குச் செல்லவும்",
      largeText: "பெரிய உரை"
    }
  };

  const currentT = t[language];

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 ${largeText ? 'text-lg [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-2xl [&_p]:text-xl [&_span]:text-lg [&_button]:text-lg [&_input]:text-lg [&_textarea]:text-lg' : ''}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-50 focus:text-indigo-900">
        {currentT.skipNav}
      </a>
      
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        largeText={largeText}
        setLargeText={setLargeText}
      />
      
      <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none" tabIndex={-1}>
        {currentView === "home" && <Home setCurrentView={setCurrentView} />}
        {currentView === "services" && <ServiceRecommendation setCurrentView={setCurrentView} />}
        {currentView === "documents" && <DocumentAssistant />}
        {currentView === "report" && <ReportIssue setCurrentView={setCurrentView} />}
        {currentView === "track" && <TrackComplaint />}
        {currentView === "community" && <CommunityIssues />}
        {currentView === "dashboard" && <TransparencyDashboard />}
      </main>

      <ChatCompanion />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
