// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Dragon } from './entities/dragon.entity';
import { Caretaker } from './entities/caretaker.entity';
import { Adoption } from './entities/adoption.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'dragon_db',
  entities: [Dragon, Caretaker, Adoption],
  synchronize: false, // usar migrations en producción
  logging: false,
});