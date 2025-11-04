import { UserRole } from '../../caretakers/caretaker.enums';

export const usersData = [
  {
    name: "Master Admin",
    email: "master@gmail.com",
    password: "12345678", // TypeORM hasheará automáticamente
    role: UserRole.ADMIN,
  },
  {
    name: "Ash Ketchup",
    email: "ash@gmail.com",
    password: "12345678",
    role: UserRole.CARETAKER,
  },
];
