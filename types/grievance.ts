export type HealthField = "issueDescribed" | "location" | "department" | "dateOrTimeframe" | "desiredOutcome" | "supportingDetail";
export interface GrievanceDraft { summary: string | null; fullText: string | null; location: string | null; department: string | null; dateOrTimeframe: string | null; desiredOutcome: string | null; }
export interface ChatTurn { role: "user" | "assistant"; content: string; }
export interface MockGrievanceRecord { id: string; draft: GrievanceDraft; citizenName: string; status: "Registered" | "Pending with Nodal Officer" | "Transferred" | "Disposed"; statusNote: string; filedOn: string; slaDeadline: string; }
