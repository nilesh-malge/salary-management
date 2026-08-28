# Salary Management – Requirements

## Goal

Build a salary management application for an organization with around 10,000 employees across multiple departments and countries.

The application will be used by an HR Manager to maintain employee salary information and understand how employees are paid across the organization. It should make it easy to answer questions such as: What is our total payroll? How does average pay differ across departments or countries? How are salaries distributed across the organization?

## What I Will Build

**Employee Management**

- View, add and update employee details and their current salary.
- Search employees and filter by department, country and employment status.
- Sort and browse employees using server-side pagination.
- Mark employees as inactive when they leave the organization rather than permanently deleting their records.

**Salary & Currency**

- Store each employee's current salary in their local currency.
- Use a fixed, seeded exchange-rate table to convert salaries into a common reporting currency for organization-wide comparisons.
- Preserve the employee's original salary and currency while using converted values only for reporting.

**Salary Insights**

- Total payroll spend, average salary, median salary and employee count.
- Department-wise and country-wise salary breakdowns.
- Salary distribution across employees.
- Filters to allow HR to explore these insights for different groups of employees.

The application will include seed data for 10,000 employees and automated tests covering important business behaviour.

## What I Will Not Build

For this version, I am deliberately leaving out salary revision history, authentication/SSO, payroll payments, tax and deduction calculations, live exchange rates, approval workflows, notifications and employee self-service.

These would be useful in a larger production HR/payroll system, but they are not required to solve the main problem in this assessment. Keeping them outside the initial scope allows me to focus on the core salary management and reporting experience without adding unnecessary complexity.

## Key Decisions

**Current salary only:** Maintaining the current salary is sufficient for this scope. Salary history can be introduced later if audit or compensation-trend requirements are added.

**Fixed exchange rates:** Fixed rates keep reporting predictable and testable without introducing a dependency on an external currency service.

**Soft delete:** Employees who leave will be marked inactive so their information is retained for reporting rather than being permanently lost.

**Authentication:** I am assuming this is an internal application being accessed by an already authenticated HR Manager. Authentication/SSO would be considered for a production version.
