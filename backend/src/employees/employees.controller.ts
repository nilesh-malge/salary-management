import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto';
import type { Employee } from '../../generated/prisma/client';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() data: CreateEmployeeDto): Promise<Employee> {
    return this.employeesService.create(data);
  }

  @Get()
  async findAll(@Query() query: ListEmployeesQueryDto) {
    return this.employeesService.findAll(
      query.page,
      query.pageSize,
      query.search,
    );
  }
}
