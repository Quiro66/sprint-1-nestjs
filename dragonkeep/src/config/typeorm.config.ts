import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Dragon } from '../entities/dragon.entity';
import { Adoption } from '../entities/adoption.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: parseInt(config.get('DB_PORT') || '5432', 10),
    username: config.get('DB_USER'),
    password: config.get('DB_PASS'),
    database: config.get('DB_NAME'),
    synchronize: false,
    logging: false,
    entities: [User, Dragon, Adoption, RefreshToken],
    migrations: ['migrations/*.ts']
  })
};

// Standalone DataSource for CLI
export const dataSourceOptions = (cfg: Record<string, any>): DataSourceOptions => ({
  type: 'postgres',
  host: cfg.DB_HOST,
  port: parseInt(cfg.DB_PORT || '5432', 10),
  username: cfg.DB_USER,
  password: cfg.DB_PASS,
  database: cfg.DB_NAME,
  entities: [User, Dragon, Adoption, RefreshToken],
  migrations: ['migrations/*.ts'],
  synchronize: false,
  logging: false
});

const env = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME
};
export const AppDataSource = new DataSource(dataSourceOptions(env));
