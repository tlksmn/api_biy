import { AddSellerDto } from './add-seller.dto';

export class ReintegrateSellerEventPayload {
  token: string;
  userId: number;
  userEmail: string;
  sellerId: number;
  data: AddSellerDto;
}
