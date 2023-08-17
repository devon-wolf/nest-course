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

  const updatedCoffeeFixture = {
    ...coffeeFixture,
    name: 'New Name',
  };

  const expectedCoffee = expect.objectContaining({
    ...coffeeFixture,
    flavors: expect.arrayContaining(
      coffeeFixture.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });

  const updatedExpectedCoffee = expect.objectContaining({
    ...updatedCoffeeFixture,
    flavors: expect.arrayContaining(
      updatedCoffeeFixture.flavors.map((name) =>
        expect.objectContaining({ name }),
      ),
    ),
  });

  let app: INestApplication;
  let httpServer: any;
  let coffeeId: number;

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
    httpServer = app.getHttpServer();

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
    return request(httpServer)
      .post('/coffees')
      .send(<CreateCoffeeDto>coffeeFixture)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        coffeeId = body.id;
        expect(body).toEqual(expectedCoffee);
      });
  });

  test('Get all [GET /]', () => {
    return request(httpServer)
      .get('/coffees')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual([expectedCoffee]);
      });
  });

  test('Get one [GET /:id]', () => {
    return request(httpServer)
      .get(`/coffees/${coffeeId}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(expectedCoffee);
      });
  });

  // TODO: update this test as the service updates to be more of a real patch
  test('Update one [PATCH /:id]', () => {
    return request(httpServer)
      .patch(`/coffees/${coffeeId}`)
      .send(updatedCoffeeFixture)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(updatedExpectedCoffee);
      });
  });

  test('Delete one [DELETE /:id]', () => {
    return request(httpServer)
      .delete(`/coffees/${coffeeId}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(updatedExpectedCoffee);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
