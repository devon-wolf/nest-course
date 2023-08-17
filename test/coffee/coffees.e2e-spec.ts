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

  test('Create [POST /]', async () => {
    const response = await request(httpServer)
      .post('/coffees')
      .send(<CreateCoffeeDto>coffeeFixture);

    coffeeId = response.body.id;

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual(expectedCoffee);
  });

  test('Get all [GET /]', async () => {
    const response = await request(httpServer).get('/coffees');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual([expectedCoffee]);
  });

  test('Get one [GET /:id]', async () => {
    const response = await request(httpServer).get(`/coffees/${coffeeId}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(expectedCoffee);
  });

  // TODO: update this test as the service updates to be more of a real patch
  test('Update one [PATCH /:id]', async () => {
    const response = await request(httpServer)
      .patch(`/coffees/${coffeeId}`)
      .send(updatedCoffeeFixture);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(updatedExpectedCoffee);
  });

  test('Delete one [DELETE /:id]', async () => {
    const response = await request(httpServer).delete(`/coffees/${coffeeId}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(updatedExpectedCoffee);
  });

  afterAll(async () => {
    await app.close();
  });
});
