import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  EmployeeStatus,
  type Employee,
  type Prisma,
} from '../../generated/prisma/client';
import { EmployeeSortField, SortOrder } from './dto/list-employees-query.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateCurrency(currencyCode: string) {
    const exchangeRate = await this.prisma.exchangeRate.findUnique({
      where: {
        currencyCode,
      },
    });

    if (!exchangeRate) {
      throw new BadRequestException(
        `Unsupported currency code: ${currencyCode}`,
      );
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    await this.validateCurrency(createEmployeeDto.currencyCode);

    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  async update(id: number, data: UpdateEmployeeDto): Promise<Employee> {
    if (data.currencyCode) {
      await this.validateCurrency(data.currencyCode);
    }

    return this.prisma.employee.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id: number): Promise<Employee> {
    return this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        status: EmployeeStatus.INACTIVE,
      },
    });
  }

  async findAll({
    page,
    pageSize,
    search,
    department,
    country,
    status,
    sortBy,
    sortOrder,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    department?: string;
    country?: string;
    status?: EmployeeStatus;
    sortBy?: EmployeeSortField;
    sortOrder?: SortOrder;
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

    const orderBy: Prisma.EmployeeOrderByWithRelationInput = sortBy
      ? {
          [sortBy]: sortOrder ?? SortOrder.ASC,
        }
      : {
          id: 'asc',
        };

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        skip,
        take: pageSize,
        orderBy,
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
