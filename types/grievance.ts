export type HealthField =
  | "issueDescribed"
  | "location"
  | "department"
  | "dateOrTimeframe"
  | "desiredOutcome"
  | "supportingDetail";

export interface GrievanceDraft {
  summary: string | null;
  fullText: string | null;
  location: string | null;
  department: string | null;
  dateOrTimeframe: string | null;
  desiredOutcome: string | null;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface SaarthiResponse {
  session_id: string;
  stage: string;
  problem_type: string | null;
  problem_display?: string | null;
  summary: string | null;
  next_question: string | null;
  readiness_score: number;
  grievance_draft: string | null;
  collected_information: {
    location?: string | null;
    duration?: string | null;
    previous_complaint?: string | null;
  };
  concerned_authority?: string | null;
  language?: string;
  next_action?: string | null;
}

export interface MockGrievanceRecord {
  id: string;
  draft: GrievanceDraft;
  citizenName: string;
  status:
    | "Registered"
    | "Pending with Nodal Officer"
    | "Transferred"
    | "Disposed";
  statusNote: string;
  filedOn: string;
  slaDeadline: string;
}