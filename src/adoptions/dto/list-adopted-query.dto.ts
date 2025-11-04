// DTO para query params de listar adopciones por cuidador
export class ListAdoptedQueryDto {
  page?: number;
  limit?: number;
  status?: 'active' | 'finished' | 'all';
  type?: string; // corresponde a Dragon.fireType ("fire" | "ice" | "earth" | "storm")
}

