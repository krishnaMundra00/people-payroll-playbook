import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, BriefcaseBusiness, Building2, Check,
  CheckCircle2, Clock3, FileCheck2, FileText, MapPin, Plus, Search, ShieldCheck,
  Upload, Users, X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { departmentDistribution, type Activity as ActivityItem } from "@/lib/workforce-demo";

export type WorkspaceViewKey =
  | "Dashboard" | "Employees" | "Attendance" | "Departments"
  | "Payroll overview" | "Payroll runs" | "Payslips"
  | "Compliance dashboard" | "Obligations & tasks" | "Compliance calendar"
  | "Audits" | "Audit findings" | "Documents" | "Reports"
  | "Users & roles" | "Locations" | "Settings" | "Audit trail";

type WorkspaceDocument = { name: string; category: string; owner: string; updated: string; status: string };

const startingDocuments: WorkspaceDocument[] = [
  { name: "November payroll register", category: "Payroll", owner: "Priya Nair", updated: "14 Nov 2026", status: "Verified" },
  { name: "Bengaluru PF contribution evidence", category: "Compliance", owner: "Kavya Reddy", updated: "12 Nov 2026", status: "Verified" },
  { name: "Employee handbook · 2026", category: "Policy", owner: "Ananya Sharma", updated: "08 Nov 2026", status: "Current" },
  { name: "October attendance summary", category: "Workforce", owner: "Ananya Sharma", updated: "03 Nov 2026", status: "Current" },
];

const reportRows = [
  { name: "Employee headcount", group: "Workforce", frequency: "Monthly", updated: "01 Nov 2026" },
  { name: "Attendance summary", group: "Workforce", frequency: "Monthly", updated: "14 Nov 2026" },
  { name: "Payroll register", group: "Payroll", frequency: "Monthly", updated: "14 Nov 2026" },
  { name: "Payroll cost summary", group: "Payroll", frequency: "Monthly", updated: "14 Nov 2026" },
  { name: "Compliance status", group: "Compliance", frequency: "Monthly", updated: "12 Nov 2026" },
  { name: "Compliance exceptions", group: "Compliance", frequency: "As needed", updated: "12 Nov 2026" },
  { name: "Audit observations", group: "Audit", frequency: "Quarterly", updated: "08 Nov 2026" },
];

const seedAudits = [
  { id: "AUD-2026-041", name: "Payroll controls review", type: "Internal", location: "Bengaluru", period: "Nov 2026", auditor: "Kavya Reddy", status: "In progress" },
  { id: "AUD-2026-038", name: "Employee records review", type: "Internal", location: "Mumbai", period: "Oct 2026", auditor: "Ananya Sharma", status: "Scheduled" },
  { id: "AUD-2026-032", name: "Statutory evidence check", type: "Compliance", location: "All locations", period: "Sep 2026", auditor: "Priya Nair", status: "Completed" },
];

const seedFindings = [
  { id: "FND-108", title: "Missing supporting evidence", audit: "Statutory evidence check", owner: "Kavya Reddy", due: "20 Nov 2026", severity: "Medium", status: "Open" },
  { id: "FND-104", title: "Attendance approval record", audit: "Payroll controls review", owner: "Ananya Sharma", due: "24 Nov 2026", severity: "Low", status: "In progress" },
  { id: "FND-097", title: "Archived payroll reconciliation", audit: "Payroll controls review", owner: "Priya Nair", due: "07 Nov 2026", severity: "High", status: "Resolved" },
];

const seedUsers = [
  { name: "Ananya Sharma", email: "ananya.sharma@northstar.example", role: "HR administrator", status: "Active" },
  { name: "Priya Nair", email: "priya.nair@northstar.example", role: "Payroll specialist", status: "Active" },
  { name: "Kavya Reddy", email: "kavya.reddy@northstar.example", role: "Compliance analyst", status: "Active" },
  { name: "Rohan Mehta", email: "rohan.mehta@northstar.example", role: "Employee", status: "Invited" },
];

const seedLocations = [
  { name: "Bengaluru", state: "Karnataka", employees: 428, status: "Active" },
  { name: "Mumbai", state: "Maharashtra", employees: 310, status: "Active" },
  { name: "Hyderabad", state: "Telangana", employees: 186, status: "Active" },
  { name: "Chennai", state: "Tamil Nadu", employees: 142, status: "Active" },
  { name: "Pune", state: "Maharashtra", employees: 105, status: "Active" },
  { name: "Kolkata", state: "West Bengal", employees: 80, status: "Active" },
];

