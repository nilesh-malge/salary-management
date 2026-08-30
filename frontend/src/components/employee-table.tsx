"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/lib/employees-api";
import type {
  Employee,
  EmployeeListResponse,
  EmployeeSortField,
  EmployeeStatus,
  SortOrder,
} from "@/types/employees";

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
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<EmployeeStatus | "">("");
  const [sortBy, setSortBy] = useState<EmployeeSortField>("employeeCode");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
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
          search: search || undefined,
          department: department || undefined,
          country: country || undefined,
          status: status || undefined,
          sortBy,
          sortOrder,
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
  }, [page, search, department, country, status, sortBy, sortOrder]);

  function resetPage() {
    setPage(1);
  }

  function handleSort(field: EmployeeSortField) {
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }

    resetPage();
  }

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
      <div className="grid gap-4 border-b border-slate-200 p-5 md:grid-cols-4">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Name, email or employee code"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Department
          </span>
          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              resetPage();
            }}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All departments</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Product">Product</option>
            <option value="Sales">Sales</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Country
          </span>
          <select
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              resetPage();
            }}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All countries</option>
            <option value="Germany">Germany</option>
            <option value="India">India</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as EmployeeStatus | "");
              resetPage();
            }}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
      </div>
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
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("employeeCode")}
                  className="inline-flex items-center gap-1"
                >
                  Employee
                  {sortBy === "employeeCode" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("department")}
                  className="inline-flex items-center gap-1"
                >
                  Department
                  {sortBy === "department" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("country")}
                  className="inline-flex items-center gap-1"
                >
                  Country
                  {sortBy === "country" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">Job title</th>

              <th className="px-5 py-3 text-right font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("salary")}
                  className="ml-auto inline-flex items-center gap-1"
                >
                  Salary
                  {sortBy === "salary" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-sm text-slate-500"
                >
                  No employees found.
                </td>
              </tr>
            )}
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
