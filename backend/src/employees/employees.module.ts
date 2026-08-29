import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [PrismaModule],
  providers: [EmployeesService],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