function statusTone(status: string) {
  if (["Completed", "Verified", "Current", "Resolved", "Active"].includes(status)) return "bg-success-soft text-success";
  if (["In progress", "Medium", "Invited", "Scheduled"].includes(status)) return "bg-warning-soft text-warning";
  if (["High", "Open", "Inactive"].includes(status)) return "bg-critical-soft text-critical";
  return "bg-information-soft text-information";
}

function StatusLabel({ value }: { value: string }) {
  return <Badge className={`rounded-full border-0 px-2.5 py-1 font-medium ${statusTone(value)}`}>{value}</Badge>;
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs text-muted-foreground">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1.5 text-sm text-muted-foreground">{description}</p></div>{action}</div>;
}

function EmptyMessage({ children }: { children: string }) {
  return <p className="px-5 py-12 text-center text-sm text-muted-foreground">{children}</p>;
}

export function WorkspaceViews({ view, activities, onNavigate }: { view: WorkspaceViewKey; activities: ActivityItem[]; onNavigate: (view: WorkspaceViewKey) => void }) {
  if (view === "Departments") return <DepartmentsWorkspace onNavigate={onNavigate} />;
  if (view === "Audits") return <AuditsWorkspace />;
  if (view === "Audit findings") return <FindingsWorkspace />;
  if (view === "Documents") return <DocumentsWorkspace />;
  if (view === "Reports") return <ReportsWorkspace />;
  if (view === "Users & roles") return <UsersWorkspace />;
  if (view === "Locations") return <LocationsWorkspace />;
  if (view === "Settings") return <SettingsWorkspace />;
  return <AuditTrailWorkspace activities={activities} onNavigate={onNavigate} />;
}

function DepartmentsWorkspace({ onNavigate }: { onNavigate: (view: WorkspaceViewKey) => void }) {
  const [departments, setDepartments] = useState(departmentDistribution.map((item) => ({ ...item, lead: item.name === "Engineering" ? "Ishita Banerjee" : item.name === "Finance" ? "Priya Nair" : item.name === "People & Culture" ? "Ananya Sharma" : "Unassigned" })));
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const shown = departments.filter((item) => `${item.name} ${item.lead}`.toLowerCase().includes(search.toLowerCase()));
  const addDepartment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.trim();
    if (!name || departments.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      toast.error(name ? "That department already exists" : "Enter a department name");
      return;
    }
    setDepartments((current) => [...current, { name, count: 0, lead: "Unassigned" }]);
    setDraft("");
    toast.success(`${name} department created`);
  };
  return <div className="space-y-6"><PageHeading eyebrow="Workforce / Structure" title="Departments" description="Review teams, ownership and headcount across the organisation." action={<Button variant="outline" onClick={() => onNavigate("Employees")}><Users className="h-4 w-4" />Employee directory</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Departments" value={String(departments.length)} icon={BriefcaseBusiness} /><SummaryTile title="Employees represented" value={departments.reduce((sum, item) => sum + item.count, 0).toLocaleString("en-IN")} icon={Users} /><SummaryTile title="Leads assigned" value={String(departments.filter((item) => item.lead !== "Unassigned").length)} icon={CheckCircle2} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">Department directory</h2><p className="mt-1 text-xs text-muted-foreground">Illustrative organisation structure</p></div><div className="flex flex-wrap gap-2"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search departments" className="h-9 pl-9" placeholder="Find a department" value={search} onChange={(event) => setSearch(event.target.value)} /></label><form onSubmit={addDepartment} className="flex gap-2"><Input aria-label="New department name" className="h-9 w-40" placeholder="New department" value={draft} onChange={(event) => setDraft(event.target.value)} /><Button type="submit" size="sm"><Plus className="h-4 w-4" />Add</Button></form></div></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b bg-muted/40 text-[10px] uppercase text-muted-foreground"><th className="px-5 py-3">Department</th><th className="px-4 py-3">Department lead</th><th className="px-4 py-3 text-right">Headcount</th><th className="px-5 py-3 text-right">Directory</th></tr></thead><tbody>{shown.map((item) => <tr key={item.name} className="border-b last:border-0"><td className="px-5 py-3.5 text-sm font-medium">{item.name}</td><td className="px-4 py-3.5 text-xs text-muted-foreground">{item.lead}</td><td className="px-4 py-3.5 text-right text-sm tabular-nums">{item.count}</td><td className="px-5 py-3.5 text-right"><Button variant="ghost" size="sm" onClick={() => onNavigate("Employees")}>View employees<ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></td></tr>)}</tbody></table>{shown.length === 0 && <EmptyMessage>No departments match your search.</EmptyMessage>}</div></section>
  </div>;
}

