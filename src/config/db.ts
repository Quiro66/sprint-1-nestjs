import { DataSource } from 'typeorm';
import { Dragon } from "../dragons/entities/dragon.entity";
import { Caretaker } from "../caretakers/entities/caretaker.entity";
import { Adoption } from "../adoptions/entities/adoption.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppSourceData = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: [Dragon, Caretaker, Adoption],
  synchronize: true, // change it for real project, true only for development
  logging: true,
  migrations: ["dist/migrations/migration/*"], // folder for transpilate migrations
});