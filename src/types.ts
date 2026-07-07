export interface ServiceInfo {
  id: string;
  category: string;
  name: string;
  department: string;
  processingTime: string;
  description: string;
}

export interface Complaint {
  id: string;
  trackingId: string;
  category: string;
  description: string;
  location?: string;
  status: "Submitted" | "Under Review" | "In Progress" | "Resolved";
  date: string;
  aiSummary: string;
  priority: "Low" | "Medium" | "High";
  priorityJustification: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

export type SupportedLanguage = "English" | "Hindi" | "Bengali" | "Tamil";
