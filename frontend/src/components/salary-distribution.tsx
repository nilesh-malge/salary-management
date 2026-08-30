"use client";

import { useEffect, useState } from "react";
import { getSalaryDistribution } from "@/lib/api";
import type { ReportFilters, SalaryDistribution } from "@/types/reports";

export function SalaryDistributionChart({
  filters,
}: {
  filters: ReportFilters;
}) {
  const [distribution, setDistribution] = useState<SalaryDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDistribution() {
      try {
        const data = await getSalaryDistribution(filters);
        setDistribution(data);
      } catch {
        setError("Salary distribution could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void loadDistribution();
  }, [filters]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading salary distribution...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">{error}</p>
      </div>
    );
  }

  const largestCount = Math.max(
    ...distribution.map((item) => item.employeeCount),
    1,
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-6">
        <h3 className="font-medium text-slate-900">Salary distribution</h3>
        <p className="mt-1 text-sm text-slate-500">
          Active employees by annual salary range in INR
        </p>
      </div>

      <div className="space-y-5">
        {distribution.map((item) => {
          const width = (item.employeeCount / largestCount) * 100;

          return (
            <div key={item.salaryRange}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  {item.salaryRange}
                </span>
                <span className="text-slate-500">
                  {item.employeeCount.toLocaleString("en-IN")} employees
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-700"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
