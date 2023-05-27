import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    { id: 1, name: 'First Coffee', brand: 'My Brand', flavors: ['coffee'] },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    return this.coffees.find((item) => item.id === +id);
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: string, updateCoffeeDto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      console.log('UPDATE THE COFFEE');
    }
  }

  remove(id: string) {
    const coffeeIdx = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIdx >= 0) {
      this.coffees.splice(coffeeIdx, 1);
    }
  }
}