function AuditsWorkspace() {
  const [audits, setAudits] = useState(seedAudits);
  const [filter, setFilter] = useState("All audits");
  const shown = audits.filter((audit) => filter === "All audits" || audit.status === filter);
  const updateAudit = (id: string, status: string) => {
    setAudits((current) => current.map((audit) => audit.id === id ? { ...audit, status } : audit));
    toast.success(`Audit ${id} marked ${status.toLowerCase()}`);
  };
  return <div className="space-y-6"><PageHeading eyebrow="Audit / Review programme" title="Audits" description="Plan reviews, track progress and close completed audit cycles." action={<Button onClick={() => { const id = `AUD-2026-${String(42 + audits.length).padStart(3, "0")}`; setAudits((current) => [{ id, name: "New controls review", type: "Internal", location: "All locations", period: "Nov 2026", auditor: "Ananya Sharma", status: "Scheduled" }, ...current]); toast.success("Audit added to the review programme"); }}><Plus className="h-4 w-4" />New audit</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Total reviews" value={String(audits.length)} icon={FileCheck2} /><SummaryTile title="In progress" value={String(audits.filter((audit) => audit.status === "In progress").length)} icon={Clock3} /><SummaryTile title="Completed" value={String(audits.filter((audit) => audit.status === "Completed").length)} icon={CheckCircle2} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div><h2 className="text-sm font-semibold">Review programme</h2><p className="mt-1 text-xs text-muted-foreground">Fictional internal audit records</p></div><select aria-label="Filter audits" className="h-9 rounded-md border border-input bg-card px-3 text-xs" value={filter} onChange={(event) => setFilter(event.target.value)}>{["All audits", "Scheduled", "In progress", "Completed"].map((status) => <option key={status}>{status}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="px-5 py-3">Audit</th><th className="px-4 py-3">Type / period</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Auditor</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{shown.map((audit) => <tr key={audit.id} className="border-b last:border-0"><td className="px-5 py-3.5"><p className="text-xs font-semibold">{audit.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{audit.id}</p></td><td className="px-4 py-3.5 text-xs text-muted-foreground">{audit.type} · {audit.period}</td><td className="px-4 py-3.5 text-xs">{audit.location}</td><td className="px-4 py-3.5 text-xs">{audit.auditor}</td><td className="px-4 py-3.5"><StatusLabel value={audit.status} /></td><td className="px-5 py-3.5 text-right"><Button size="sm" variant={audit.status === "Completed" ? "outline" : "ghost"} onClick={() => updateAudit(audit.id, audit.status === "Completed" ? "In progress" : "Completed")}>{audit.status === "Completed" ? "Reopen" : "Complete"}</Button></td></tr>)}</tbody></table>{shown.length === 0 && <EmptyMessage>No audits match this status.</EmptyMessage>}</div></section>
  </div>;
}

function FindingsWorkspace() {
  const [findings, setFindings] = useState(seedFindings);
  const [filter, setFilter] = useState("All findings");
  const shown = findings.filter((finding) => filter === "All findings" || finding.status === filter);
  const advance = (id: string) => {
    setFindings((current) => current.map((finding) => finding.id === id ? { ...finding, status: finding.status === "Open" ? "In progress" : finding.status === "In progress" ? "Resolved" : "Open" } : finding));
    const item = findings.find((finding) => finding.id === id);
    toast.success(item?.status === "Open" ? "Corrective action started" : item?.status === "In progress" ? "Finding resolved" : "Finding reopened");
  };
  return <div className="space-y-6"><PageHeading eyebrow="Audit / Corrective actions" title="Audit findings" description="Assign owners and follow observations through resolution." action={<Button variant="outline" onClick={() => setFilter("Open")}><Activity className="h-4 w-4" />Open findings</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Open" value={String(findings.filter((item) => item.status === "Open").length)} icon={Clock3} /><SummaryTile title="In progress" value={String(findings.filter((item) => item.status === "In progress").length)} icon={Activity} /><SummaryTile title="Resolved" value={String(findings.filter((item) => item.status === "Resolved").length)} icon={CheckCircle2} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div><h2 className="text-sm font-semibold">Corrective action register</h2><p className="mt-1 text-xs text-muted-foreground">Severity and deadlines are illustrative sample data</p></div><select aria-label="Filter findings" className="h-9 rounded-md border border-input bg-card px-3 text-xs" value={filter} onChange={(event) => setFilter(event.target.value)}>{["All findings", "Open", "In progress", "Resolved"].map((status) => <option key={status}>{status}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="px-5 py-3">Finding</th><th className="px-4 py-3">Audit</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Due</th><th className="px-4 py-3">Severity</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{shown.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="px-5 py-3.5"><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.id}</p></td><td className="px-4 py-3.5 text-xs text-muted-foreground">{item.audit}</td><td className="px-4 py-3.5 text-xs">{item.owner}</td><td className="px-4 py-3.5 text-xs tabular-nums">{item.due}</td><td className="px-4 py-3.5"><StatusLabel value={item.severity} /></td><td className="px-4 py-3.5"><StatusLabel value={item.status} /></td><td className="px-5 py-3.5 text-right"><Button size="sm" variant="outline" onClick={() => advance(item.id)}>{item.status === "Resolved" ? "Reopen" : "Update"}</Button></td></tr>)}</tbody></table>{shown.length === 0 && <EmptyMessage>No findings match this status.</EmptyMessage>}</div></section>
  </div>;
}

function DocumentsWorkspace() {
  const [documents, setDocuments] = useState(startingDocuments);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<WorkspaceDocument | null>(null);
  const shown = useMemo(() => documents.filter((document) => (category === "All categories" || document.category === category) && `${document.name} ${document.owner}`.toLowerCase().includes(search.toLowerCase())), [category, documents, search]);
  const uploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const added = files.map((file) => ({ name: file.name, category: "Uploaded", owner: "Ananya Sharma", updated: "Just now", status: "Unverified" }));
    setDocuments((current) => [...added, ...current]);
    toast.success(`${files.length} document${files.length === 1 ? "" : "s"} added to this demo`);
    event.target.value = "";
  };
  return <div className="space-y-6"><PageHeading eyebrow="Resources / File library" title="Documents" description="Find and add workforce, payroll and compliance files." action={<label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"><Upload className="h-4 w-4" />Upload files<Input aria-label="Upload documents" type="file" multiple className="sr-only" onChange={uploadFiles} /></label>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Documents" value={String(documents.length)} icon={FileText} /><SummaryTile title="Verified" value={String(documents.filter((item) => item.status === "Verified").length)} icon={ShieldCheck} /><SummaryTile title="Needs review" value={String(documents.filter((item) => item.status === "Unverified").length)} icon={Clock3} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">Document library</h2><p className="mt-1 text-xs text-muted-foreground">New files remain in this browser demo only.</p></div><div className="flex gap-2"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search documents" className="h-9 pl-9" placeholder="Search files" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select aria-label="Filter document category" className="h-9 rounded-md border border-input bg-card px-3 text-xs" value={category} onChange={(event) => setCategory(event.target.value)}>{["All categories", ...new Set(documents.map((item) => item.category))].map((item) => <option key={item}>{item}</option>)}</select></div></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b bg-muted/40 text-[10px] uppercase text-muted-foreground"><th className="px-5 py-3">Document</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{shown.map((item) => <tr key={`${item.name}-${item.updated}`} className="border-b last:border-0"><td className="px-5 py-3.5"><span className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-information-soft text-information"><FileText className="h-4 w-4" /></span><span className="text-xs font-medium">{item.name}</span></span></td><td className="px-4 py-3.5 text-xs text-muted-foreground">{item.category}</td><td className="px-4 py-3.5 text-xs">{item.owner}</td><td className="px-4 py-3.5 text-xs text-muted-foreground">{item.updated}</td><td className="px-4 py-3.5"><StatusLabel value={item.status} /></td><td className="px-5 py-3.5 text-right"><Button variant="ghost" size="sm" onClick={() => setSelected(item)}>Preview<ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></td></tr>)}</tbody></table>{shown.length === 0 && <EmptyMessage>No documents match your search.</EmptyMessage>}</div></section>
    {selected && <section className="portal-surface flex flex-wrap items-center justify-between gap-3 rounded-lg p-4" aria-live="polite"><div><p className="text-sm font-semibold">{selected.name}</p><p className="mt-1 text-xs text-muted-foreground">{selected.category} · {selected.owner} · {selected.updated}</p><p className="mt-1 text-[11px] text-muted-foreground">Demo preview: file contents are not stored or transmitted.</p></div><Button variant="ghost" size="icon" aria-label="Close document preview" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button></section>}
  </div>;
}

