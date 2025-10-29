import { Dragon } from '../../dragons/entities/dragon.entity';
import { DragonStatus, DragonTypes } from '../../dragons/dragon.enums';


export const dragonsData: Partial<Dragon>[] = [
  {
    name: 'Smolder',
    type: DragonTypes.FIRE,
    age: 45,
    status: DragonStatus.AVAILABLE,
  },
  {
    name: 'Timothee',
    type: DragonTypes.ICE,
    age: 100,
    status: DragonStatus.AVAILABLE,
  },
  {
    name: 'Chimuelo',
    type: DragonTypes.STORM,
    age: 20,
    status: DragonStatus.AVAILABLE,
  },
  {
    name: 'Silva',
    type: DragonTypes.EARTH,
    age: 30,
    status: DragonStatus.AVAILABLE,
  }
];
