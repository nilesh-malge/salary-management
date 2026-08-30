import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeeSortField, SortOrder } from './dto/list-employees-query.dto';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  const employeesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
    activate: jest.fn(),
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

  describe('update', () => {
    it('should update an employee', async () => {
      const updateData = {
        jobTitle: 'Senior Software Engineer',
        salary: 1100000,
      };

      const response = {
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
      };

      employeesServiceMock.update.mockResolvedValue(response);

      const result = await controller.update(1, updateData);

      expect(employeesServiceMock.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(response);
    });
  });

  describe('deactivate', () => {
    it('should deactivate an employee', async () => {
      const response = {
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
      };

      employeesServiceMock.deactivate.mockResolvedValue(response);

      const result = await controller.deactivate(1);

      expect(employeesServiceMock.deactivate).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    });
  });

  describe('activate', () => {
    it('should activate an employee', async () => {
      const response = {
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
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      employeesServiceMock.activate.mockResolvedValue(response);

      const result = await controller.activate(1);

      expect(employeesServiceMock.activate).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
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

      expect(employeesServiceMock.findAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
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

      expect(employeesServiceMock.findAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        search: 'amit',
      });
    });

    it('should pass filters to the service', async () => {
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
        department: 'Engineering',
        country: 'India',
        status: 'ACTIVE',
      });

      expect(employeesServiceMock.findAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        department: 'Engineering',
        country: 'India',
        status: 'ACTIVE',
      });
    });

    it('should pass sorting options to the service', async () => {
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
        sortBy: EmployeeSortField.SALARY,
        sortOrder: SortOrder.DESC,
      });

      expect(employeesServiceMock.findAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        sortBy: EmployeeSortField.SALARY,
        sortOrder: SortOrder.DESC,
      });
    });
  });
});
