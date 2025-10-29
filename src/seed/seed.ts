// src/seed.ts
import { AppDataSource } from './../data-source';
import { Dragon, FireType } from '../entities/dragon.entity';
import { Caretaker, UserRole } from '../entities/caretaker.entity';
import * as bcrypt from 'bcrypt';

async function run() {
  await AppDataSource.initialize();

  const dragonRepo = AppDataSource.getRepository(Dragon);
  const userRepo = AppDataSource.getRepository(Caretaker);

  // Evitar duplicados
  const existing = await dragonRepo.count();
  if (existing > 0) {
    console.log('Seed skipped: dragons already exist.');
    await AppDataSource.destroy();
    process.exit(0);
  }

  const dragons = [
    dragonRepo.create({
      name: 'FuegoRojo',
      age: 5,
      breed: 'Draco Ignis',
      fireType: FireType.FIRE,
      aggressionLevel: 3,
    }),
    dragonRepo.create({
      name: 'HieloSutil',
      age: 3,
      breed: 'Cryo Serpent',
      fireType: FireType.ICE,
      aggressionLevel: 1,
    }),
    dragonRepo.create({
      name: 'TormentaAlada',
      age: 7,
      breed: 'Stormwing',
      fireType: FireType.STORM,
      aggressionLevel: 5,
    }),
  ];
  await dragonRepo.save(dragons);
  console.log('Dragons seeded.');

  const saltRounds = 10;
  const adminPass = await bcrypt.hash(process.env.SEED_ADMIN_PASS || 'admin123', saltRounds);
  const caretakerPass = await bcrypt.hash(process.env.SEED_CARETAKER_PASS || 'caretaker123', saltRounds);

  const admin = userRepo.create({
    fullName: 'Admin Demo',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@dragonkeep.test',
    password: adminPass,
    role: UserRole.ADMIN,
  });

  const caretaker = userRepo.create({
    fullName: 'Caretaker Demo',
    email: process.env.SEED_CARETAKER_EMAIL || 'caretaker@dragonkeep.test',
    password: caretakerPass,
    role: UserRole.CARETAKER,
  });

  await userRepo.save([admin, caretaker]);
  console.log('Users seeded.');

  await AppDataSource.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});