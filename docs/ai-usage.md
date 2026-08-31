# AI Usage

I used AI during this assignment as a development assistant. I mainly used it to discuss implementation options, review code, debug issues, and think about test cases.

I did not generate the complete application in one go. I worked on the project step by step and reviewed each change before moving ahead.

## Planning and design

At the beginning, I used AI to discuss a few decisions where there were multiple possible approaches.

For example:

- Should salary be stored on the Employee table or in a separate table?

- How should salaries from different countries be compared in reports?

- What should happen to an employee record when the employee leaves?

- Do we need microservices or caching for around 10,000 employees?

- What should be part of the MVP and what can be left for later?

After going through the requirements, I decided to keep the current salary on the Employee model. Since salary history was not required for the MVP, adding another table only for the current salary would make the model more complicated without much benefit.

I used ACTIVE and INACTIVE status instead of deleting employees because I wanted to keep their records available.

Employees keep their salary in their local currency. For reports, salaries are converted to INR using the fixed exchange rates stored in the database.

I also kept the backend as a single NestJS application with separate modules for employee management and reporting. For the current requirement and data size, I did not see a need for microservices or Redis.

## Development

During development, I used AI when I needed another view on an implementation or when I was stuck on an issue.

Some examples were:

- Prisma and PostgreSQL configuration

- NestJS DTO validation

- search, filters, sorting and pagination

- payroll reporting logic

- connecting the Next.js frontend with the API

- Jest and React Testing Library tests

- GitHub Actions configuration

I implemented the application in small parts and committed working changes separately instead of building everything together.

## Debugging

I also used AI while debugging problems.

For example, when I had issues around Prisma configuration, database connectivity, validation, API integration, or test setup, I used AI to understand possible causes and compare solutions.

I did not assume that a suggested fix was correct. After making a change, I ran the relevant test, API request, build, or application flow again to verify it.

## Testing

AI helped me think about cases that I might otherwise miss, especially:

- duplicate employee code or email

- invalid employee input

- unsupported currency

- employee not found

- activating and deactivating employees

- payroll calculations

- frontend employee actions

I kept the tests focused on application behavior.

During development I used tests, linting, builds, API testing, and manual browser testing to check the application.

GitHub Actions also runs the automated tests, lint, and builds for both the backend and frontend.

## What I took from AI

The most useful part of AI for me was getting quick feedback while thinking through a problem or debugging something.

I still made the final decision based on the requirement and the current scope of the application.

For example, I did not add microservices, Redis, live exchange rates, or a complex salary history model just because they could be added. I kept them out because the current requirement did not need them.

The final requirements and technical decisions are documented in `requirements.md` and `design.md`.
