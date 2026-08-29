import { validate } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

describe('CreateEmployeeDto', () => {
  it('should reject invalid employee data', async () => {
    const dto = new CreateEmployeeDto();

    dto.employeeCode = '';
    dto.firstName = '';
    dto.lastName = '';
    dto.email = 'invalid-email';
    dto.department = '';
    dto.country = '';
    dto.jobTitle = '';
    dto.salary = 0;
    dto.currencyCode = 'IN';

    const errors = await validate(dto, {
      forbidUnknownValues: false,
    });

    expect(errors.length).toBeGreaterThan(0);
  });
});
