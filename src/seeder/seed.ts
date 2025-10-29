import { AppSourceData } from '../config/db';
import { Dragon } from '../dragons/entities/dragon.entity';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { dragonsData } from './data/dragons';
import { usersData } from './data/users';

// Main function
async function runSeed() {
  await AppSourceData.initialize();
  console.log('Seeding database...');

  // Users and dragons injection
  await AppSourceData.manager.save(Caretaker, usersData);
  await AppSourceData.manager.save(Dragon, dragonsData);

  console.log('✅ Seed completed!');
  await AppSourceData.destroy();
}

// Run it
runSeed().catch((err) => {
  console.error('❌ Error during seeding:', err);
});
