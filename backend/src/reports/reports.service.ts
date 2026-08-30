import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReportFilterQueryDto } from './dto/report-filter-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildReportWhereClause(filters: ReportFilterQueryDto) {
    const conditions: Prisma.Sql[] = [Prisma.sql`e.status = 'ACTIVE'`];

    if (filters.department) {
      conditions.push(Prisma.sql`e.department = ${filters.department}`);
    }

    if (filters.country) {
      conditions.push(Prisma.sql`e.country = ${filters.country}`);
    }

    return Prisma.join(conditions, ' AND ');
  }

  async getPayrollSummary(filters: ReportFilterQueryDto = {}) {
    const whereClause = this.buildReportWhereClause(filters);
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
      WHERE ${whereClause}
    `);

    const summary = result[0];

    return {
      ...summary,
      currencyCode: 'INR',
    };
  }

  async getDepartmentBreakdown(filters: ReportFilterQueryDto = {}) {
    const whereClause = this.buildReportWhereClause(filters);
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
    WHERE ${whereClause}
    GROUP BY e.department
    ORDER BY e.department
  `);

    return result.map((department) => ({
      ...department,
      currencyCode: 'INR',
    }));
  }

  async getCountryBreakdown(filters: ReportFilterQueryDto = {}) {
    const whereClause = this.buildReportWhereClause(filters);
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
    WHERE ${whereClause}
    GROUP BY e.country
    ORDER BY e.country
  `);

    return result.map((country) => ({
      ...country,
      currencyCode: 'INR',
    }));
  }

  async getSalaryDistribution(filters: ReportFilterQueryDto = {}) {
    const whereClause = this.buildReportWhereClause(filters);
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
    WHERE ${whereClause}
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
