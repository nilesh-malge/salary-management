# Technical Design

## Approach

For this application, I am going with a Next.js frontend, NestJS backend and PostgreSQL database. Prisma will be used for database access.

I considered whether the backend needed to be split into multiple services, but I don't see a strong reason to do that for the current scope. We have one main user (HR Manager) and a dataset of around 10,000 employees. A single backend with separate modules for employees and salary reporting should be easier to develop, test and maintain.

If the application grows later, these boundaries should also make it easier to separate parts of the system if required.

## Data Model

For the MVP, the main data I need is employees and exchange rates.

An employee will have:

- `id`
- `employeeCode`
- `firstName`
- `lastName`
- `email`
- `department`
- `country`
- `jobTitle`
- `salary`
- `currencyCode`
- `status`
- `createdAt`
- `updatedAt`

`employeeCode` and `email` will be unique.

I am keeping the current salary on the employee itself. Since salary history is not required for the MVP, introducing a separate salary history model at this stage would add complexity without solving a current requirement.

Exchange rates will contain:

- `id`
- `currencyCode`
- `rateToBase`

I will use INR as the reporting currency. An employee's actual salary will continue to be stored in their local currency. The exchange rate will only be used when salary values need to be compared or aggregated for reporting.

For this exercise, the rates will be fixed and seeded with the database rather than fetched from an external API.

## API and Reporting

The backend will expose REST APIs for employee management and salary reporting.

The employee list will use server-side pagination and support search, filtering and sorting. There is no need to send all 10,000 employee records to the browser for normal list views.

Reporting calculations such as total payroll, average salary and department/country breakdowns will also happen on the backend.

For current payroll calculations, only active employees will be included. Employees marked inactive will remain in the database but will not increase the current payroll numbers.

## Performance Considerations

10,000 employees is not a particularly large dataset for PostgreSQL, so I don't want to introduce caching or additional infrastructure without a demonstrated need.

Pagination and filtering will happen in database queries. I will add indexes for fields that are actually used frequently for lookup or filtering, such as employee code, email and other fields based on the final query patterns.

For salary analytics, calculations should be done as close to the database as practical instead of loading all employee records into the frontend.

## Trade-offs / Future Changes

Some decisions are intentionally simple for the first version:

- Salary history is not being modelled because only the current salary is required.
- Exchange rates are fixed so reporting is deterministic and does not depend on another service.
- Employees are marked inactive instead of being deleted.
- Authentication is not part of this implementation because the HR Manager is assumed to already be authenticated.

If this moved towards production, I would revisit authentication/SSO, salary history, exchange-rate management, audit requirements and the performance of reporting queries based on actual usage.
