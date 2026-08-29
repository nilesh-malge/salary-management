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
});
