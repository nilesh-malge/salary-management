"use client";

import { useEffect, useState } from "react";
import { getCountryPayroll, getDepartmentPayroll } from "@/lib/api";
import type {
  CountryPayroll,
  DepartmentPayroll,
  ReportFilters,
} from "@/types/reports";

function formatCurrency(value: number, currencyCode: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PayrollBreakdown({ filters }: { filters: ReportFilters }) {
  const [departments, setDepartments] = useState<DepartmentPayroll[]>([]);
  const [countries, setCountries] = useState<CountryPayroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBreakdowns() {
      try {
        const [departmentData, countryData] = await Promise.all([
          getDepartmentPayroll(filters),
          getCountryPayroll(filters),
        ]);

        setDepartments(departmentData);
        setCountries(countryData);
      } catch {
        setError("Payroll breakdown could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void loadBreakdowns();
  }, [filters]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading payroll breakdown...</p>
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BreakdownTable
        title="Payroll by department"
        nameLabel="Department"
        rows={departments.map((department) => ({
          name: department.department,
          averageSalary: department.averageSalary,
          employeeCount: department.employeeCount,
          currencyCode: department.currencyCode,
        }))}
      />

      <BreakdownTable
        title="Payroll by country"
        nameLabel="Country"
        rows={countries.map((country) => ({
          name: country.country,
          averageSalary: country.averageSalary,
          employeeCount: country.employeeCount,
          currencyCode: country.currencyCode,
        }))}
      />
    </div>
  );
}

type BreakdownRow = {
  name: string;
  averageSalary: number;
  employeeCount: number;
  currencyCode: string;
};

function BreakdownTable({
  title,
  nameLabel,
  rows,
}: {
  title: string;
  nameLabel: string;
  rows: BreakdownRow[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-medium text-slate-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">{nameLabel}</th>
              <th className="px-5 py-3 font-medium">Employees</th>
              <th className="px-5 py-3 text-right font-medium">
                Average salary
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="px-5 py-3 text-slate-900">{row.name}</td>
                <td className="px-5 py-3 text-slate-600">
                  {row.employeeCount.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 text-right text-slate-600">
                  {formatCurrency(row.averageSalary, row.currencyCode)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
