import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('payroll-summary')
  async getPayrollSummary() {
    return this.reportsService.getPayrollSummary();
  }

  @Get('payroll-by-department')
  async getDepartmentBreakdown() {
    return this.reportsService.getDepartmentBreakdown();
  }

  @Get('payroll-by-country')
  async getCountryBreakdown() {
    return this.reportsService.getCountryBreakdown();
  }
}
