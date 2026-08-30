import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFilterQueryDto } from './dto/report-filter-query.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('payroll-summary')
  async getPayrollSummary(@Query() filters: ReportFilterQueryDto) {
    return this.reportsService.getPayrollSummary(filters);
  }

  @Get('payroll-by-department')
  async getDepartmentBreakdown(@Query() filters: ReportFilterQueryDto) {
    return this.reportsService.getDepartmentBreakdown(filters);
  }

  @Get('payroll-by-country')
  async getCountryBreakdown(@Query() filters: ReportFilterQueryDto) {
    return this.reportsService.getCountryBreakdown(filters);
  }

  @Get('salary-distribution')
  async getSalaryDistribution(@Query() filters: ReportFilterQueryDto) {
    return this.reportsService.getSalaryDistribution(filters);
  }
}
