import { AddSellerDto } from './add-seller.dto';

export class AddSellerEventPayload {
  userId: number;
  token: string;
  data: AddSellerDto;
}
export class UpdateSellerEventPayload extends AddSellerEventPayload {}
