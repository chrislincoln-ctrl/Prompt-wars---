import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Complaint, SupportedLanguage, ServiceInfo } from "../types";

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  complaints: Complaint[];
  addComplaint: (c: Complaint) => void;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => void;
  selectedService: ServiceInfo | null;
  setSelectedService: (svc: ServiceInfo | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("ns_language");
    return (saved as SupportedLanguage) || "English";
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem("ns_complaints");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);

  useEffect(() => {
    localStorage.setItem("ns_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("ns_complaints", JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (c: Complaint) => setComplaints((prev) => [c, ...prev]);

  const updateComplaintStatus = (id: string, status: Complaint["status"]) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        complaints,
        addComplaint,
        updateComplaintStatus,
        selectedService,
        setSelectedService,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
