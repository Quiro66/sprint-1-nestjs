// ...new file...
import { IsUUID } from 'class-validator';

export class CreateAdoptionDto {
  @IsUUID()
  dragonId: string;
}

