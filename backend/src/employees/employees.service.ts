import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import type { Employee } from '../../generated/prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        skip,
        take: pageSize,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.employee.count(),
    ]);

    return {
      data: employees,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
