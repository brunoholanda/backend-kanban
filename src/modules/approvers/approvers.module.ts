import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApproversService } from './approvers.service';
import { ApproversController } from './approvers.controller';
import { Approver } from '../../entities/approver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Approver])],
  controllers: [ApproversController],
  providers: [ApproversService],
  exports: [ApproversService],
})
export class ApproversModule {}

