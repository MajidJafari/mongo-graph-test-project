import { ActivationStatus } from '../../types/global';

export class StoreCreateDto {
  name: string;
  parentStore: string;
  status?: ActivationStatus;
}
