import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  const reportsService = {
    getPayrollSummary: jest.fn(),
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

      const result = await controller.getPayrollSummary();

      expect(result).toEqual(summary);
      expect(reportsService.getPayrollSummary).toHaveBeenCalledTimes(1);
    });
  });
});
