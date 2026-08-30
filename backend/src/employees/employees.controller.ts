import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
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
    return this.employeesService.findAll({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      department: query.department,
      country: query.country,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, data);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.deactivate(id);
  }

  @Patch(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.activate(id);
  }
}
