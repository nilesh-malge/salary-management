import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { EmployeeStatus, PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const exchangeRates = [
  { currencyCode: 'INR', rateToBase: 1 },
  { currencyCode: 'USD', rateToBase: 83 },
  { currencyCode: 'EUR', rateToBase: 90 },
  { currencyCode: 'GBP', rateToBase: 106 },
  { currencyCode: 'AED', rateToBase: 22.6 },
];

const locations = [
  { country: 'India', currencyCode: 'INR' },
  { country: 'United States', currencyCode: 'USD' },
  { country: 'Germany', currencyCode: 'EUR' },
  { country: 'United Kingdom', currencyCode: 'GBP' },
  { country: 'United Arab Emirates', currencyCode: 'AED' },
] as const;

const departmentRoles = {
  Engineering: [
    'Software Engineer',
    'Senior Software Engineer',
    'QA Engineer',
    'DevOps Engineer',
    'Engineering Manager',
  ],
  Product: ['Product Analyst', 'Product Manager', 'Senior Product Manager'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager'],
  HR: ['HR Executive', 'HR Business Partner', 'HR Manager'],
  Sales: ['Sales Executive', 'Account Manager', 'Sales Manager'],
  Marketing: [
    'Marketing Executive',
    'Digital Marketing Specialist',
    'Marketing Manager',
  ],
  Operations: [
    'Operations Executive',
    'Operations Analyst',
    'Operations Manager',
  ],
  'Customer Support': [
    'Support Executive',
    'Customer Support Specialist',
    'Support Manager',
  ],
} as const;

const salaryRanges = {
  INR: { min: 400000, max: 3000000 },
  USD: { min: 45000, max: 180000 },
  EUR: { min: 40000, max: 140000 },
  GBP: { min: 38000, max: 130000 },
  AED: { min: 80000, max: 350000 },
} as const;

const firstNames = [
  'Amit',
  'Priya',
  'Rahul',
  'Sneha',
  'Arjun',
  'Neha',
  'Rohan',
  'Ananya',
  'Vikram',
  'Pooja',
  'Daniel',
  'Emma',
  'James',
  'Olivia',
  'Liam',
  'Sophia',
  'Noah',
  'Mia',
  'Lucas',
  'Emily',
];

const lastNames = [
  'Sharma',
  'Patel',
  'Verma',
  'Gupta',
  'Mehta',
  'Kulkarni',
  'Joshi',
  'Singh',
  'Brown',
  'Smith',
  'Miller',
  'Wilson',
  'Taylor',
  'Anderson',
  'Martin',
  'Thomas',
  'Schmidt',
  'Muller',
  'Khan',
  'Clark',
];

const departments = Object.keys(departmentRoles) as Array<
  keyof typeof departmentRoles
>;

function getSalary(index: number, currencyCode: keyof typeof salaryRanges) {
  const range = salaryRanges[currencyCode];
  const span = range.max - range.min;

  const salary = range.min + ((index * 7919) % span);

  return Math.round(salary / 1000) * 1000;
}

function buildEmployees(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const employeeNumber = index + 1;

    const location = locations[(index * 7) % locations.length];
    const department = departments[(index * 3) % departments.length];

    const roles = departmentRoles[department];
    const jobTitle = roles[index % roles.length];

    const firstName = firstNames[index % firstNames.length];

    const lastName =
      lastNames[Math.floor(index / firstNames.length) % lastNames.length];

    return {
      employeeCode: `EMP${employeeNumber.toString().padStart(5, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${employeeNumber}@example.com`,
      department,
      country: location.country,
      jobTitle,
      salary: getSalary(employeeNumber, location.currencyCode),
      currencyCode: location.currencyCode,
      status:
        employeeNumber % 20 === 0
          ? EmployeeStatus.INACTIVE
          : EmployeeStatus.ACTIVE,
    };
  });
}

async function main() {
  for (const rate of exchangeRates) {
    await prisma.exchangeRate.upsert({
      where: {
        currencyCode: rate.currencyCode,
      },
      update: {
        rateToBase: rate.rateToBase,
      },
      create: rate,
    });
  }

  console.log(`Seeded ${exchangeRates.length} exchange rates`);

  const employees = buildEmployees(10000);

  await prisma.employee.deleteMany();

  const batchSize = 1000;

  for (let start = 0; start < employees.length; start += batchSize) {
    const batch = employees.slice(start, start + batchSize);

    await prisma.employee.createMany({
      data: batch,
    });
  }

  console.log(`Seeded ${employees.length} employees`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
