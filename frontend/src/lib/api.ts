import type {
  CountryPayroll,
  DepartmentPayroll,
  PayrollSummary,
  ReportFilters,
  SalaryDistribution,
} from "@/types/reports";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function buildReportQuery(filters: ReportFilters = {}) {
  const params = new URLSearchParams();

  if (filters.department) {
    params.set("department", filters.department);
  }

  if (filters.country) {
    params.set("country", filters.country);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export async function getPayrollSummary(
  filters: ReportFilters = {},
): Promise<PayrollSummary> {
  const response = await fetch(
    `${API_URL}/reports/payroll-summary${buildReportQuery(filters)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load payroll summary");
  }

  return response.json() as Promise<PayrollSummary>;
}

export async function getDepartmentPayroll(
  filters: ReportFilters = {},
): Promise<DepartmentPayroll[]> {
  const response = await fetch(
    `${API_URL}/reports/payroll-by-department${buildReportQuery(filters)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load department payroll");
  }

  return response.json() as Promise<DepartmentPayroll[]>;
}

export async function getCountryPayroll(
  filters: ReportFilters = {},
): Promise<CountryPayroll[]> {
  const response = await fetch(
    `${API_URL}/reports/payroll-by-country${buildReportQuery(filters)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load country payroll");
  }

  return response.json() as Promise<CountryPayroll[]>;
}

export async function getSalaryDistribution(
  filters: ReportFilters = {},
): Promise<SalaryDistribution[]> {
  const response = await fetch(
    `${API_URL}/reports/salary-distribution${buildReportQuery(filters)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load salary distribution");
  }

  return response.json() as Promise<SalaryDistribution[]>;
}
