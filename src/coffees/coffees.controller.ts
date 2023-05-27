import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Post()
  create(@Body() body: unknown) {
    console.log('[POST]', body);
    return 'This action creates a coffee';
  }

  @Get()
  findAll() {
    return 'This action returns all coffees.';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns coffee #${id}`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    console.log('[PATCH]', id, body);
    return `This action updates coffee #${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes coffee #${id}`;
  }
}
