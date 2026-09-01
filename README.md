# Salary Management

Salary Management is a small internal application for an HR Manager to maintain employee salary information and view payroll reports for a workforce of around 10,000 employees.

## Deployment

[Live Application](https://salary-management-nilesh24.vercel.app)

The project has a Next.js frontend, a NestJS REST API, and PostgreSQL through Prisma.

I kept the backend as a modular monolith. At the current scope and data size, splitting employee management and reporting into separate services would add deployment and communication overhead without solving a problem the application currently has.

## What the application supports

### Employee management

- Add and update employees
- Search employees
- Filter by department, country, and status
- Sort employee records
- Server-side pagination
- Deactivate employees without deleting their records
- Reactivate inactive employees
- Store salary in the employee's local currency

### Payroll reporting

The dashboard provides:

- total payroll
- average salary
- median salary
- active employee count
- payroll by department
- payroll by country
- salary distribution
- department and country filters

Current payroll reports only include active employees.

## Tech stack

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS
- Jest and React Testing Library

**Backend**

- Node.js
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Jest

**CI**

- GitHub Actions

## Architecture

The repository contains separate frontend and backend applications.

```text
Browser
   |
   v
Next.js / React
   |
   | REST
   v
NestJS
   |
   +-----------------------+
   |                       |
Employees               Reports
   |                       |
   +-----------+-----------+
               |
             Prisma
               |
          PostgreSQL
```

Employee management and reporting are separate backend modules but run in the same NestJS application.

For roughly 10,000 employees, PostgreSQL can handle the required filtering and reporting without introducing additional infrastructure such as Redis or separate reporting services.

More detail about the design is in [docs/design.md](docs/design.md).

The requirements and scope decisions are in [docs/requirements.md](docs/requirements.md).

## Salary and currency handling

Each employee keeps their salary in its native currency.

The reporting endpoints convert salaries to INR using exchange rates stored in the database. The seed contains fixed rates for INR, USD, EUR, GBP, and AED.

I used fixed exchange rates rather than a live FX API because the requirement is reporting rather than currency trading or settlement. Fixed rates also keep seeded reports deterministic and easier to test.

The employee's native salary remains the stored value. Conversion happens only when generating reports.

## Why salary is stored on Employee

The current requirement only needs the employee's current salary.

I considered using a separate salary table, but without salary revision history it would introduce another relationship without adding useful behavior to the MVP.

If salary history is required later, I would introduce a salary history table with effective dates instead of replacing previous salary values.

## Employee deactivation

Employees are soft-deactivated instead of deleted.

An inactive employee remains in the database but is excluded from current payroll reports. This preserves the employee record and avoids losing salary information when someone leaves the organization.

Employees can also be reactivated. This covers cases where an employee rejoins or was deactivated by mistake.

## Database seed

The seed creates:

- 10,000 employees
- 5 fixed exchange rates
- employees across multiple departments and countries
- both active and inactive employees

The employee data is deterministic rather than randomly generated on every run. This makes local development and report verification repeatable.

Run the seed with:

```bash
npx prisma db seed
```

## Running locally

### Prerequisites

- Node.js 24
- npm
- PostgreSQL

### Backend

Create a PostgreSQL database named:

```text
salary_management
```

Move to the backend:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:<port>/salary_management?schema=public
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the existing migrations:

```bash
npx prisma migrate deploy
```

Seed the database:

```bash
npx prisma db seed
```

Start the API:

```bash
npm run start:dev
```

By default the backend runs on:

```text
http://localhost:4000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

The frontend uses `http://localhost:4000` as the local API URL by default.

If a different backend URL is needed, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API

### Employees

```text
POST   /employees
GET    /employees
PATCH  /employees/:id
PATCH  /employees/:id/deactivate
PATCH  /employees/:id/activate
```

`GET /employees` supports pagination, search, filtering, and sorting.

Example:

```text
GET /employees?page=1&pageSize=20&department=Engineering&country=India&status=ACTIVE
```

### Reports

```text
GET /reports/payroll-summary
GET /reports/payroll-by-department
GET /reports/payroll-by-country
GET /reports/salary-distribution
```

Report endpoints can be filtered by department and country.

Example:

```text
GET /reports/payroll-summary?department=Engineering&country=India
```

## Testing

Backend:

```bash
cd backend
npm test
npm run lint
npm run build
```

The backend tests cover the employee service/controller behavior, validation, employee status changes, write errors, currency validation, and reporting logic.

Frontend:

```bash
cd frontend
npm test
npm run lint
npm run build
```

The frontend tests currently focus on important employee workflows: creating an employee and activating/deactivating employee records.

I kept the frontend test scope focused on behavior rather than testing implementation details.

## CI

The repository contains a GitHub Actions workflow under:

```text
.github/workflows/ci.yml
```

On pushes to `main` and on pull requests, CI runs separate backend and frontend jobs.

Backend:

```text
install dependencies
generate Prisma client
run tests
run lint
build
```

Frontend:

```text
install dependencies
run tests
run lint
build
```

## Performance decisions

The expected dataset is around 10,000 employees, so I kept the performance approach simple.

Employee listing uses server-side pagination, filtering, search, and sorting instead of sending all employees to the browser.

Indexes are present on department, country, and status because these fields are used frequently for filtering.

Payroll calculations are performed on the backend close to the database.

I did not add Redis or another caching layer because there is no measured need for it at this scale. If reporting becomes expensive with a much larger dataset, I would first measure the database queries and then decide whether additional indexes, precomputed aggregates, or caching are appropriate.

## Out of scope

The following were intentionally left out of the MVP:

- authentication and SSO
- salary revision history
- payroll payment processing
- tax and deduction calculations
- approval workflows
- live exchange rates
- employee self-service
- notifications

For this exercise, the application assumes a single already-authenticated HR Manager.

Authentication/SSO and authorization would be required before using the application as a production internal system.

## Possible next steps

If the application were taken further, I would consider:

- SSO and role-based authorization
- salary history with effective dates
- audit logging for salary changes
- configurable exchange rates
- monitoring and structured application logging
- additional database indexes based on measured query patterns

I would add these based on actual product requirements rather than introducing them into the MVP in advance.
