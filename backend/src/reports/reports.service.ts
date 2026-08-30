import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPayrollSummary() {
    const result = await this.prisma.$queryRaw<
      {
        totalPayroll: number;
        averageSalary: number;
        medianSalary: number;
        employeeCount: number;
      }[]
    >(Prisma.sql`
      SELECT
        COALESCE(SUM(e.salary * r."rateToBase"), 0)::float AS "totalPayroll",
        COALESCE(AVG(e.salary * r."rateToBase"), 0)::float AS "averageSalary",
        COALESCE(
          PERCENTILE_CONT(0.5) WITHIN GROUP (
            ORDER BY e.salary * r."rateToBase"
          ),
          0
        )::float AS "medianSalary",
        COUNT(*)::int AS "employeeCount"
      FROM "Employee" e
      JOIN "ExchangeRate" r
        ON r."currencyCode" = e."currencyCode"
      WHERE e.status = 'ACTIVE'
    `);

    const summary = result[0];

    return {
      ...summary,
      currencyCode: 'INR',
    };
  }

  async getDepartmentBreakdown() {
    const result = await this.prisma.$queryRaw<
      {
        department: string;
        totalPayroll: number;
        averageSalary: number;
        employeeCount: number;
      }[]
    >(Prisma.sql`
    SELECT
      e.department,
      COALESCE(SUM(e.salary * r."rateToBase"), 0)::float AS "totalPayroll",
      COALESCE(AVG(e.salary * r."rateToBase"), 0)::float AS "averageSalary",
      COUNT(*)::int AS "employeeCount"
    FROM "Employee" e
    JOIN "ExchangeRate" r
      ON r."currencyCode" = e."currencyCode"
    WHERE e.status = 'ACTIVE'
    GROUP BY e.department
    ORDER BY e.department
  `);

    return result.map((department) => ({
      ...department,
      currencyCode: 'INR',
    }));
  }

  async getCountryBreakdown() {
    const result = await this.prisma.$queryRaw<
      {
        country: string;
        totalPayroll: number;
        averageSalary: number;
        employeeCount: number;
      }[]
    >(Prisma.sql`
    SELECT
      e.country,
      COALESCE(SUM(e.salary * r."rateToBase"), 0)::float AS "totalPayroll",
      COALESCE(AVG(e.salary * r."rateToBase"), 0)::float AS "averageSalary",
      COUNT(*)::int AS "employeeCount"
    FROM "Employee" e
    JOIN "ExchangeRate" r
      ON r."currencyCode" = e."currencyCode"
    WHERE e.status = 'ACTIVE'
    GROUP BY e.country
    ORDER BY e.country
  `);

    return result.map((country) => ({
      ...country,
      currencyCode: 'INR',
    }));
  }

  async getSalaryDistribution() {
    const result = await this.prisma.$queryRaw<
      {
        salaryRange: string;
        employeeCount: number;
      }[]
    >(Prisma.sql`
    SELECT
      CASE
        WHEN e.salary * r."rateToBase" < 2000000 THEN '0-2M'
        WHEN e.salary * r."rateToBase" < 5000000 THEN '2M-5M'
        WHEN e.salary * r."rateToBase" < 10000000 THEN '5M-10M'
        ELSE '10M+'
      END AS "salaryRange",
      COUNT(*)::int AS "employeeCount"
    FROM "Employee" e
    JOIN "ExchangeRate" r
      ON r."currencyCode" = e."currencyCode"
    WHERE e.status = 'ACTIVE'
    GROUP BY
      CASE
        WHEN e.salary * r."rateToBase" < 2000000 THEN '0-2M'
        WHEN e.salary * r."rateToBase" < 5000000 THEN '2M-5M'
        WHEN e.salary * r."rateToBase" < 10000000 THEN '5M-10M'
        ELSE '10M+'
      END
    ORDER BY
      MIN(e.salary * r."rateToBase")
  `);

    return result;
  }
}
