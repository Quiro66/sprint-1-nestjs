import { DataSource } from 'typeorm';
import { Dragon } from "../dragons/entities/dragon.entity";
import { Caretaker } from "../caretakers/entities/caretaker.entity";
import { Adoption } from "../adoptions/entities/adoption.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppSourceData = new DataSource({
  type: "postgres",
  host: 'localhost',
  port: Number( 5433),
  username: 'postgres',
  password: 'perla',
  database: 'dragonkeepdb',
  entities: [Dragon, Caretaker, Adoption],
  synchronize: true, // only in development
  logging: true,
  migrations: ["dist/migrations/migration/*"],
});
