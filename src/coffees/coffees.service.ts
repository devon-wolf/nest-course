import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    { id: 1, name: 'First Coffee', brand: 'My Brand', flavors: ['coffee'] },
  ];
  private currentId = 2;

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee = this.coffees.find((item) => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    this.coffees.push({ ...createCoffeeDto, id: this.currentId });
    this.currentId += 1;
    return createCoffeeDto;
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffeeIdx = this.coffees.findIndex((item) => item.id === +id);
    if (existingCoffeeIdx >= 0) {
      this.coffees[existingCoffeeIdx] = {
        ...this.coffees[existingCoffeeIdx],
        ...updateCoffeeDto,
      };
    }
  }

  remove(id: number) {
    const coffeeIdx = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIdx >= 0) {
      this.coffees.splice(coffeeIdx, 1);
    }
  }
}
