import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListEmployeesQueryDto } from './list-employees-query.dto';

describe('ListEmployeesQueryDto', () => {
  it('should transform valid pagination values', async () => {
    const dto = plainToInstance(ListEmployeesQueryDto, {
      page: '2',
      pageSize: '20',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.pageSize).toBe(20);
  });

  it('should reject a non-string search value', async () => {
    const dto = plainToInstance(ListEmployeesQueryDto, {
      page: '1',
      pageSize: '10',
      search: 123,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
  it('should reject an invalid employee status', async () => {
    const dto = plainToInstance(ListEmployeesQueryDto, {
      page: '1',
      pageSize: '10',
      department: 'Engineering',
      country: 'India',
      status: 'UNKNOWN',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
