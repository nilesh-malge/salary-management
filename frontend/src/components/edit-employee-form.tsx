"use client";

import { useState, type SubmitEvent } from "react";
import { updateEmployee } from "@/lib/employees-api";
import type { Employee, UpdateEmployeeInput } from "@/types/employees";

type EditEmployeeFormProps = {
  employee: Employee;
  onUpdated: () => void;
  onCancel: () => void;
};

export function EditEmployeeForm({
  employee,
  onUpdated,
  onCancel,
}: EditEmployeeFormProps) {
  const [form, setForm] = useState({
    employeeCode: employee.employeeCode,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    department: employee.department,
    country: employee.country,
    jobTitle: employee.jobTitle,
    salary: employee.salary,
    currencyCode: employee.currencyCode,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCountryChange(country: string) {
    const currencies: Record<string, string> = {
      India: "INR",
      "United States": "USD",
      Germany: "EUR",
      "United Kingdom": "GBP",
      "United Arab Emirates": "AED",
    };

    setForm((current) => ({
      ...current,
      country,
      currencyCode: currencies[country] ?? current.currencyCode,
    }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const input: UpdateEmployeeInput = {
        employeeCode: form.employeeCode.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        department: form.department,
        country: form.country,
        jobTitle: form.jobTitle.trim(),
        salary: Number(form.salary),
        currencyCode: form.currencyCode,
      };

      await updateEmployee(employee.id, input);
      onUpdated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Employee could not be updated.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-slate-900">Edit employee</h3>
          <p className="mt-1 text-sm text-slate-500">
            Update employee details and current salary.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Employee code
          </span>
          <input
            required
            value={form.employeeCode}
            onChange={(event) =>
              updateField("employeeCode", event.target.value)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            First name
          </span>
          <input
            required
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Last name
          </span>
          <input
            required
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Department
          </span>
          <select
            required
            value={form.department}
            onChange={(event) => updateField("department", event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
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
            required
            value={form.country}
            onChange={(event) => handleCountryChange(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="Germany">Germany</option>
            <option value="India">India</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Job title
          </span>
          <input
            required
            value={form.jobTitle}
            onChange={(event) => updateField("jobTitle", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Salary
          </span>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.salary}
            onChange={(event) => updateField("salary", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Currency
          </span>
          <input
            readOnly
            value={form.currencyCode}
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
