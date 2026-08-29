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
  India: {
    Engineering: { min: 600000, max: 3200000 },
    Product: { min: 800000, max: 3000000 },
    Finance: { min: 500000, max: 2000000 },
    HR: { min: 400000, max: 1800000 },
    Sales: { min: 400000, max: 2200000 },
    Marketing: { min: 400000, max: 2000000 },
    Operations: { min: 400000, max: 1600000 },
    'Customer Support': { min: 350000, max: 1200000 },
  },
  'United States': {
    Engineering: { min: 70000, max: 180000 },
    Product: { min: 75000, max: 170000 },
    Finance: { min: 55000, max: 130000 },
    HR: { min: 50000, max: 120000 },
    Sales: { min: 50000, max: 145000 },
    Marketing: { min: 50000, max: 135000 },
    Operations: { min: 45000, max: 110000 },
    'Customer Support': { min: 38000, max: 85000 },
  },
  Germany: {
    Engineering: { min: 55000, max: 120000 },
    Product: { min: 55000, max: 115000 },
    Finance: { min: 45000, max: 95000 },
    HR: { min: 42000, max: 90000 },
    Sales: { min: 42000, max: 100000 },
    Marketing: { min: 42000, max: 95000 },
    Operations: { min: 40000, max: 85000 },
    'Customer Support': { min: 35000, max: 70000 },
  },
  'United Kingdom': {
    Engineering: { min: 50000, max: 110000 },
    Product: { min: 50000, max: 105000 },
    Finance: { min: 40000, max: 90000 },
    HR: { min: 38000, max: 85000 },
    Sales: { min: 38000, max: 95000 },
    Marketing: { min: 38000, max: 90000 },
    Operations: { min: 36000, max: 80000 },
    'Customer Support': { min: 30000, max: 65000 },
  },
  'United Arab Emirates': {
    Engineering: { min: 120000, max: 320000 },
    Product: { min: 130000, max: 300000 },
    Finance: { min: 100000, max: 240000 },
    HR: { min: 90000, max: 220000 },
    Sales: { min: 90000, max: 260000 },
    Marketing: { min: 90000, max: 230000 },
    Operations: { min: 85000, max: 200000 },
    'Customer Support': { min: 70000, max: 160000 },
  },
} as const;

function getRoleLevel(jobTitle: string) {
  if (jobTitle === 'Account Manager') {
    return 0.6;
  }

  if (jobTitle.includes('Manager')) {
    return 0.8;
  }

  if (
    jobTitle.includes('Senior') ||
    jobTitle.includes('Specialist') ||
    jobTitle.includes('Business Partner')
  ) {
    return 0.6;
  }

  return 0.35;
}

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

function getSalary(
  index: number,
  country: keyof typeof salaryRanges,
  department: keyof (typeof salaryRanges)[keyof typeof salaryRanges],
  jobTitle: string,
) {
  const range = salaryRanges[country][department];
  const span = range.max - range.min;

  const roleLevel = getRoleLevel(jobTitle);

  const variation = ((index * 7919) % 1000) / 1000;

  const positionInRange = Math.min(roleLevel + variation * 0.2, 0.95);

  const salary = range.min + span * positionInRange;

  return Math.round(salary / 1000) * 1000;
}

function getEmployeeStatus(index: number) {
  const block = Math.floor(index / 20);
  const positionInBlock = index % 20;

  return positionInBlock === block % 20
    ? EmployeeStatus.INACTIVE
    : EmployeeStatus.ACTIVE;
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
      salary: getSalary(employeeNumber, location.country, department, jobTitle),
      currencyCode: location.currencyCode,
      status: getEmployeeStatus(index),
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
