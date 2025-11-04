import { DataSource } from 'typeorm';
import { Dragon } from '../dragons/entities/dragon.entity';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { Adoption } from '../adoptions/entities/adoption.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppSourceData = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'perla',
  database: process.env.DB_NAME || 'dragonkeepdb',
  entities: [Dragon, Caretaker, Adoption],
  synchronize: process.env.NODE_ENV !== 'production', // true solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/migration/*'],
});
