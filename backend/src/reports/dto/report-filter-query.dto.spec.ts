import { validate } from 'class-validator';
import { ReportFilterQueryDto } from './report-filter-query.dto';

describe('ReportFilterQueryDto', () => {
  it('accepts valid department and country filters', async () => {
    const dto = new ReportFilterQueryDto();
    dto.department = 'Engineering';
    dto.country = 'India';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('allows filters to be omitted', async () => {
    const dto = new ReportFilterQueryDto();

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects an empty department filter', async () => {
    const dto = new ReportFilterQueryDto();
    dto.department = '';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });
});
