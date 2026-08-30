"use client";

import { FormEvent, useState } from "react";
import { createEmployee } from "@/lib/employees-api";
import type { CreateEmployeeInput } from "@/types/employees";

type AddEmployeeFormProps = {
  onEmployeeCreated: () => void;
};

const initialForm = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  country: "",
  jobTitle: "",
  salary: "",
  currencyCode: "",
};

export function AddEmployeeForm({ onEmployeeCreated }: AddEmployeeFormProps) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      currencyCode: currencies[country] ?? "",
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const input: CreateEmployeeInput = {
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

      await createEmployee(input);

      setForm(initialForm);
      setSuccess("Employee added successfully.");
      onEmployeeCreated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Employee could not be added.",
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
      <div className="mb-5">
        <h3 className="font-medium text-slate-900">Add employee</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add an employee and their current salary information.
        </p>
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
            <option value="">Select department</option>
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
            <option value="">Select country</option>
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

      {success && <p className="mt-4 text-sm text-slate-600">{success}</p>}

      <div className="mt-5">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add employee"}
        </button>
      </div>
    </form>
  );
}
