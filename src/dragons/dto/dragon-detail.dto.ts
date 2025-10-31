import { DragonStatus, FireType } from '../../entities/dragon.entity';

export class DragonDetailDto {
  id: string;
  name: string;
  age: number;
  breed: string;
  fireType: FireType;
  aggressionLevel: number;
  status: DragonStatus;
  createdAt: Date;
  updatedAt: Date;
}

