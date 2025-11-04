import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1700000000000 implements MigrationInterface {
    name = 'Init1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "email" varchar UNIQUE NOT NULL,
          "password" varchar NOT NULL,
          "role" varchar(20) NOT NULL DEFAULT 'caretaker',
          "fullName" varchar,
          "createdAt" timestamptz DEFAULT now(),
          "updatedAt" timestamptz DEFAULT now()
        );`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "dragons" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar UNIQUE NOT NULL,
          "age" integer NOT NULL,
          "type" varchar(20) NOT NULL,
          "status" varchar(20) NOT NULL DEFAULT 'available',
          "temperament" varchar,
          "createdAt" timestamptz DEFAULT now(),
          "updatedAt" timestamptz DEFAULT now()
        );`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "adoptions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "caretakerId" uuid REFERENCES "users"("id") ON DELETE NO ACTION,
          "dragonId" uuid REFERENCES "dragons"("id") ON DELETE NO ACTION,
          "adoptedAt" timestamptz,
          "releasedAt" timestamptz,
          "createdAt" timestamptz DEFAULT now(),
          "updatedAt" timestamptz DEFAULT now()
        );`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "refresh_tokens" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "token" varchar NOT NULL,
          "expiresAt" timestamptz NOT NULL,
          "userId" uuid REFERENCES "users"("id") ON DELETE CASCADE,
          "createdAt" timestamptz DEFAULT now()
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "adoptions";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "dragons";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
    }

}
