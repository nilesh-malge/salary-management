"use client";

import { useState } from "react";
import { PayrollBreakdown } from "@/components/payroll-breakdown";
import { PayrollSummaryCards } from "@/components/payroll-summary";
import { SalaryDistributionChart } from "@/components/salary-distribution";
import type { ReportFilters } from "@/types/reports";

const departments = [
  "Customer Support",
  "Engineering",
  "Finance",
  "HR",
  "Marketing",
  "Operations",
  "Product",
  "Sales",
];

const countries = [
  "Germany",
  "India",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

type DashboardProps = {
  refreshKey?: number;
};

export function Dashboard({ refreshKey = 0 }: DashboardProps) {
  const [filters, setFilters] = useState<ReportFilters>({});

  function updateFilter(name: keyof ReportFilters, value: string) {
    setFilters((current) => ({
      ...current,
      [name]: value || undefined,
    }));
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row">
        <label className="flex-1">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Department
          </span>
          <select
            value={filters.department ?? ""}
            onChange={(event) => updateFilter("department", event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Country
          </span>
          <select
            value={filters.country ?? ""}
            onChange={(event) => updateFilter("country", event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
      </div>

      <PayrollSummaryCards key={`summary-${refreshKey}`} filters={filters} />

      <div className="mt-8">
        <PayrollBreakdown key={`breakdown-${refreshKey}`} filters={filters} />
      </div>

      <div className="mt-8">
        <SalaryDistributionChart
          key={`distribution-${refreshKey}`}
          filters={filters}
        />
      </div>
    </>
  );
}
