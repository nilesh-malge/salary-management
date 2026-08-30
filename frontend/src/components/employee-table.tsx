"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/lib/employees-api";
import type { Employee, EmployeeListResponse } from "@/types/employees";

function formatSalary(salary: string, currencyCode: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(salary));
}

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<EmployeeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployees({
          page,
          pageSize: 10,
        });

        setEmployees(response.data);
        setPageInfo(response);
      } catch {
        setError("Employees could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void loadEmployees();
  }, [page]);

  if (loading && !pageInfo) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading employees...</p>
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-slate-900">Employees</h3>
            <p className="mt-1 text-sm text-slate-500">
              {pageInfo?.total.toLocaleString("en-IN")} employee records
            </p>
          </div>

          {loading && (
            <span className="text-sm text-slate-500">Loading...</span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Employee</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Country</th>
              <th className="px-5 py-3 font-medium">Job title</th>
              <th className="px-5 py-3 text-right font-medium">Salary</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">
                    {employee.firstName} {employee.lastName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {employee.employeeCode} - {employee.email}
                  </div>
                </td>

                <td className="px-5 py-3 text-slate-600">
                  {employee.department}
                </td>

                <td className="px-5 py-3 text-slate-600">{employee.country}</td>

                <td className="px-5 py-3 text-slate-600">
                  {employee.jobTitle}
                </td>

                <td className="px-5 py-3 text-right text-slate-600">
                  {formatSalary(employee.salary, employee.currencyCode)}
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      employee.status === "ACTIVE"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-500">
          Page {pageInfo?.page ?? page} of {pageInfo?.totalPages ?? 1}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={loading || !pageInfo || page >= pageInfo.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
