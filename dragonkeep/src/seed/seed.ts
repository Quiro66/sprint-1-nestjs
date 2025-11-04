import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../config/typeorm.config';
import { User } from '../entities/user.entity';
import { Dragon } from '../entities/dragon.entity';
import { Role } from '../common/enums/role.enum';
import { DragonType } from '../common/enums/dragon-type.enum';
import * as bcrypt from 'bcryptjs';



(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a DB. Sembrando datos...');

    const usersRepo = AppDataSource.getRepository(User);
    const dragonsRepo = AppDataSource.getRepository(Dragon);

    const adminEmail = 'admin@dragonkeep.io';
    const caretakerEmail = 'caretaker@dragonkeep.io';

    const admin = usersRepo.create({
      email: adminEmail,
      password: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
      fullName: 'Root Admin'
    });
    const caretaker = usersRepo.create({
      email: caretakerEmail,
      password: await bcrypt.hash('secret123', 10),
      role: Role.CARETAKER,
      fullName: 'Jane Care'
    });

    const existingAdmin = await usersRepo.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) await usersRepo.save(admin);
    const existingC = await usersRepo.findOne({ where: { email: caretakerEmail } });
    if (!existingC) await usersRepo.save(caretaker);

    const samples = [
      { name: 'Smoulder', age: 120, type: DragonType.FIRE, temperament: 'fiery and loyal' },
      { name: 'Glacia', age: 80, type: DragonType.ICE, temperament: 'calm and observant' },
      { name: 'Terranox', age: 200, type: DragonType.EARTH, temperament: 'stoic protector' }
    ];
    for (const s of samples) {
      const exists = await dragonsRepo.findOne({ where: { name: s.name } });
      if (!exists) await dragonsRepo.save(dragonsRepo.create(s as any));
    }
    console.log('✅ Seed OK');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
