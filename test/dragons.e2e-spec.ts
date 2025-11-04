import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Dragon } from '../src/dragons/entities/dragon.entity';
import { UserRole } from '../src/caretakers/caretaker.enums';
import { JwtService } from '@nestjs/jwt';

describe('DragonsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let adminToken: string;
  let dragonId: number;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Creamos un JWT de admin para las pruebas
    adminToken = jwtService.sign({ sub: 1, role: UserRole.ADMIN });
  });

  afterAll(async () => {
    await dataSource.getRepository(Dragon).clear();
    await app.close();
  });

  describe('POST /dragons', () => {
    it('should create a dragon', async () => {
      const res = await request(app.getHttpServer())
        .post('/dragons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Smaug',
          type: 'fire',
          age: 100,
          aggressivenessLevel: 9,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Smaug');
      dragonId = res.body.id;
    });

    it('should fail with duplicate name', async () => {
      await request(app.getHttpServer())
        .post('/dragons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Smaug',
          type: 'fire',
          age: 50,
          aggressivenessLevel: 5,
        })
        .expect(409);
    });
  });

  describe('GET /dragons', () => {
    it('should list dragons with pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/dragons?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter dragons by type', async () => {
      const res = await request(app.getHttpServer())
        .get('/dragons?type=fire')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.every((d) => d.type === 'fire')).toBe(true);
    });
  });

  describe('GET /dragons/:id', () => {
    it('should return a dragon with adoptions', async () => {
      const res = await request(app.getHttpServer())
        .get(`/dragons/${dragonId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', dragonId);
      expect(res.body).toHaveProperty('adoptions');
    });

    it('should return 404 for non-existent dragon', async () => {
      await request(app.getHttpServer())
        .get(`/dragons/99999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /dragons/:id', () => {
    it('should update a dragon', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/dragons/${dragonId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ age: 120 })
        .expect(200);

      expect(res.body.age).toBe(120);
    });

    it('should fail when updating to a duplicate name', async () => {
      // Crear otro dragón
      const otherDragon = await request(app.getHttpServer())
        .post('/dragons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Fafnir', type: 'ice', age: 50, aggressivenessLevel: 5 });

      await request(app.getHttpServer())
        .patch(`/dragons/${dragonId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Fafnir' })
        .expect(409);
    });
  });

  describe('DELETE /dragons/:id', () => {
    it('should delete a dragon', async () => {
      await request(app.getHttpServer())
        .delete(`/dragons/${dragonId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent dragon', async () => {
      await request(app.getHttpServer())
        .delete(`/dragons/${dragonId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
