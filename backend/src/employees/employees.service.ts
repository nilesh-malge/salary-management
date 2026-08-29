import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import type { Employee, Prisma } from '../../generated/prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async findAll(page: number, pageSize: number, search?: string) {
    const skip = (page - 1) * pageSize;

    const where: Prisma.EmployeeWhereInput | undefined = search
      ? {
          OR: [
            {
              employeeCode: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : undefined;

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        skip,
        take: pageSize,
        orderBy: {
          id: 'asc',
        },
        ...(where && { where }),
      }),
      this.prisma.employee.count({
        ...(where && { where }),
      }),
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
