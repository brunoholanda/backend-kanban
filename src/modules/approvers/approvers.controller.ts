import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { ApproversService } from './approvers.service';
import { CreateApproverDto, UpdateApproverDto } from './dto/approver.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('approvers')
@UseGuards(JwtAuthGuard)
export class ApproversController {
  constructor(private readonly approversService: ApproversService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createApproverDto: CreateApproverDto, @Request() req) {
    return this.approversService.create({
      ...createApproverDto,
      companyId: req.user.companyId,
    });
  }

  @Get()
  findAll(@Request() req) {
    return this.approversService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.approversService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateApproverDto: UpdateApproverDto) {
    return this.approversService.update(id, updateApproverDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.approversService.remove(id);
  }
}