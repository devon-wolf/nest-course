import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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
}
