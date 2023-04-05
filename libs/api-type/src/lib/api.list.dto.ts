import { StateE } from './state.enum';

export class ApiListDto {
  cityId?: number;
  limit?: number;
  start?: number;
  status?: StateE;
}