function ReportsWorkspace() {
  const [category, setCategory] = useState("All reports");
  const [location, setLocation] = useState("All locations");
  const shown = reportRows.filter((item) => category === "All reports" || item.group === category);
  const exportReport = (name: string) => {
    const rows = [["Report", "Period", "Location", "Note"], [name, "November 2026", location, "Illustrative sample report"]];
    const content = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${name.toLowerCase().replaceAll(" ", "-")}.csv`; anchor.click(); URL.revokeObjectURL(url);
    toast.success(`${name} sample CSV exported`);
  };
  return <div className="space-y-6"><PageHeading eyebrow="Resources / Analytics" title="Reports" description="Review and export workforce, payroll and compliance summaries." action={<Button variant="outline" onClick={() => window.print()}><FileText className="h-4 w-4" />Print view</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Workforce reports" value={String(reportRows.filter((item) => item.group === "Workforce").length)} icon={Users} /><SummaryTile title="Payroll reports" value={String(reportRows.filter((item) => item.group === "Payroll").length)} icon={BriefcaseBusiness} /><SummaryTile title="Compliance & audit" value={String(reportRows.filter((item) => item.group === "Compliance" || item.group === "Audit").length)} icon={ShieldCheck} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">Report catalogue</h2><p className="mt-1 text-xs text-muted-foreground">Exports contain clearly labeled sample data.</p></div><div className="flex gap-2"><select aria-label="Filter report category" className="h-9 rounded-md border border-input bg-card px-3 text-xs" value={category} onChange={(event) => setCategory(event.target.value)}>{["All reports", "Workforce", "Payroll", "Compliance", "Audit"].map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Report location" className="h-9 rounded-md border border-input bg-card px-3 text-xs" value={location} onChange={(event) => setLocation(event.target.value)}>{["All locations", "Bengaluru", "Mumbai", "Hyderabad", "Chennai", "Pune", "Kolkata"].map((item) => <option key={item}>{item}</option>)}</select></div></div>
    <div className="divide-y">{shown.map((item) => <div key={item.name} className="flex flex-wrap items-center gap-3 px-5 py-4"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground"><FileText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.group} · {item.frequency} · Updated {item.updated}</p></div><Button variant="outline" size="sm" onClick={() => exportReport(item.name)}><ArrowDownToLine className="h-3.5 w-3.5" />Export CSV</Button></div>)}</div></section>
  </div>;
}

function UsersWorkspace() {
  const [users, setUsers] = useState(seedUsers);
  const [showRoles, setShowRoles] = useState(false);
  const inviteUser = () => {
    const email = window.prompt("Enter a work email to add to this demo:");
    if (!email?.trim()) return;
    setUsers((current) => [...current, { name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()), email: email.trim(), role: "Employee", status: "Invited" }]);
    toast.success("Demo user invitation added");
  };
  return <div className="space-y-6"><PageHeading eyebrow="Administration / Access" title="Users & roles" description="Review workspace access and example role assignments." action={<Button onClick={inviteUser}><Plus className="h-4 w-4" />Invite user</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Workspace users" value={String(users.length)} icon={Users} /><SummaryTile title="Active access" value={String(users.filter((item) => item.status === "Active").length)} icon={CheckCircle2} /><SummaryTile title="Example roles" value="4" icon={ShieldCheck} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div><h2 className="text-sm font-semibold">People with access</h2><p className="mt-1 text-xs text-muted-foreground">Role labels demonstrate the interface; they are not security controls.</p></div><Button variant="outline" size="sm" aria-pressed={showRoles} onClick={() => setShowRoles((current) => !current)}><ShieldCheck className="h-3.5 w-3.5" />{showRoles ? "Hide role guide" : "Role guide"}</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="px-5 py-3">User</th><th className="px-4 py-3">Example role</th><th className="px-4 py-3">Access status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.email} className="border-b last:border-0"><td className="px-5 py-3.5"><p className="text-xs font-medium">{user.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{user.email}</p></td><td className="px-4 py-3.5 text-xs">{user.role}</td><td className="px-4 py-3.5"><StatusLabel value={user.status} /></td><td className="px-5 py-3.5 text-right"><Button variant="ghost" size="sm" onClick={() => { setUsers((current) => current.map((item) => item.email === user.email ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item)); toast.message(`${user.name} demo access updated`); }}>{user.status === "Active" ? "Suspend" : "Activate"}</Button></td></tr>)}</tbody></table></div>{showRoles && <div className="grid gap-3 border-t p-4 sm:grid-cols-2 xl:grid-cols-4">{[{ role: "HR administrator", detail: "People records and workspace settings" }, { role: "Payroll specialist", detail: "Payroll preparation and review" }, { role: "Compliance analyst", detail: "Obligations, evidence and audits" }, { role: "Employee", detail: "Personal self-service records" }].map((item) => <div key={item.role} className="rounded-md bg-muted/50 p-3"><p className="text-xs font-semibold">{item.role}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.detail}</p></div>)}</div>}</section>
  </div>;
}

function LocationsWorkspace() {
  const [locations, setLocations] = useState(seedLocations);
  const [showInactive, setShowInactive] = useState(false);
  const visible = locations.filter((item) => showInactive || item.status === "Active");
  const addLocation = () => {
    const name = window.prompt("Enter the city name for this demo location:")?.trim();
    if (!name) return;
    if (locations.some((item) => item.name.toLowerCase() === name.toLowerCase())) { toast.error("That location is already listed"); return; }
    setLocations((current) => [...current, { name, state: "Not specified", employees: 0, status: "Active" }]);
    toast.success(`${name} location added`);
  };
  return <div className="space-y-6"><PageHeading eyebrow="Administration / Organisation" title="Locations" description="Maintain office locations and their workforce coverage." action={<Button onClick={addLocation}><Plus className="h-4 w-4" />Add location</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Locations" value={String(locations.length)} icon={MapPin} /><SummaryTile title="Active locations" value={String(locations.filter((item) => item.status === "Active").length)} icon={CheckCircle2} /><SummaryTile title="Employees assigned" value={locations.reduce((sum, item) => sum + item.employees, 0).toLocaleString("en-IN")} icon={Users} /></div>
    <section className="portal-surface overflow-hidden rounded-lg"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div><h2 className="text-sm font-semibold">Office directory</h2><p className="mt-1 text-xs text-muted-foreground">Sample employee counts by city</p></div><Button variant="outline" size="sm" aria-pressed={showInactive} onClick={() => setShowInactive((current) => !current)}>{showInactive ? "Showing all" : "Active only"}</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[580px] text-left"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="px-5 py-3">Location</th><th className="px-4 py-3">State / region</th><th className="px-4 py-3 text-right">Employees</th><th className="px-5 py-3 text-right">Status</th></tr></thead><tbody>{visible.map((item) => <tr key={item.name} className="border-b last:border-0"><td className="px-5 py-3.5 text-xs font-medium">{item.name}</td><td className="px-4 py-3.5 text-xs text-muted-foreground">{item.state}</td><td className="px-4 py-3.5 text-right text-xs tabular-nums">{item.employees}</td><td className="px-5 py-3.5 text-right"><StatusLabel value={item.status} /></td></tr>)}</tbody></table></div></section>
  </div>;
}

function SettingsWorkspace() {
  const [settings, setSettings] = useState({ reminders: true, weeklyDigest: false, requireReview: true });
  const [companyName, setCompanyName] = useState("Northstar Technologies");
  const toggle = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }));
  return <div className="space-y-6"><PageHeading eyebrow="Administration / Workspace" title="Settings" description="Manage organisation preferences for this local demonstration." />
    <section className="portal-surface max-w-3xl rounded-lg p-5 sm:p-6"><div className="border-b pb-5"><h2 className="text-sm font-semibold">Organisation profile</h2><p className="mt-1 text-xs text-muted-foreground">The organisation name appears in this demo workspace.</p><label className="mt-4 block max-w-md space-y-1.5 text-xs font-medium">Organisation name<Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} /></label><Button className="mt-3" size="sm" onClick={() => toast.success("Organisation preferences saved in this session")}>Save changes</Button></div>
      <div className="pt-5"><h2 className="text-sm font-semibold">Workspace preferences</h2><div className="mt-3 divide-y">{([{ key: "reminders", title: "Compliance reminders", detail: "Show upcoming obligation alerts." }, { key: "weeklyDigest", title: "Weekly activity digest", detail: "Include a weekly summary in the activity panel." }, { key: "requireReview", title: "Payroll review step", detail: "Keep a review step before payroll approval." }] as const).map(({ key, title, detail }) => <div key={key} className="flex items-center justify-between gap-4 py-3"><div><p className="text-xs font-medium">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></div><Button variant={settings[key] ? "default" : "outline"} size="sm" role="switch" aria-checked={settings[key]} onClick={() => toggle(key)}>{settings[key] ? "On" : "Off"}</Button></div>)}</div></div>
      <p className="mt-4 border-t pt-4 text-[11px] text-muted-foreground">Preferences are held for this page session only; no real organisation data is stored.</p>
    </section>
  </div>;
}

function AuditTrailWorkspace({ activities, onNavigate }: { activities: ActivityItem[]; onNavigate: (view: WorkspaceViewKey) => void }) {
  const [filter, setFilter] = useState("All activity");
  const visible = activities.filter((item) => filter === "All activity" || (filter === "Payroll" && item.icon === "wallet") || (filter === "People" && item.icon === "people") || (filter === "Compliance" && item.icon === "shield"));
  return <div className="space-y-6"><PageHeading eyebrow="Administration / Activity" title="Audit trail" description="Review recent people, payroll and compliance activity." action={<Button variant="outline" onClick={() => onNavigate("Audit findings")}><Activity className="h-4 w-4" />Audit findings</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><SummaryTile title="Recent events" value={String(activities.length)} icon={Activity} /><SummaryTile title="People updates" value={String(activities.filter((item) => item.icon === "people").length)} icon={Users} /><SummaryTile title="Compliance events" value={String(activities.filter((item) => item.icon === "shield").length)} icon={ShieldCheck} /></div>
    <section className="portal-surface rounded-lg p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4"><div><h2 className="text-sm font-semibold">Workspace activity</h2><p className="mt-1 text-xs text-muted-foreground">Updates made during this demo session appear first.</p></div><select aria-label="Filter audit trail" className="h-9 rounded-md border border-input bg-card px-3 text-xs" value={filter} onChange={(event) => setFilter(event.target.value)}>{["All activity", "People", "Payroll", "Compliance"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="divide-y">{visible.map((item, index) => <div key={`${item.title}-${item.time}-${index}`} className="flex items-center gap-3 py-4"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.icon === "wallet" ? "bg-information-soft text-information" : item.icon === "shield" ? "bg-success-soft text-success" : "bg-accent text-accent-foreground"}`}>{item.icon === "wallet" ? <BriefcaseBusiness className="h-4 w-4" /> : item.icon === "shield" ? <ShieldCheck className="h-4 w-4" /> : <Users className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="text-xs font-medium">{item.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.detail}</p></div><span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span></div>)}</div>{visible.length === 0 && <EmptyMessage>No activity matches this category.</EmptyMessage>}<div className="mt-3 flex items-start gap-2 border-t pt-4 text-[11px] text-muted-foreground"><Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />This is an illustrative activity feed, not a tamper-proof audit record.</div></section>
  </div>;
}

function SummaryTile({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Users }) {
  return <div className="portal-surface flex items-center gap-3 rounded-lg p-4"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-information-soft text-information"><Icon className="h-4 w-4" /></span><div><p className="text-[11px] text-muted-foreground">{title}</p><p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p></div></div>;
}