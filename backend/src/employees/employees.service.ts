import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import {
  EmployeeStatus,
  type Employee,
  type Prisma,
} from '../../generated/prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async findAll({
    page,
    pageSize,
    search,
    department,
    country,
    status,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    department?: string;
    country?: string;
    status?: EmployeeStatus;
  }) {
    const skip = (page - 1) * pageSize;

    const where: Prisma.EmployeeWhereInput = {
      ...(department && { department }),
      ...(country && { country }),
      ...(status && { status }),
      ...(search && {
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
      }),
    };

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        skip,
        take: pageSize,
        orderBy: {
          id: 'asc',
        },
        ...(Object.keys(where).length > 0 && { where }),
      }),
      this.prisma.employee.count({
        ...(Object.keys(where).length > 0 && { where }),
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
