export type WorkforceStatus = "Active" | "On leave" | "Probation";
export type PayrollStatus = "Processing" | "Needs review" | "Awaiting approval" | "Finalized";
export type ComplianceStatus = "Completed" | "Upcoming" | "Due soon" | "Overdue";

export type Employee = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  location: string;
  type: string;
  joined: string;
  status: WorkforceStatus;
  email: string;
};

export type ComplianceTask = {
  id: string;
  title: string;
  description: string;
  category: "PF" | "ESI" | "PT" | "TDS";
  location: string;
  due: string;
  owner: string;
  status: ComplianceStatus;
};

export type Activity = { title: string; detail: string; time: string; icon: "people" | "wallet" | "shield" };

export const employees: Employee[] = [
  { id: "WOS-1042", name: "Ananya Sharma", initials: "AS", role: "People Operations Lead", department: "People & Culture", location: "Bengaluru", type: "Full-time", joined: "12 Mar 2022", status: "Active", email: "ananya.sharma@northstar.example" },
  { id: "WOS-1043", name: "Rohan Mehta", initials: "RM", role: "Senior Product Designer", department: "Product & Design", location: "Mumbai", type: "Full-time", joined: "08 Jun 2023", status: "Active", email: "rohan.mehta@northstar.example" },
  { id: "WOS-1044", name: "Priya Nair", initials: "PN", role: "Payroll Specialist", department: "Finance", location: "Bengaluru", type: "Full-time", joined: "21 Sep 2021", status: "Active", email: "priya.nair@northstar.example" },
  { id: "WOS-1045", name: "Arjun Kapoor", initials: "AK", role: "Frontend Engineer", department: "Engineering", location: "Hyderabad", type: "Full-time", joined: "14 Jan 2024", status: "Probation", email: "arjun.kapoor@northstar.example" },
  { id: "WOS-1046", name: "Kavya Reddy", initials: "KR", role: "Compliance Analyst", department: "Legal & Compliance", location: "Chennai", type: "Full-time", joined: "30 Nov 2022", status: "Active", email: "kavya.reddy@northstar.example" },
  { id: "WOS-1047", name: "Vikram Desai", initials: "VD", role: "Regional Sales Manager", department: "Sales", location: "Pune", type: "Full-time", joined: "02 Feb 2020", status: "On leave", email: "vikram.desai@northstar.example" },
  { id: "WOS-1048", name: "Ishita Banerjee", initials: "IB", role: "Data Analyst", department: "Engineering", location: "Kolkata", type: "Full-time", joined: "17 Jul 2024", status: "Active", email: "ishita.banerjee@northstar.example" },
  { id: "WOS-1049", name: "Aditya Kulkarni", initials: "AK", role: "Finance Associate", department: "Finance", location: "Mumbai", type: "Contract", joined: "05 May 2025", status: "Active", email: "aditya.kulkarni@northstar.example" },
];

export const complianceTasks: ComplianceTask[] = [
  { id: "CMP-214", title: "Provident fund contribution", description: "Monthly contribution remittance and member return", category: "PF", location: "Bengaluru", due: "18 Nov 2026", owner: "Priya Nair", status: "Due soon" },
  { id: "CMP-211", title: "Professional tax return", description: "Quarterly state return and payment confirmation", category: "PT", location: "Maharashtra", due: "20 Nov 2026", owner: "Kavya Reddy", status: "Upcoming" },
  { id: "CMP-209", title: "Employee state insurance", description: "Monthly contribution reconciliation", category: "ESI", location: "All locations", due: "12 Nov 2026", owner: "Priya Nair", status: "Overdue" },
  { id: "CMP-206", title: "Tax deduction at source", description: "Monthly deposit acknowledgement and challan", category: "TDS", location: "All locations", due: "07 Nov 2026", owner: "Aditya Kulkarni", status: "Completed" },
  { id: "CMP-218", title: "Provident fund return", description: "Electronic return upload and member reconciliation", category: "PF", location: "Pune", due: "22 Nov 2026", owner: "Kavya Reddy", status: "Upcoming" },
];

export const payrollRuns: { period: string; id: string; employees: number; gross: number; deductions: number; net: number; status: PayrollStatus }[] = [
  { period: "October 2026", id: "PR-2026-10", employees: 1_248, gross: 48_200_000, deductions: 5_842_000, net: 42_358_000, status: "Finalized" },
  { period: "November 2026", id: "PR-2026-11", employees: 1_251, gross: 48_540_000, deductions: 5_910_000, net: 42_630_000, status: "Processing" },
  { period: "September 2026", id: "PR-2026-09", employees: 1_244, gross: 47_860_000, deductions: 5_721_000, net: 42_139_000, status: "Finalized" },
  { period: "August 2026", id: "PR-2026-08", employees: 1_239, gross: 47_210_000, deductions: 5_634_000, net: 41_576_000, status: "Awaiting approval" },
  { period: "July 2026", id: "PR-2026-07", employees: 1_236, gross: 46_980_000, deductions: 5_512_000, net: 41_468_000, status: "Needs review" },
];

export const payrollTrend = [
  { month: "May", cost: 44.1 },
  { month: "Jun", cost: 45.2 },
  { month: "Jul", cost: 47.0 },
  { month: "Aug", cost: 47.2 },
  { month: "Sep", cost: 47.9 },
  { month: "Oct", cost: 48.2 },
];

export const departmentDistribution = [
  { name: "Engineering", count: 368 },
  { name: "Sales", count: 246 },
  { name: "Operations", count: 205 },
  { name: "Finance", count: 112 },
  { name: "People & Culture", count: 84 },
];

export const activitySeed: Activity[] = [
  { title: "November payroll started", detail: "1,251 employees · Northstar Technologies", time: "18 min ago", icon: "wallet" },
  { title: "Employee record updated", detail: "Ananya Sharma · People & Culture", time: "42 min ago", icon: "people" },
  { title: "Evidence uploaded", detail: "PF contribution · Bengaluru", time: "1 hr ago", icon: "shield" },
  { title: "New starter onboarded", detail: "Arjun Kapoor · Engineering", time: "3 hrs ago", icon: "people" },
];

export const currencyINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const financialYearLabel = (date: Date) => {
  const startYear = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  return `FY ${startYear}–${String(startYear + 1).slice(-2)}`;
};

export const compactINR = (amount: number) => {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
  return currencyINR(amount);
};

export const todayIndian = () =>
  new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());