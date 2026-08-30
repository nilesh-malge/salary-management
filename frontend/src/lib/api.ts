import type { PayrollSummary } from "@/types/reports";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getPayrollSummary(): Promise<PayrollSummary> {
  const response = await fetch(`${API_URL}/reports/payroll-summary`);

  if (!response.ok) {
    throw new Error("Unable to load payroll summary");
  }

  return response.json() as Promise<PayrollSummary>;
}
