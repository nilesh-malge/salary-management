import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReportFilterQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  department?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;
}
