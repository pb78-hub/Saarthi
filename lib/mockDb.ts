import { GrievanceDraft, MockGrievanceRecord } from "@/types/grievance";
const now = new Date(); const dated = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();
// Demo-only in-memory store. Replace with durable storage before any real use.
const records = new Map<string, MockGrievanceRecord>([
["SAA/2026/DEMO01", { id:"SAA/2026/DEMO01", citizenName:"Asha Sharma", status:"Pending with Nodal Officer", statusNote:"Your complaint has reached the district water board. A site visit is expected before the issue is closed.", filedOn:dated(-8), slaDeadline:dated(13), draft:{summary:"No water supply",fullText:"Water supply has been unavailable in my area.",location:"Sector 12, Noida",department:"Drinking Water and Sanitation",dateOrTimeframe:"for several days",desiredOutcome:"Restore regular water supply"} }],
["SAA/2026/DEMO02", { id:"SAA/2026/DEMO02", citizenName:"Rohan Mehta", status:"Disposed", statusNote:"The railway refund has been processed and credited to the account used for the booking.", filedOn:dated(-25), slaDeadline:dated(-4), draft:{summary:"Delayed train ticket refund",fullText:"My cancelled ticket refund has not been received.",location:"Online booking",department:"Railways",dateOrTimeframe:"since last month",desiredOutcome:"Receive the pending refund"} }]
]);
export const getRecord = (id:string) => records.get(id.trim().toUpperCase());
export function createRecord(draft:GrievanceDraft,citizenName:string){ const id=`SAA/${new Date().getFullYear()}/${Math.floor(100000+Math.random()*900000)}`; const record:MockGrievanceRecord={id,draft,citizenName,status:"Registered",statusNote:"Your grievance has been registered and will be sent to the right officer for action.",filedOn:new Date().toISOString(),slaDeadline:new Date(Date.now()+21*86400000).toISOString()}; records.set(id,record); return record; }
export const daysLeft = (deadline:string) => Math.max(0,Math.ceil((new Date(deadline).getTime()-Date.now())/86400000));
