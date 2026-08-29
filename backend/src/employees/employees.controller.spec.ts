import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  const employeesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: employeesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
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

      employeesServiceMock.create.mockResolvedValue({
        id: 1,
        ...employeeData,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.create(employeeData);

      expect(employeesServiceMock.create).toHaveBeenCalledWith(employeeData);
      expect(result.employeeCode).toBe('EMP001');
    });
  });

  describe('findAll', () => {
    it('should return paginated employees', async () => {
      const response = {
        data: [
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
        ],
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      };

      employeesServiceMock.findAll.mockResolvedValue(response);

      const result = await controller.findAll({
        page: 1,
        pageSize: 10,
      });

      expect(employeesServiceMock.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
      );
      expect(result).toEqual(response);
    });
    it('should pass search to the service', async () => {
      const response = {
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      };

      employeesServiceMock.findAll.mockResolvedValue(response);

      await controller.findAll({
        page: 1,
        pageSize: 10,
        search: 'amit',
      });

      expect(employeesServiceMock.findAll).toHaveBeenCalledWith(1, 10, 'amit');
    });
  });
});
