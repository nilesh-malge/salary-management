import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from './employees.service';
import { EmployeeSortField, SortOrder } from './dto/list-employees-query.dto';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const prismaMock = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const employeeData = {
        employeeCode: 'EMP001',
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'amit.sharma@example.com',
        department: 'Engineering',
        country: 'India',
        jobTitle: 'Software Engineer',
        salary: 900000,
        currencyCode: 'INR',
      };

      prismaMock.employee.create.mockResolvedValue({
        id: 1,
        ...employeeData,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(employeeData);

      expect(prismaMock.employee.create).toHaveBeenCalledWith({
        data: employeeData,
      });

      expect(result.employeeCode).toBe('EMP001');
    });
  });

  describe('findAll', () => {
    it('should return paginated employees', async () => {
      const employees = [
        {
          id: 1,
          employeeCode: 'EMP001',
          firstName: 'Amit',
          lastName: 'Sharma',
          email: 'amit.sharma@example.com',
          department: 'Engineering',
          country: 'India',
          jobTitle: 'Software Engineer',
          salary: 900000,
          currencyCode: 'INR',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.employee.findMany.mockResolvedValue(employees);
      prismaMock.employee.count.mockResolvedValue(1);

      const result = await service.findAll({
        page: 1,
        pageSize: 10,
      });

      expect(prismaMock.employee.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          id: 'asc',
        },
      });

      expect(prismaMock.employee.count).toHaveBeenCalled();

      expect(result).toEqual({
        data: employees,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('should search employees by employee code, name or email', async () => {
      prismaMock.employee.findMany.mockResolvedValue([]);
      prismaMock.employee.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        pageSize: 10,
        search: 'amit',
      });

      const where = {
        OR: [
          {
            employeeCode: {
              contains: 'amit',
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: 'amit',
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: 'amit',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: 'amit',
              mode: 'insensitive',
            },
          },
        ],
      };

      expect(prismaMock.employee.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          id: 'asc',
        },
        where,
      });

      expect(prismaMock.employee.count).toHaveBeenCalledWith({
        where,
      });
    });
    it('should filter employees by department, country and status', async () => {
      prismaMock.employee.findMany.mockResolvedValue([]);
      prismaMock.employee.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        pageSize: 10,
        department: 'Engineering',
        country: 'India',
        status: 'ACTIVE',
      });

      const where = {
        department: 'Engineering',
        country: 'India',
        status: 'ACTIVE',
      };

      expect(prismaMock.employee.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          id: 'asc',
        },
        where,
      });

      expect(prismaMock.employee.count).toHaveBeenCalledWith({
        where,
      });
    });

    it('should sort employees by the requested field and direction', async () => {
      prismaMock.employee.findMany.mockResolvedValue([]);
      prismaMock.employee.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        pageSize: 10,
        sortBy: EmployeeSortField.SALARY,
        sortOrder: SortOrder.DESC,
      });

      expect(prismaMock.employee.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          salary: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateData = {
        jobTitle: 'Senior Software Engineer',
        salary: 1100000,
      };

      prismaMock.employee.update.mockResolvedValue({
        id: 1,
        employeeCode: 'EMP001',
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'amit.sharma@example.com',
        department: 'Engineering',
        country: 'India',
        jobTitle: 'Senior Software Engineer',
        salary: 1100000,
        currencyCode: 'INR',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update(1, updateData);

      expect(prismaMock.employee.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: updateData,
      });

      expect(result.jobTitle).toBe('Senior Software Engineer');
      expect(result.salary).toBe(1100000);
    });
  });

  describe('deactivate', () => {
    it('should mark an employee as inactive', async () => {
      prismaMock.employee.update.mockResolvedValue({
        id: 1,
        employeeCode: 'EMP001',
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'amit.sharma@example.com',
        department: 'Engineering',
        country: 'India',
        jobTitle: 'Software Engineer',
        salary: 1000000,
        currencyCode: 'INR',
        status: 'INACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.deactivate(1);

      expect(prismaMock.employee.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          status: 'INACTIVE',
        },
      });

      expect(result.status).toBe('INACTIVE');
    });
  });
});
