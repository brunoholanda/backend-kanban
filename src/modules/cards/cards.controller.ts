import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';
import { CardStatus } from '../../entities/card.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @Request() req) {
    return this.cardsService.create({
      ...createCardDto,
      companyId: req.user.companyId,
    });
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: CardStatus) {
    if (status) {
      return this.cardsService.findByStatus(status, req.user.companyId);
    }
    return this.cardsService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body('status') status: CardStatus) {
    return this.cardsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsService.remove(id);
  }
}
