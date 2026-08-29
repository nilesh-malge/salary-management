import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateEmployeeDto } from './update-employee.dto';

describe('UpdateEmployeeDto', () => {
  it('should accept valid partial employee updates', async () => {
    const dto = plainToInstance(UpdateEmployeeDto, {
      jobTitle: 'Senior Software Engineer',
      salary: 1100000,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject an invalid salary', async () => {
    const dto = plainToInstance(UpdateEmployeeDto, {
      salary: -1000,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
