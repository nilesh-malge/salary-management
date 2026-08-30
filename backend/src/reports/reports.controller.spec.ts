import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  const reportsService = {
    getPayrollSummary: jest.fn(),
    getDepartmentBreakdown: jest.fn(),
    getCountryBreakdown: jest.fn(),
    getSalaryDistribution: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: reportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);

    jest.clearAllMocks();
  });

  describe('getPayrollSummary', () => {
    it('returns the payroll summary from the service', async () => {
      const summary = {
        totalPayroll: 12500000,
        averageSalary: 750000,
        medianSalary: 700000,
        employeeCount: 20,
        currencyCode: 'INR',
      };

      reportsService.getPayrollSummary.mockResolvedValue(summary);

      const result = await controller.getPayrollSummary({});

      expect(result).toEqual(summary);
      expect(reportsService.getPayrollSummary).toHaveBeenCalledTimes(1);
    });
  });

  it('returns payroll breakdown by department', async () => {
    const breakdown = [
      {
        department: 'Engineering',
        totalPayroll: 15000000,
        averageSalary: 1500000,
        employeeCount: 10,
        currencyCode: 'INR',
      },
    ];

    reportsService.getDepartmentBreakdown.mockResolvedValue(breakdown);

    await expect(controller.getDepartmentBreakdown({})).resolves.toEqual(
      breakdown,
    );

    expect(reportsService.getDepartmentBreakdown).toHaveBeenCalledTimes(1);
  });

  it('passes report filters to the department breakdown service', async () => {
    const filters = {
      department: 'Engineering',
      country: 'India',
    };

    const breakdown = [
      {
        department: 'Engineering',
        totalPayroll: 400450000,
        averageSalary: 1779777.7777777778,
        employeeCount: 225,
        currencyCode: 'INR',
      },
    ];

    reportsService.getDepartmentBreakdown.mockResolvedValue(breakdown);

    await expect(controller.getDepartmentBreakdown(filters)).resolves.toEqual(
      breakdown,
    );

    expect(reportsService.getDepartmentBreakdown).toHaveBeenCalledWith(filters);
  });

  it('passes report filters to the payroll summary service', async () => {
    const filters = {
      department: 'Engineering',
      country: 'India',
    };

    const summary = {
      totalPayroll: 9000000,
      averageSalary: 900000,
      medianSalary: 850000,
      employeeCount: 10,
      currencyCode: 'INR',
    };

    reportsService.getPayrollSummary.mockResolvedValue(summary);

    await expect(controller.getPayrollSummary(filters)).resolves.toEqual(
      summary,
    );

    expect(reportsService.getPayrollSummary).toHaveBeenCalledWith(filters);
  });

  describe('getCountryBreakdown', () => {
    it('returns payroll breakdown by country', async () => {
      const breakdown = [
        {
          country: 'India',
          totalPayroll: 12000000,
          averageSalary: 800000,
          employeeCount: 15,
          currencyCode: 'INR',
        },
      ];

      reportsService.getCountryBreakdown.mockResolvedValue(breakdown);

      await expect(controller.getCountryBreakdown({})).resolves.toEqual(
        breakdown,
      );

      expect(reportsService.getCountryBreakdown).toHaveBeenCalledTimes(1);
    });

    it('passes report filters to the country breakdown service', async () => {
      const filters = {
        department: 'Engineering',
        country: 'India',
      };

      const breakdown = [
        {
          country: 'India',
          totalPayroll: 400450000,
          averageSalary: 1779777.7777777778,
          employeeCount: 225,
          currencyCode: 'INR',
        },
      ];

      reportsService.getCountryBreakdown.mockResolvedValue(breakdown);

      await expect(controller.getCountryBreakdown(filters)).resolves.toEqual(
        breakdown,
      );

      expect(reportsService.getCountryBreakdown).toHaveBeenCalledWith(filters);
    });
  });

  describe('getSalaryDistribution', () => {
    it('returns salary distribution', async () => {
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

      reportsService.getSalaryDistribution.mockResolvedValue(distribution);

      await expect(controller.getSalaryDistribution({})).resolves.toEqual(
        distribution,
      );

      expect(reportsService.getSalaryDistribution).toHaveBeenCalledTimes(1);
    });

    it('passes report filters to the salary distribution service', async () => {
      const filters = {
        department: 'Engineering',
        country: 'India',
      };

      const distribution = [
        {
          salaryRange: '0-2M',
          employeeCount: 225,
        },
      ];

      reportsService.getSalaryDistribution.mockResolvedValue(distribution);

      await expect(controller.getSalaryDistribution(filters)).resolves.toEqual(
        distribution,
      );

      expect(reportsService.getSalaryDistribution).toHaveBeenCalledWith(
        filters,
      );
    });
  });
});
