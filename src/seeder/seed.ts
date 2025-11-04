import { AppSourceData } from '../config/db';
import { Dragon } from '../dragons/entities/dragon.entity';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { Adoption } from '../adoptions/entities/adoption.entity';
import { dragonsData } from './data/dragons';
import { usersData } from './data/users';
import * as bcrypt from 'bcrypt';

async function runSeed() {
  await AppSourceData.initialize();
  const manager = AppSourceData.manager;

  console.log('Clearing tables...');
  await manager.query('TRUNCATE TABLE "adoptions", "dragons", "caretakers" CASCADE');

  console.log('Hashing passwords...');
  const usersWithHash = await Promise.all(
    usersData.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  console.log('Seeding caretakers...');
  await manager.save(Caretaker, usersWithHash);

  console.log('Seeding dragons...');
  await manager.save(Dragon, dragonsData);

  console.log('✅ Seed completed!');
  await AppSourceData.destroy();
}

runSeed().catch((err) => {
  console.error('❌ Error during seeding:', err);
});
