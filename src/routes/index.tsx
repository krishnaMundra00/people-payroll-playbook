import { createFileRoute } from "@tanstack/react-router";
import { WorkforcePortal } from "@/components/workforce-portal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "WorkforceOS | HR, Payroll & Compliance" },
      { name: "description", content: "A clear, connected view of your people operations, payroll, attendance and compliance." },
      { property: "og:title", content: "WorkforceOS | HR, Payroll & Compliance" },
      { property: "og:description", content: "A clear, connected view of your people operations, payroll, attendance and compliance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return <WorkforcePortal />;
}
