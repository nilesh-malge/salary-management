import type {
  CountryPayroll,
  DepartmentPayroll,
  PayrollSummary,
  SalaryDistribution,
} from "@/types/reports";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getPayrollSummary(): Promise<PayrollSummary> {
  const response = await fetch(`${API_URL}/reports/payroll-summary`);

  if (!response.ok) {
    throw new Error("Unable to load payroll summary");
  }

  return response.json() as Promise<PayrollSummary>;
}

export async function getDepartmentPayroll(): Promise<DepartmentPayroll[]> {
  const response = await fetch(`${API_URL}/reports/payroll-by-department`);

  if (!response.ok) {
    throw new Error("Unable to load department payroll");
  }

  return response.json() as Promise<DepartmentPayroll[]>;
}

export async function getCountryPayroll(): Promise<CountryPayroll[]> {
  const response = await fetch(`${API_URL}/reports/payroll-by-country`);

  if (!response.ok) {
    throw new Error("Unable to load country payroll");
  }

  return response.json() as Promise<CountryPayroll[]>;
}

export async function getSalaryDistribution(): Promise<SalaryDistribution[]> {
  const response = await fetch(`${API_URL}/reports/salary-distribution`);

  if (!response.ok) {
    throw new Error("Unable to load salary distribution");
  }

  return response.json() as Promise<SalaryDistribution[]>;
}
