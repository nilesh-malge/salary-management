import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';
import { Prisma } from '../../generated/prisma/client';

describe('ReportsService', () => {
  let service: ReportsService;

  const queryRawMock = jest.fn<Promise<unknown[]>, [Prisma.Sql]>();

  const prisma = {
    $queryRaw: queryRawMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);

    jest.clearAllMocks();
  });

  describe('getPayrollSummary', () => {
    it('returns payroll summary for active employees in INR', async () => {
      prisma.$queryRaw.mockResolvedValue([
        {
          totalPayroll: 12500000,
          averageSalary: 750000,
          medianSalary: 700000,
          employeeCount: 20,
        },
      ]);

      const result = await service.getPayrollSummary();

      expect(result).toEqual({
        totalPayroll: 12500000,
        averageSalary: 750000,
        medianSalary: 700000,
        employeeCount: 20,
        currencyCode: 'INR',
      });

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('returns zero values when there are no active employees', async () => {
      prisma.$queryRaw.mockResolvedValue([
        {
          totalPayroll: 0,
          averageSalary: 0,
          medianSalary: 0,
          employeeCount: 0,
        },
      ]);

      const result = await service.getPayrollSummary();

      expect(result).toEqual({
        totalPayroll: 0,
        averageSalary: 0,
        medianSalary: 0,
        employeeCount: 0,
        currencyCode: 'INR',
      });
    });
  });

  describe('getDepartmentBreakdown', () => {
    it('returns payroll breakdown by department in INR', async () => {
      const breakdown = [
        {
          department: 'Engineering',
          totalPayroll: 15000000,
          averageSalary: 1500000,
          employeeCount: 10,
        },
        {
          department: 'Product',
          totalPayroll: 8000000,
          averageSalary: 1000000,
          employeeCount: 8,
        },
      ];

      prisma.$queryRaw.mockResolvedValue(breakdown);

      await expect(service.getDepartmentBreakdown()).resolves.toEqual([
        {
          department: 'Engineering',
          totalPayroll: 15000000,
          averageSalary: 1500000,
          employeeCount: 10,
          currencyCode: 'INR',
        },
        {
          department: 'Product',
          totalPayroll: 8000000,
          averageSalary: 1000000,
          employeeCount: 8,
          currencyCode: 'INR',
        },
      ]);
    });

    it('applies report filters to department breakdown', async () => {
      const breakdown = [
        {
          department: 'Engineering',
          totalPayroll: 400450000,
          averageSalary: 1779777.7777777778,
          employeeCount: 225,
        },
      ];

      prisma.$queryRaw.mockResolvedValue(breakdown);

      await service.getDepartmentBreakdown({
        department: 'Engineering',
        country: 'India',
      });

      const query = queryRawMock.mock.calls[0][0];

      expect(query.values).toContain('Engineering');
      expect(query.values).toContain('India');
    });
  });

  describe('getCountryBreakdown', () => {
    it('returns payroll breakdown by country in INR', async () => {
      const breakdown = [
        {
          country: 'India',
          totalPayroll: 12000000,
          averageSalary: 800000,
          employeeCount: 15,
        },
        {
          country: 'United States',
          totalPayroll: 18000000,
          averageSalary: 1200000,
          employeeCount: 15,
        },
      ];

      prisma.$queryRaw.mockResolvedValue(breakdown);

      await expect(service.getCountryBreakdown()).resolves.toEqual([
        {
          country: 'India',
          totalPayroll: 12000000,
          averageSalary: 800000,
          employeeCount: 15,
          currencyCode: 'INR',
        },
        {
          country: 'United States',
          totalPayroll: 18000000,
          averageSalary: 1200000,
          employeeCount: 15,
          currencyCode: 'INR',
        },
      ]);
    });

    it('applies report filters to country breakdown', async () => {
      const breakdown = [
        {
          country: 'India',
          totalPayroll: 400450000,
          averageSalary: 1779777.7777777778,
          employeeCount: 225,
        },
      ];

      prisma.$queryRaw.mockResolvedValue(breakdown);

      await service.getCountryBreakdown({
        department: 'Engineering',
        country: 'India',
      });

      const query = queryRawMock.mock.calls[0][0];

      expect(query.values).toContain('Engineering');
      expect(query.values).toContain('India');
    });
  });

  describe('getSalaryDistribution', () => {
    it('returns salary distribution in INR', async () => {
      const distribution = [
        {
          salaryRange: '0-2M',
          employeeCount: 1200,
        },
        {
          salaryRange: '2M-5M',
          employeeCount: 2800,
        },
        {
          salaryRange: '5M-10M',
          employeeCount: 3500,
        },
        {
          salaryRange: '10M+',
          employeeCount: 2000,
        },
      ];

      prisma.$queryRaw.mockResolvedValue(distribution);

      await expect(service.getSalaryDistribution()).resolves.toEqual(
        distribution,
      );
    });

    it('applies report filters to salary distribution', async () => {
      const distribution = [
        {
          salaryRange: '0-2M',
          employeeCount: 225,
        },
      ];

      prisma.$queryRaw.mockResolvedValue(distribution);

      await service.getSalaryDistribution({
        department: 'Engineering',
        country: 'India',
      });

      const query = queryRawMock.mock.calls[0][0];

      expect(query.values).toContain('Engineering');
      expect(query.values).toContain('India');
    });
  });

  it('applies department and country filters to payroll summary', async () => {
    const summary = {
      totalPayroll: 9000000,
      averageSalary: 900000,
      medianSalary: 850000,
      employeeCount: 10,
    };

    prisma.$queryRaw.mockResolvedValue([summary]);

    await expect(
      service.getPayrollSummary({
        department: 'Engineering',
        country: 'India',
      }),
    ).resolves.toEqual({
      ...summary,
      currencyCode: 'INR',
    });

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);

    const query = queryRawMock.mock.calls[0][0];

    expect(query.values).toContain('Engineering');
    expect(query.values).toContain('India');
  });
});
