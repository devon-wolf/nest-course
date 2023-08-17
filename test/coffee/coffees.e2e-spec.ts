import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('Feature: Coffees - /coffees', () => {
  const coffeeFixture = {
    name: 'Test Roast',
    brand: 'Test Brand',
    flavors: ['testy', 'fake'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  test('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(<CreateCoffeeDto>coffeeFixture)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expected = expect.objectContaining({
          ...coffeeFixture,
          flavors: expect.arrayContaining(
            coffeeFixture.flavors.map((name) =>
              expect.objectContaining({ name }),
            ),
          ),
        });
        expect(body).toEqual(expected);
      });
  });

  test.todo('Get all [GET /]');
  test.todo('Get one [GET /:id]');
  test.todo('Update one [PATCH /:id]');
  test.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
