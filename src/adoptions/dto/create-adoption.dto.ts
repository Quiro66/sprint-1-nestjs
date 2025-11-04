import { IsInt, IsPositive } from 'class-validator';

export class CreateAdoptionDto {
  @IsInt()
  @IsPositive()
  dragonId: number; // El ID del dragón que se quiere adoptar
}
