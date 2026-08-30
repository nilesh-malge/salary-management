"use client";

import { useEffect, useState } from "react";
import { getPayrollSummary } from "@/lib/api";
import type { PayrollSummary } from "@/types/reports";

function formatCurrency(value: number, currencyCode: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PayrollSummaryCards() {
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getPayrollSummary();
        setSummary(data);
      } catch {
        setError("Payroll summary could not be loaded.");
      }
    }

    void loadSummary();
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading payroll summary...</p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Total payroll",
      value: formatCurrency(summary.totalPayroll, summary.currencyCode),
    },
    {
      label: "Average salary",
      value: formatCurrency(summary.averageSalary, summary.currencyCode),
    },
    {
      label: "Median salary",
      value: formatCurrency(summary.medianSalary, summary.currencyCode),
    },
    {
      label: "Active employees",
      value: summary.employeeCount.toLocaleString("en-IN"),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
